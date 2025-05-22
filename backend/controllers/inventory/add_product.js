const db = require("../../config/mysql/mysqlconfig");
const path = require('path');
const fs = require('fs');

const add_product = async (req, res) => {
    const { barcode, name, cost_price, selling_price, stock, category_id } = req.body;

    if (!barcode || !name || !cost_price || !selling_price || !stock || !category_id) {
        return res.status(400).json({ message: "All fields are required" });
    }

    let imgPath = null;
    console.log(req.file);

    if (req.file) {
        const uploadsDir = path.join(__dirname, '../../imgs/products');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const fileExt = path.extname(req.file.originalname);
        const fileName = `products_${Date.now()}${fileExt}`;
        const filePath = path.join(uploadsDir, fileName);

        fs.writeFileSync(filePath, req.file.buffer);

        imgPath = `http://localhost:3000/imgs/products/${fileName}`;
    }

    try {
        const sql = `INSERT INTO products (name, barcode, stock, selling_price, cost_price, img, category_id) VALUES (?, ?, ?, ?, ?, ? , ?)`;
        const values = [name, barcode, stock, selling_price, cost_price, imgPath, category_id];

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