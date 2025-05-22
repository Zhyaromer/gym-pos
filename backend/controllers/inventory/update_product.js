const db = require("../../config/mysql/mysqlconfig");
const path = require("path");
const fs = require("fs");

const update_product = async (req, res) => {
    const { product_id } = req.params;
    const { barcode, name, cost_price, selling_price, stock, category } = req.body;
    console.log(req.body);

    if (!barcode || !name || !cost_price || !selling_price || !stock || !category) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const sql1 = ` select category_id from category where name = ?`;
        const [rows] = await db.query(sql1, [category]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Category not found" });
        }
        const category_id = rows[0].category_id;

        const sql2 = `select img from products where product_id = ?`;
        const [rows1] = await db.query(sql2, [product_id]);

        if (rows1.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        const oldImage = rows1[0].img;
        let img = oldImage;

        if (req.file) {
            const uploadsDir = path.join(__dirname, '../../imgs/products');

            if (oldImage) {
                const oldImgPath = path.join(__dirname, '../../imgs/products', path.basename(oldImage));
                if (fs.existsSync(oldImgPath)) {
                    fs.unlinkSync(oldImgPath);
                }
            }

            if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir, { recursive: true });
            }

            const fileExt = path.extname(req.file.originalname);
            const fileName = `product_${Date.now()}${fileExt}`;
            const filePath = path.join(uploadsDir, fileName);

            fs.writeFileSync(filePath, req.file.buffer);
            img = `http://localhost:3000/imgs/products/${fileName}`;
        }

        const sql3 = `
            UPDATE products
            SET name = ?, barcode = ?, cost_price = ?, selling_price = ?, stock = ?, img = ?, category_id = ?
            WHERE product_id = ?
        `;
        const values = [name, barcode, cost_price, selling_price, stock, img, category_id, product_id];

        const [result] = await db.query(sql3, values);

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