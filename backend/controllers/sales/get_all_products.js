const db = require("../../config/mysql/mysqlconfig");

const get_all_products = async (req, res) => {
    try {
        const sql = `
        select p.product_id,p.barcode,p.name,p.stock,p.selling_price,p.img,c.name as category 
        from products as p 
        left join 
        category as c on 
        c.category_id = p.category_id
        `;

        const [rows] = await db.query(sql);
        res.status(200).json({
            status: "success",
            data: rows,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "error",
            message: "Internal Server Error",
        });
    }
}

module.exports = get_all_products;