const db = require("../../config/mysql/mysqlconfig");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

const add_new_employee = async (req, res) => {
    const { fullName, gender, dateOfBirth, address, email, password, phoneNumber, secondaryNumber, role, startWorkingDate, salary } = req.body;

    if (!fullName || !gender || !dateOfBirth || !address || !email || !password || !phoneNumber || !role ||
        !startWorkingDate || !salary) {
        return res.status(400).json({ message: "All required fields must be provided" });
    }

    if (gender != 'پیاو' && gender != 'ئافرەت') {
        return res.status(400).json({ message: "gender is false" });
    }

    if (dateOfBirth > new Date().toISOString().split('T')[0]) {
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
    const emergencyPhoneStr = String(secondaryNumber);
    if (!/^(07|7)\d{8,9}$/.test(phoneStr)) {
        return res.status(400).json({ message: "Invalid phone number length or format" });
    }
    if (!/^(07|7)\d{8,9}$/.test(emergencyPhoneStr)) {
        return res.status(400).json({ message: "Invalid emergency phone number length or format" });
    }

    if (phoneNumber === secondaryNumber) {
        return res.status(400).json({ message: "Emergency phone number cannot be the same as the main phone number" });
    }

    let imgPath = null;

    if (req.file) {
        const uploadsDir = path.join(__dirname, '../../imgs/employees');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const fileExt = path.extname(req.file.originalname);
        const fileName = `employee_${Date.now()}${fileExt}`;
        const filePath = path.join(uploadsDir, fileName);

        fs.writeFileSync(filePath, req.file.buffer);

        imgPath = `http://localhost:3000/imgs/employees/${fileName}`;
    }

    const salt = await bcrypt.genSalt(10);

    try {
        const sql = `insert into employees (name,email,password,date_of_birth,gender,phoneNumber,emergencyphoneNumber,address,role,salary,
        working_date,img) values (?,?,?,?,?,?,?,?,?,?,?,?)`;

        const hashedPassword = await bcrypt.hash(password, salt);

        const [rows] = await db.query(sql, [
            fullName, 
            email, 
            hashedPassword, 
            dateOfBirth, 
            gender, 
            phoneNumber, 
            secondaryNumber || null, 
            address, 
            role, 
            salary, 
            startWorkingDate, 
            imgPath
        ]);

        if (rows.affectedRows > 0) {
            return res.status(201).json({ 
                message: "Employee added successfully",
                employee: {
                    id: rows.insertId,
                    name: fullName,
                    email: email,
                    role: role,
                    imgUrl: imgPath
                }
            });
        } else {
            return res.status(400).json({ message: "Failed to add employee" });
        }
    } catch (err)  {
        return res.status(500).json({ message: "Internal server error, please try again" });
    }
};

module.exports = add_new_employee;