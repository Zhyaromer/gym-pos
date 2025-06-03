const db = require("../../config/mysql/mysqlconfig");

const delete_reception = async (req, res) => {
    let { orderNumber } = req.params;

    if (!orderNumber) {
        return res.status(400).json({ error: 'Order number is required' });
    }

    const getTransactionSql = `SELECT transaction_id FROM transactions WHERE orderNumber = ?`;
    const getItemsSql = `
        SELECT ti.product_id, ti.quantity 
        FROM transaction_items ti 
        INNER JOIN transactions t ON ti.transaction_id = t.transaction_id 
        WHERE t.orderNumber = ?
    `;
    const updateStockSql = `UPDATE products SET stock = stock + ? WHERE product_id = ?`;
    const deleteTransactionSql = `DELETE FROM transactions WHERE orderNumber = ?`;
    const deleteItemsSql = `DELETE FROM transaction_items WHERE transaction_id IN (SELECT transaction_id FROM transactions WHERE orderNumber = ?)`;

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const [transactionResult] = await connection.query(getTransactionSql, [orderNumber]);

        if (transactionResult.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Transaction not found' });
        }

        const [items] = await connection.query(getItemsSql, [orderNumber]);

        if (items.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'No items found for this transaction' });
        }

        for (const item of items) {
            await connection.query(updateStockSql, [item.quantity, item.product_id]);
        }

        const [deleteItemsResult] = await connection.query(deleteItemsSql, [orderNumber]);

        if (deleteItemsResult.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Failed to delete transaction items' });
        }

        const [deleteTransactionResult] = await connection.query(deleteTransactionSql, [orderNumber]);

        if (deleteTransactionResult.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Failed to delete transaction' });
        }

        await connection.commit();
        res.status(200).json({ message: 'Transaction deleted and stock restored successfully' });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        connection.release();
    }
}

module.exports = delete_reception;