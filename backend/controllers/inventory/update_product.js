const db = require("../../config/mysql/mysqlconfig");

const update_product = async (req, res) => {
    const { product_id } = req.params;
    const { barcode, name, cost_price, selling_price, stock, image, category_id } = req.body;

    if (!barcode || !name || !cost_price || !selling_price || !stock || !category_id) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const sql = `
            UPDATE products
            SET name = ?, barcode = ?, cost_price = ?, selling_price = ?, stock = ?, img = ?, category_id = ?
            WHERE product_id = ?
        `;
        const values = [name, barcode, cost_price, selling_price, stock, image ? image : null, category_id, product_id];

        const [result] = await db.query(sql, values);

        if (result.affectedRows === 1) {
            res.status(200).json({ message: "Product updated successfully" });
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = update_product;
