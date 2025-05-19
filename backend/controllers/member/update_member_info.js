const db = require("../../config/mysql/mysqlconfig");

const update_member_info = async (req, res) => {
    const { m_id } = req.params;
    const { name, gender, emergencyphoneNumber, phoneNumber, height, weight } = req.body;

    if (!m_id) {
        return res.status(400).json({ error: 'id is required' });
    }

    if (!name || !gender || !emergencyphoneNumber || !phoneNumber || !height || !weight ) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (phoneNumber && !/^\d{10,11}$/.test(String(phoneNumber))) {
        return res.status(400).json({ message: "Invalid phone number length or format" });
    }

    if (emergencyphoneNumber && !/^\d{10,11}$/.test(String(emergencyphoneNumber))) {
        return res.status(400).json({ message: "Invalid emergency phone number length or format" });
    }

    if (phoneNumber === emergencyphoneNumber) {
        return res.status(400).json({ message: "Emergency phone number cannot be the same as the main phone number" });
    }

    if (height && (height < 0)) {
        return res.status(400).json({ message: "Invalid height value" });
    }

    if (weight && (weight < 0)) {
        return res.status(400).json({ message: "Invalid weight value" });
    }

    const sql1 = `
    update members
    set name = ?, gender = ?, emergencyphoneNumber = ?, phoneNumber = ?, height = ?, weight = ?
    where m_id = ?`;

    try {
        const [userInfo] = await db.query(sql1, [name, gender, emergencyphoneNumber, phoneNumber, height, weight, m_id]);
        if (userInfo.affectedRows === 0) {
            return res.status(404).json({ error: 'Member not found' });
        }

        return res.status(200).json({ message: 'Member updated successfully' });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = update_member_info;