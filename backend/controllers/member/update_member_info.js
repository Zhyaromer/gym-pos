const db = require("../../config/mysql/mysqlconfig");

const update_member_info = async (req, res) => {
    const { m_id } = req.params;
    const { name, gender, img, emergencyphoneNumber, phoneNumber, height, weight, membership_title
        , start_date, end_date } = req.body;

    if (!m_id) {
        return res.status(400).json({ error: 'id is required' });
    }

    if (!name || !gender || !img || !emergencyphoneNumber || !phoneNumber || !height || !weight || !membership_title || !start_date || !end_date) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (start_date > end_date) {
        return res.status(400).json({ message: "Invalid date range" });
    }

    if (phoneNumber === emergencyphoneNumber) {
        return res.status(400).json({ message: "Emergency phone number cannot be the same as the main phone number" });
    }

    if (phoneNumber && !/^\d{10,11}$/.test(String(phoneNumber))) {
        return res.status(400).json({ message: "Invalid phone number length or format" });
    }

    if (emergencyphoneNumber && !/^\d{10,11}$/.test(String(emergencyphoneNumber))) {
        return res.status(400).json({ message: "Invalid emergency phone number length or format" });
    }

    if (height && (height < 0)) {
        return res.status(400).json({ message: "Invalid height value" });
    }

    if (weight && (weight < 0)) {
        return res.status(400).json({ message: "Invalid weight value" });
    }

    const connection = await db.getConnection();

    const sql1 = `
    update members
    set name = ?, gender = ?, img = ?, emergencyphoneNumber = ?, phoneNumber = ?, height = ?, weight = ?
    where m_id = ?`;

    const sql2 = `
    select mp_id
    from membershipPlan
    where title =?`;

    const sql3 = `
    update active_member_plan
    set start_date =?, end_date =? , mp_id =?
    where m_id =?`;

    try {
        await connection.beginTransaction();

        const [userInfo] = await connection.query(sql1, [name, gender, img, emergencyphoneNumber, phoneNumber, height, weight, m_id]);
        if (userInfo.affectedRows === 0) {
            connection.rollback();
            connection.release();
            return res.status(404).json({ error: 'Member not found' });
        }

        const [membershipPlan] = await connection.query(sql2, [membership_title]);
        if (membershipPlan.length === 0) {
            connection.rollback();
            connection.release();
            return res.status(404).json({ error: 'Membership plan not found' });
        }

        const [active_member_plan] = await connection.query(sql3, [start_date, end_date, membershipPlan[0].mp_id, m_id]);
        if (active_member_plan.affectedRows === 0) {
            connection.rollback();
            connection.release();
            return res.status(404).json({ error: 'Active member plan not found' });
        }

        connection.commit();
        connection.release();
        return res.status(200).json({ message: 'Member updated successfully' });
    }
    catch (err) {
        console.error(err);
        connection.rollback();
        connection.release();
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = update_member_info;