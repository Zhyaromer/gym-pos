const db = require("../../config/mysql/mysqlconfig");

const buying_products = async (req, res) => {
    const { e_id, carts, orderNumber, discount_type, discount_value, total_amount, final_amount } = req.body;

    if (!e_id) {
        return res.status(400).json({ message: "Employee ID is required" });
    }

    if (!orderNumber) {
        return res.status(400).json({ message: "Order number is required" });
    }

    if (!Array.isArray(carts) || carts.length === 0) {
        return res.status(400).json({ message: "Carts must be a non-empty array" });
    }

    if (!total_amount || !final_amount) {
        return res.status(400).json({ message: "Total amount and final amount is required" });
    }

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const sql1 = `
        select name from employees where e_id = ?`;

        const [rows1] = await connection.query(sql1, [e_id]);

        if (rows1.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: "Employee not found" });
        }
        const employee_name = rows1[0].name;

        const sql2 = `
        insert into transactions (orderNumber, e_id, e_name, discount_type, discount_value, total_amount, final_amount)
        values (?, ?, ?, ?, ?, ?, ?)`;

        const [result] = await connection.query(sql2, [orderNumber, e_id, employee_name, discount_type, discount_value, total_amount, final_amount]);

        if (result.affectedRows === 0) {
            await connection.rollback();
            return res.status(500).json({ message: "Failed to insert order" });
        }

        const order_id = result.insertId;

        for (const cart of carts) {
            const { product_id, barcode, name, selling_price, quantity } = cart;

            const stockQuery = `SELECT stock FROM products WHERE product_id = ? FOR UPDATE`;
            const [stockRows] = await connection.query(stockQuery, [product_id]);

            if (stockRows.length === 0) {
                await connection.rollback();
                return res.status(404).json({ message: `Product not found: ${name}` });
            }

            const currentStock = stockRows[0].stock;

            if (currentStock < quantity) {
                await connection.rollback();
                return res.status(400).json({
                    message: `Insufficient stock for product '${name}' (Available: ${currentStock}, Requested: ${quantity})`
                });
            }

            const sql3 = `
            insert into transaction_items (transaction_id, product_id, barcode, name, selling_price, quantity)
            values (?, ?, ?, ?, ?, ?)`;

            const [result] = await connection.query(sql3, [order_id, product_id, barcode, name, selling_price, quantity]);

            if (result.affectedRows === 0) {
                await connection.rollback();
                return res.status(500).json({ message: "Failed to insert transaction item" });
            }

            const sql4 = `
            update products set stock = (stock - ?) where product_id = ?`;

            const [result2] = await connection.query(sql4, [quantity, product_id]);
            if (result2.affectedRows === 0) {
                await connection.rollback();
                return res.status(500).json({ message: "Failed to update product stock" });
            }
        }

        await connection.commit();

        res.status(201).json({ message: "Order placed successfully" });
    } catch (err) {
        console.error(err);
        await connection.rollback();
        res.status(500).json({ message: "Internal Server Error" });
    } finally {
        connection.release();
    }
}

module.exports = buying_products;