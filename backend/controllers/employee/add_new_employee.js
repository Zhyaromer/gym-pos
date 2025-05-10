const db = require("../../config/mysql/mysqlconfig");
const bcrypt = require("bcrypt");

const add_new_employee = async (req, res) => {
    const { name, gender, date_of_birth, address, email, password, phoneNumber, emergencyphoneNumber, role, working_date, salary,img } = req.body;

    if (!name || !gender || !date_of_birth || !address || !email || !password || !phoneNumber || !role ||
        !working_date || !salary) {
    }

    if (gender != 'نێر' && gender != 'مێ') {
        return res.status(200).json({ message: "gender is false" });
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

    if (password.length <= 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters long" });
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

    const salt = await bcrypt.genSalt(10);

    try {
        const sql = `insert into employees (name,email,password,date_of_birth,gender,phoneNumber,emergencyphoneNumber,address,role,salary,
        working_date,img) values (?,?,?,?,?,?,?,?,?,?,?,?)`;

        const hashedPassword = await bcrypt.hash(password, salt);

        const [rows] = await db.query(sql, [name, email, hashedPassword, date_of_birth, gender, phoneNumber, emergencyphoneNumber ?
            emergencyphoneNumber : null, address, role, salary, working_date, img ? img : null]);

        if (rows.affectedRows > 0) {
            return res.status(201).json({ message: "data inserted" });
        } else {
            return res.status(400).json({ message: "data entery failed" });
        }
    } catch (err)  {
        console.log(err);
        return res.status(500).json({ message: "internal error please try again" });
    }
};

module.exports = add_new_employee;