const db = require("../../config/mysql/mysqlconfig");

const delete_item = async (req, res) => {
    const { barcode, line_total, quantity, transaction_id } = req.body;
    console.log("Received data:", req.body);

    if (!barcode || !line_total || !quantity || !transaction_id) {
        return res.status(400).json({ error: 'Barcode, line total, quantity, and transaction ID are required' });
    }

    const sql = `DELETE FROM transaction_items WHERE transaction_id = ? AND barcode = ? AND quantity = ?`;
    const updateStockSql = `UPDATE products SET stock = stock + ? WHERE barcode = ?`;
   const updateTransactionTotalSql = `
        UPDATE transactions 
        SET 
            total_amount = GREATEST(total_amount - ?, 0),
            final_amount = GREATEST(final_amount - ?, 0)
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

        const [result3] = await connection.query(updateTransactionTotalSql, [line_total, line_total, transaction_id]);

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