const db = require("../../config/mysql/mysqlconfig");

const add_member_pool = async (req, res) => {
    const { member_plan_id, member_id, entery_date, remaining_pool_entries } = req.body;

    if (!member_plan_id || !member_id || !entery_date || !remaining_pool_entries) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (remaining_pool_entries <= 0) {
        return res.status(200).json({ message: "remaining_pool_entries is false" });
    }

    const sql1 = `INSERT INTO freePoolUsage (m_id, amp_id,entery_date ) VALUES (?, ? , ?)`;

    try {
        const [results] = await db.query(sql1, [member_id, member_plan_id, entery_date]);

        if (results.affectedRows > 0) {
            return res.status(200).json({ message: "data entery success" });
        } else {
            return res.status(400).json({ message: "data entery failed" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = add_member_pool;