const db = require("../../config/mysql/mysqlconfig");

const update_employee_info = async (req, res) => {
    const { e_id } = req.params;
    const { name, gender, date_of_birth, address, email, phoneNumber, emergencyphoneNumber, role,
        working_date, salary, img } = req.body;

    if (!name || !gender || !date_of_birth || !address || !email || !phoneNumber || !role ||
        !working_date || !salary) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (gender != 'نێر' && gender != 'مێ') {
        return res.status(400).json({ message: "gender is false" });
    }

    if (date_of_birth > new Date().toISOString().split('T')[0]) {
        return res.status(400).json({ message: "date of birth is false" });
    }

    if (address.length > 100) {
        return res.status(400).json({ message: "address is false" });
    }

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    const phoneStr = String(phoneNumber);
    const emergencyPhoneStr = String(emergencyphoneNumber);
    if (!/^\d{10,11}$/.test(phoneStr)) {
        return res.status(400).json({ message: "Invalid phone number length or format" });
    }
    if (!/^\d{10,11}$/.test(emergencyPhoneStr)) {
        return res.status(400).json({ message: "Invalid emergency phone number length or format" });
    }

    if (phoneNumber === emergencyphoneNumber) {
        return res.status(400).json({ message: "Emergency phone number cannot be the same as the main phone number" });
    }
    try {
        const sql = `
        update employees set name=?,gender=?,date_of_birth=?,address=?,email=?,phoneNumber=?,emergencyphoneNumber=?,role=?,
        working_date=?,salary=?,img=? where e_id=?`;

        const [result] = await db.query(sql, [name, gender, date_of_birth, address, email, phoneNumber, emergencyphoneNumber ?
            emergencyphoneNumber : null, role, working_date, salary, img ? img : null, e_id]);

        if (result.affectedRows > 0) {
            return res.status(200).json({ message: "data updated" });
        } else {
            return res.status(400).json({ message: "data update failed" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "internal error please try again" });
    }
}

module.exports = update_employee_info;