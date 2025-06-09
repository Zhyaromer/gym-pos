const db = require("../../config/mysql/mysqlconfig");

const delete_item = async (req, res) => {
    console.log(req.body);
    let { barcode, line_total, quantity, transaction_id, discount_type, discount_value, final_amount, total_amount } = req.body;

    if ([barcode, line_total, quantity, transaction_id, discount_type, discount_value, final_amount, total_amount].some(v => v === undefined || v === null)) {
        return res.status(400).json({ error: 'all fields are required' });
    }

    if (isNaN(quantity) || isNaN(line_total) || isNaN(total_amount) || isNaN(discount_value)) {
        return res.status(400).json({ error: 'Invalid numeric values' });
    }

    if (quantity <= 0) {
        return res.status(400).json({ error: 'Quantity must be positive' });
    }

    total_amount -= parseFloat(line_total);

    let final_price = total_amount;
    if (discount_type == 'percentage') {
        final_price = total_amount * (1 - (discount_value / 100));
    } else if (discount_type == 'fixed_amount') {
        final_price = total_amount - discount_value;
    }

    const sql = `DELETE FROM transaction_items WHERE transaction_id = ? AND barcode = ? AND quantity = ?`;
    const updateStockSql = `UPDATE products SET stock = stock + ? WHERE barcode = ?`;
    const updateTransactionTotalSql = `
        UPDATE transactions 
        SET 
            total_amount = ?,
            final_amount = ?
        WHERE transaction_id = ?
    `;

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const [result1] = await connection.query(sql, [transaction_id, barcode, quantity]);

        if (result1.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Item not found or already deleted' });
        }

        const [result2] = await connection.query(updateStockSql, [quantity, barcode]);

        if (result2.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Product not found or stock update failed' });
        }

        const [result3] = await connection.query(updateTransactionTotalSql, [total_amount, final_price, transaction_id]);

        if (result3.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Transaction not found or total amount update failed' });
        }

        await connection.commit();
        return res.status(200).json({ message: 'Item deleted successfully' });
    } catch (err) {
        console.error('Error deleting item:', err);
        await connection.rollback();
        return res.status(500).json({ error: 'Internal server error' });
    } finally {
        connection.release();
    }
}

module.exports = delete_item;