const db = require("../../config/mysql/mysqlconfig");

const delete_product = async (req, res) => {
    const { product_id  } = req.params;

    if (!product_id ) {
        return res.status(400).json({ error: 'id is required' });
    }

    try {
        const [img] = await db.query('SELECT img FROM products WHERE product_id =?', [product_id]);
        const oldImage = img[0].img;

        const [result] = await db.query('DELETE FROM products WHERE product_id  = ?', [product_id ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'product not found' });
        }

        if (oldImage) {
            const oldImgPath = path.join(__dirname, '../../imgs/products', path.basename(oldImage));
            if (fs.existsSync(oldImgPath)) {
                fs.unlinkSync(oldImgPath);
            }
        }

        return res.status(200).json({ message: 'product deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = delete_product;