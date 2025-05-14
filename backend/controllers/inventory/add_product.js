const db = require("../../config/mysql/mysqlconfig");

const add_product = async (req, res) => {
    const { barcode, name, cost_price, selling_price, stock, image, category_id } = req.body;

    if (!barcode || !name || !cost_price || !selling_price || !stock || !category_id) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const sql = `INSERT INTO products (name, barcode, stock, selling_price, cost_price, img, category_id) VALUES (?, ?, ?, ?, ?, ? , ?)`;
        const values = [name, barcode, selling_price, cost_price, stock, image ? image : null, category_id];

        const [result] = await db.query(sql, values);

        if (result.affectedRows === 1) {
            res.status(201).json({ message: "Product added successfully" });
        } else {
            res.status(500).json({ message: "Failed to add product" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = add_product;