const db = require("../../config/mysql/mysqlconfig");

const add_attendence_record = async (req, res) => {
    const { e_id, attendence_date, entry_time, leaving_time, state, note } = req.body;

    if (!e_id || !attendence_date || !state) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const [existingRecord] = await db.query(
            "SELECT * FROM attendence WHERE e_id = ? AND attendence_date = ?",
            [e_id, attendence_date]
        );

        if (existingRecord.length > 0) {
            return res.status(400).json({ message: "Attendance record already exists for this employee on this date" });
        }

        const sql = "INSERT INTO attendence (e_id, attendence_date, entry_time, leaving_time, state, note) VALUES (?, ?, ?, ?, ?, ?)";
        const values = [e_id, attendence_date, entry_time ? entry_time : null, leaving_time ? leaving_time : null, state, note ? note : null];

        const [result] = await db.query(sql, values);

        if (result.affectedRows > 0) {
            return res.status(200).json({ message: "Attendance Record Added Successfully", attendence_id: result.insertId });
        } else {
            return res.status(400).json({ message: "Attendance Record Not Added" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = add_attendence_record;
