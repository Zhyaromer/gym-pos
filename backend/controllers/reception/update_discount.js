const db = require("../../config/mysql/mysqlconfig");

const update_discount = async (req, res) => {
    let { orderNumber, discount_type, discount_value } = req.body;

    if (!orderNumber || !discount_type || (discount_value === undefined || discount_value === null)) {
        return res.status(400).json({ error: 'Order number, discount type, and discount value are required' });
    }

    if(discount_type !== 'percentage' && discount_type !== 'fixed_amount' && discount_type !== 'none') {
        return res.status(400).json({ error: 'Invalid discount type' });
    }

    if (discount_type == 'fixed_amount' && discount_value >= 0) {
        discount_value = (discount_value.toLocaleString()).replace(/,/g, '.');
    }

    const sql1 = `SELECT total_amount FROM transactions WHERE orderNumber = ?`;
    const sql2 = `UPDATE transactions SET discount_type = ?, discount_value = ? , final_amount = ?  WHERE orderNumber = ?`;

    try {
        const [rows] = await db.query(sql1, [orderNumber]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        const totalAmount = rows[0].total_amount;

        let finalAmount = totalAmount;
        if (discount_type == 'percentage') {
            finalAmount -= (totalAmount * discount_value / 100);
        } else if (discount_type == 'fixed_amount') {
            finalAmount -= discount_value;
        } else if (discount_type == 'none') {
            finalAmount = totalAmount;
        }

        const [result] = await db.query(sql2, [discount_type, discount_value, finalAmount, orderNumber]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Transaction not found or no changes made' });
        }

        res.status(200).json({ message: 'Discount updated successfully' });
    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Database error' });
    }
}

module.exports = update_discount