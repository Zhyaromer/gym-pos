const db = require("../../config/mysql/mysqlconfig");
const fs = require('fs');
const path = require('path');

const update_employee_info = async (req, res) => {
    const { e_id } = req.params;
    const { name, gender, date_of_birth, address, email, phoneNumber, emergencyphoneNumber, role,
        working_date, salary } = req.body;

    const dateOfBirth = new Date(date_of_birth).toISOString().split('T')[0];
    const workingDate = new Date(working_date).toISOString().split('T')[0];


    if (!e_id) {
        return res.status(400).json({ message: "Employee ID is required" });
    }


    if (!name || !gender || !dateOfBirth || !address || !email || !phoneNumber || !role ||
        !workingDate || !salary) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (gender != 'ئافرەت' && gender != 'پیاو') {
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

    let imgPath = null;

    try {
        const [rows] = await db.query('SELECT img FROM employees WHERE e_id = ?', [e_id]);
        const oldImgUrl = rows[0]?.img;

        if (req.file) {
            const uploadsDir = path.join(__dirname, '../../imgs/employees');

            if (oldImgUrl) {
                const oldImgPath = path.join(__dirname, '../../imgs/employees', path.basename(oldImgUrl));
                if (fs.existsSync(oldImgPath)) {
                    fs.unlinkSync(oldImgPath);
                }
            }

            if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir, { recursive: true });
            }

            const fileExt = path.extname(req.file.originalname);
            const fileName = `employee_${Date.now()}${fileExt}`;
            const filePath = path.join(uploadsDir, fileName);

            fs.writeFileSync(filePath, req.file.buffer);
            imgPath = `http://localhost:3000/imgs/employees/${fileName}`;
        } else {
            imgPath = oldImgUrl;
        }

        const sql = `
            UPDATE employees SET name=?, gender=?, date_of_birth=?, address=?, email=?, phoneNumber=?, emergencyphoneNumber=?, role=?,
            working_date=?, salary=?, img=? WHERE e_id=?`;

        const [result] = await db.query(sql, [
            name, gender, dateOfBirth, address, email, phoneNumber,
            emergencyphoneNumber || null, role, workingDate, salary, imgPath, e_id
        ]);

        if (result.affectedRows > 0) {
            return res.status(200).json({ message: "Data updated" });
        } else {
            return res.status(400).json({ message: "Data update failed" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal error, please try again" });
    }
};

module.exports = update_employee_info;