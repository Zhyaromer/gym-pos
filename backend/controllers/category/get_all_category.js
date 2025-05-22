const db = require("../../config/mysql/mysqlconfig");

const get_all_category = async (req, res) => {
    try {
        const sql = `
        select * from category
        `;

        const [rows] = await db.query(sql);
        res.status(200).json({ rows });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = get_all_category;