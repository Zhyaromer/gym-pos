const db = require("../../config/mysql/mysqlconfig");

const update_pool = async (req, res) => {
    let { swimmingpool_id, name, age, price, gender, entry_date, entry_time } = req.body;

    if (!swimmingpool_id || !name || !price || !age || !gender) {
        return res.status(400).json({ message: "Swimmingpool ID, name, age, and gender are required" });
    }

    entry_date = new Date(entry_date).toLocaleDateString('en-CA');

    try {
        const sql = `
            UPDATE swimmingpool
            SET name = ?, age = ?, gender = ?, price = ?, entry_date = ?, entry_time = ?
            WHERE swimmingpool_id = ?
        `;

        const values = [name, age, gender, price, entry_date ? entry_date : null, entry_time ? entry_time : null, swimmingpool_id];

        const [result] = await db.query(sql, values);

        if (result.affectedRows > 0) {
            return res.status(200).json({ message: "Swimming pool entry updated successfully" });
        } else {
            return res.status(400).json({ message: "Swimming pool entry not found or not updated" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = update_pool;