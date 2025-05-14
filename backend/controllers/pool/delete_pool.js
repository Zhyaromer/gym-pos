const db = require("../../config/mysql/mysqlconfig");

const delete_pool = async (req, res) => {
    const { swimmingpool_id } = req.params;

    if (!swimmingpool_id) {
        return res.status(400).json({ message: "Swimming pool ID is required" });
    }

    try {
        const sql = "DELETE FROM swimmingpool WHERE swimmingpool_id = ?";
        const values = [swimmingpool_id];

        const [result] = await db.query(sql, values);

        if (result.affectedRows > 0) {
            return res.status(200).json({ message: "Swimming pool entry deleted successfully" });
        } else {
            return res.status(404).json({ message: "Swimming pool entry not found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = delete_pool;