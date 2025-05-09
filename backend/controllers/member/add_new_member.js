const db = require("../../config/mysql/mysqlconfig");

const addNewMember = async (req, res) => {
    const { name, gender, phoneNumber, emergencyphoneNumber, height, weight, img } = req.body;

    if (!name || !gender || !phoneNumber || !emergencyphoneNumber) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (gender != 'نێر' && gender != 'مێ') {
        return res.status(200).json({ message: "gender is false" });
    }

    const phoneStr = String(phoneNumber);
    const emergencyPhoneStr = String(emergencyphoneNumber);
    if (!/^\d{10,11}$/.test(phoneStr)) {
        return res.status(400).json({ message: "Invalid phone number length or format" });
    }
    if (!/^\d{10,11}$/.test(emergencyPhoneStr)) {
        return res.status(400).json({ message: "Invalid emergency phone number length or format" });
    }

    try {
        const sql = `insert into members (name,gender,phoneNumber,emergencyphoneNumber,height,weight,img) values (?,?,?,?,?,?,?)`;
        const [rows] = await db.query(sql, [name, gender, phoneNumber, emergencyphoneNumber, height ? height : 0, weight ? weight : 0, img ? img : null]);

        if (rows.affectedRows > 0) {
            return res.status(201).json({ message: "data inserted" });
        } else {
            return res.status(400).json({ message: "data entery failed" });
        }
    } catch {
        return res.status(500).json({ message: "internal error please try again" });
    }
};

module.exports = addNewMember;