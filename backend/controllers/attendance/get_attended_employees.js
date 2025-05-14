const db = require("../../config/mysql/mysqlconfig");

const get_attended_employees = async (req, res) => {
    const { date } = req.query;

    if (!date) {
        return res.status(400).json({ message: "Date is required" });
    }

    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(date)) {
        return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD." });
    }

    try {
        const [attendedEmployees] = await db.query(`
            SELECT 
                e.e_id, e.name, e.img, e.role, 
                a.attendence_id, a.attendence_date, a.entry_time, a.leaving_time, 
                a.working_hours, a.state, a.note
            FROM 
                employees e
            JOIN 
                attendence a ON e.e_id = a.e_id
            WHERE 
                a.attendence_date = ?
        `, [date]);

        if (attendedEmployees.length > 0) {
            return res.status(200).json({
                attended_employees: attendedEmployees
            });
        } else {
            return res.status(404).json({ message: `No employees attended on ${date}` });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = get_attended_employees;
