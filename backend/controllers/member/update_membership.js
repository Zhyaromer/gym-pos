const db = require("../../config/mysql/mysqlconfig");

const update_membership = async (req, res) => {
    const { m_id } = req.params;
    const { membership_title, start_date, end_date , type } = req.body;

    if (!m_id) {
        return res.status(400).json({ error: 'Member ID is required' });
    }

    if (!membership_title || !start_date || !end_date || !type) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (start_date > end_date) {
        return res.status(400).json({ message: "Invalid date range" });
    }

    const sql1 = `
        SELECT mp_id FROM membershipPlan WHERE title = ? and type =?
    `;

    const sqlCheckExisting = `
        SELECT * FROM active_member_plan 
        WHERE m_id = ? AND start_date <= ? AND end_date >= ?
    `;

    const sql2 = `
        INSERT INTO active_member_plan (m_id, mp_id, start_date, end_date)
        VALUES (?, ?, ?, ?)
    `;

    const sql3 = `
    update members set last_updated =? where m_id =?
    `;

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const [planResult] = await connection.query(sql1, [membership_title , type]);

        if (planResult.length === 0) {
            await connection.rollback();
            connection.release();
            return res.status(404).json({ error: 'Membership plan not found' });
        }

        const mp_id = planResult[0].mp_id;

        const [existing] = await connection.query(sqlCheckExisting, [m_id, end_date, start_date]);
        if (existing.length > 0) {
            await connection.rollback();
            connection.release();
            return res.status(409).json({ error: 'Member already has an active membership in this date range' });
        }

        const [insertResult] = await connection.query(sql2, [m_id, mp_id, start_date, end_date]);

        if (insertResult.affectedRows === 0) {
            await connection.rollback();
            connection.release();
            return res.status(500).json({ error: 'Failed to insert membership plan' });
        }

        const [updateResult] = await connection.query(sql3, [new Date(), m_id]);

        if (updateResult.affectedRows === 0) {
            await connection.rollback();
            connection.release();
            return res.status(500).json({ error: 'Failed to update last_updated' });
        }

        await connection.commit();
        connection.release();
        return res.status(200).json({ message: 'Membership updated successfully' });
    } catch (err) {
        await connection.rollback();
        connection.release();
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = update_membership;