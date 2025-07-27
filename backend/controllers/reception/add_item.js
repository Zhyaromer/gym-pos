const db = require("../../config/mysql/mysqlconfig");

const add_item = async (req, res) => {
    let { barcode, quantity, transaction_id } = req.body;
    const employee_id = req.user.e_id; // Get employee ID from authenticated user

    if ([barcode, quantity, transaction_id].some(v => v === undefined || v === null)) {
        return res.status(400).json({ error: 'all fields are required' });
    }

    if (isNaN(quantity)) {
        return res.status(400).json({ error: 'Invalid numeric values' });
    }

    if (quantity <= 0) {
        return res.status(400).json({ error: 'Quantity must be positive' });
    }

    const sql1 = `SELECT product_id, stock, name, selling_price FROM products WHERE barcode = ? FOR UPDATE`;
    const sql2 = ` insert into transaction_items (transaction_id, product_id, barcode, name, selling_price, quantity) values (?, ?, ?, ?, ?, ?)`;
    const sql3 = `UPDATE products SET stock = stock - ? WHERE barcode = ?`;
            const sql4 = `select discount_type,discount_value,total_amount,final_amount,e_id from transactions where transaction_id = ?`;

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const [rows1] = await connection.query(sql1, [barcode]);

        if (rows1.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: "Product not found" });
        }

        const product = rows1[0];

        if (product.stock < quantity) {
            await connection.rollback();
            return res.status(400).json({ message: "Insufficient stock" });
        }

        const [checkingItem] = await connection.query(
            `SELECT 1 FROM transaction_items WHERE transaction_id = ? AND barcode = ? LIMIT 1`,
            [transaction_id, barcode]
        );

        if (checkingItem.length > 0) {
            const [result2] = await connection.query(`UPDATE transaction_items SET quantity = quantity + ? WHERE transaction_id = ? AND barcode = ?`, [quantity, transaction_id, barcode]);
            if (result2.affectedRows === 0) {
                await connection.rollback();
                return res.status(400).json({ message: "Failed to add item to transaction" });
            }
        } else {
            const [result2] = await connection.query(sql2, [transaction_id, product.product_id, barcode, product.name, product.selling_price, quantity]);
            if (result2.affectedRows === 0) {
                await connection.rollback();
                return res.status(400).json({ message: "Failed to add item to transaction" });
            }
        }

        const [result3] = await connection.query(sql3, [quantity, barcode]);

        if (result3.affectedRows === 0) {
            await connection.rollback();
            return res.status(400).json({ message: "Failed to update stock" });
        }

        const [rows4] = await connection.query(sql4, [transaction_id]);

        if (rows4.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: "Transaction not found" });
        }

        const transaction = rows4[0];
        
        // Check if the employee is authorized to modify this transaction
        if (transaction.e_id !== employee_id) {
            await connection.rollback();
            return res.status(403).json({ message: "You are not authorized to modify this transaction" });
        }
        
        const total_price = Number(product.selling_price) * Number(quantity);
        let total_amount = Number(transaction.total_amount || 0) + Number(total_price || 0);

        let final_price = total_amount;

        if (transaction.discount_type == 'percentage') {
            final_price = total_amount * (1 - (transaction.discount_value / 100));
        } else if (transaction.discount_type == 'fixed_amount') {
            final_price = total_amount - transaction.discount_value;
        }

        if (final_price < 0) final_price = 0;

        const updateTransactionSql = `UPDATE transactions SET total_amount = ?, final_amount = ? WHERE transaction_id = ?`;
        const [updateResult] = await connection.query(updateTransactionSql, [total_amount, final_price, transaction_id]);

        if (updateResult.affectedRows === 0) {
            await connection.rollback();
            return res.status(400).json({ message: "Failed to update transaction" });
        }

        await connection.commit();

        return res.status(200).json({ message: "Item added to transaction successfully" });
    } catch (err) {
        await connection.rollback();
        return res.status(500).json({ message: "Internal Server Error" });
    } finally {
        connection.release();
    }
}

module.exports = add_item;