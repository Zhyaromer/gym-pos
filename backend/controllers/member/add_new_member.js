const db = require("../../config/mysql/mysqlconfig");

const addNewMember = async (req, res) => {
    const { name, gender, phoneNumber, emergencyphoneNumber, height, weight, accessLevel, endDate, startDate, membership } = req.body;

    console.log(req.body);

    if (!name || !gender || !phoneNumber || !emergencyphoneNumber || !accessLevel || !endDate || !startDate || !membership) {
        console.log("All fields are required");
        return res.status(400).json({ message: "All fields are required" });
    }

    if (gender != 'پیاو' && gender != 'ئافرەت') {
        console.log("gender is false");
        return res.status(200).json({ message: "gender is false" });
    }

    const phoneStr = String(phoneNumber);
    const emergencyPhoneStr = String(emergencyphoneNumber);
    if (!/^\d{10,11}$/.test(phoneStr)) {
        console.log("Invalid phone number length or format");
        return res.status(400).json({ message: "Invalid phone number length or format" });
    }
    if (!/^\d{10,11}$/.test(emergencyPhoneStr)) {
        console.log("Invalid emergency phone number length or format");
        return res.status(400).json({ message: "Invalid emergency phone number length or format" });
    }

    if (height && (height < 0)) {
        console.log("Invalid height value");
        return res.status(400).json({ message: "Invalid height value" });
    }

    if (weight && (weight < 0)) {
        console.log("Invalid weight value");
        return res.status(400).json({ message: "Invalid weight value" });
    }

    if (startDate > endDate) {
        console.log("start date must be less than end date");
        return res.status(400).json({ message: "start date must be less than end date" });
    }

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        console.log("1");

        const sql = `insert into members (name,gender,phoneNumber,emergencyphoneNumber,height,weight) values (?,?,?,?,?,?)`;
        const [rows] = await connection.query(sql, [name, gender, phoneNumber, emergencyphoneNumber, height ? height : 0, weight ? weight : 0]);

        if (rows.affectedRows > 0) {
            const m_id = rows.insertId;

            const sql2 = `select mp_id from membershipplan where title = ? and type = ?`;
            const [rows2] = await connection.query(sql2, [membership, accessLevel]);

            if (rows2.length == 0) {
                connection.rollback();
                return res.status(400).json({ message: "membership plan not found" });
            }

            const mp_id = rows2[0].mp_id;

            const sql3 = `insert into active_member_plan (m_id,mp_id,start_date,end_date) values (?,?,?,?)`;
            const [rows3] = await connection.query(sql3, [m_id, mp_id, startDate, endDate]);

            if (rows3.affectedRows == 0) {
                connection.rollback();
                return res.status(400).json({ message: "data entery failed" });
            }

            connection.commit();
            return res.status(200).json({ message: "data entery success" });
        } else {
            connection.rollback();
            return res.status(400).json({ message: "data entery failed" });
        }
    } catch (error) {
        console.error("Error inserting data:", error);
        connection.rollback();
        return res.status(500).json({ message: "internal error please try again" });
    } finally {
        connection.release();
    }
};

module.exports = addNewMember;