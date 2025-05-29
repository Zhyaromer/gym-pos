const db = require("../../config/mysql/mysqlconfig");

const attendance_summary = async (req, res) => {
    const { date } = req.query;

    if (!date) {
        return res.status(400).json({ message: "Date is required" });
    }

    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(date)) {
        return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD." });
    }

    try {
        const [totalEmployeesResult] = await db.query("SELECT COUNT(*) AS total_employees FROM employees");
        const totalEmployees = totalEmployeesResult[0].total_employees;

        const [attendedEmployeesResult] = await db.query(
            "SELECT COUNT(*) AS attended_employees FROM attendence WHERE attendence_date = ? and state = 'هاتوو'",
            [date]
        );
        const attendedEmployees = attendedEmployeesResult[0].attended_employees;

        const [unattendedEmployeesResult] = await db.query(`
            SELECT COUNT(*) AS unattended_employees
            FROM employees e
            LEFT JOIN attendence a ON e.e_id = a.e_id AND a.attendence_date = ?
            WHERE a.attendence_id IS NULL or a.state = 'نەهاتوو'
        `, [date]);
        const unattendedEmployees = unattendedEmployeesResult[0].unattended_employees;

        const [unattendedEmployeeList] = await db.query(`
            SELECT e.e_id, e.name, e.role
            FROM employees e
            LEFT JOIN attendence a ON e.e_id = a.e_id AND a.attendence_date = ?
            WHERE a.attendence_id IS NULL
        `, [date]);

        return res.status(200).json({
            total_employees: totalEmployees,
            attended_employees: attendedEmployees,
            unattended_employees: unattendedEmployees,
            unattended_employee_list: unattendedEmployeeList
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = attendance_summary;