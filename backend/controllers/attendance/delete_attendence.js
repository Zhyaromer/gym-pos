const db = require("../../config/mysql/mysqlconfig");

const delete_attendence = async (req, res) => {
    const { attendence_id } = req.params;

    if (!attendence_id) {
        return res.status(400).json({ message: "Attendence ID is required" });
    }

    try {
        const [result] = await db.query(
            "DELETE FROM attendence WHERE attendence_id = ?",
            [attendence_id]
        );

        if (result.affectedRows > 0) {
            return res.status(200).json({ message: "Attendence Record Deleted Successfully" });
        } else {
            return res.status(404).json({ message: "Attendence Record Not Found" });
        }
    } catch (error) {
        console.error("Error deleting attendence:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = delete_attendence;
