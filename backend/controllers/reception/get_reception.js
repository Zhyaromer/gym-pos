const db = require("../../config/mysql/mysqlconfig");

const get_reception = async (_req, res) => {
    const { orderNumber } = _req.query;

    if (!orderNumber) {
        return res.status(400).json({ error: 'Order number is required' });
    }

    const sql1 = `select transaction_id,e_name,orderNumber,discount_type , discount_value , total_amount , final_amount , transaction_date from transactions where orderNumber = ?`;
    const sql2 = `select item_id,transaction_id,barcode,name,quantity,selling_price,line_total from transaction_items where transaction_id = ?`;

    try {
        const [transactionRows] = await db.query(sql1, [orderNumber]);

        if (transactionRows.length === 0) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        const transaction = transactionRows[0];

        const [itemRows] = await db.query(sql2, [transaction.transaction_id]);

        if (itemRows.length === 0) {
            return res.status(404).json({ message: 'No items found for this transaction' });
        }

        const items = itemRows.map(item => ({
            item_id: item.item_id,
            barcode: item.barcode,
            name: item.name,
            quantity: item.quantity,
            selling_price: item.selling_price,
            line_total: item.line_total
        }));

        res.status(200).json({
            transaction_id: transaction.transaction_id,
            e_name: transaction.e_name,
            orderNumber: transaction.orderNumber,
            discount_type: transaction.discount_type,
            discount_value: transaction.discount_value,
            total_amount: transaction.total_amount,
            final_amount: transaction.final_amount,
            transaction_date: transaction.transaction_date,
            items
        });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Database error' });
    }
}

module.exports = get_reception;