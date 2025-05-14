const db = require("../../config/mysql/mysqlconfig");

const add_pool = async (req, res) => {
    const { name, age, gender, price, entry_date, entry_time } = req.body;

    if (!name || !price || !gender || !age) {
        return res.status(400).json({ message: "Name, age, gender, and price are required" });
    }

    try {

        const sql = "INSERT INTO swimmingpool (name, age, gender, price, entry_date, entry_time) VALUES (?, ?, ?, ?, ?, ?)";
        const values = [name, age, gender, price, entry_date ? entry_date : null, entry_time? entry_time : null];

        const [result] = await db.query(sql, values);

        if (result.affectedRows > 0) {
            return res.status(200).json({ message: "Swimming pool entry added successfully" });
        } else {
            return res.status(400).json({ message: "Failed to add swimming pool entry" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = add_pool;