const db = require("../../config/mysql/mysqlconfig");

const get_specified_member = async (req, res) => {
    const { m_id, m_phone } = req.query;

    if (!m_id && !m_phone) {
        return res.status(400).json({ error: 'id or phone are required' });
    }

    if (m_phone && !/^\d{10,11}$/.test(String(m_phone))) {
        return res.status(400).json({ message: "Invalid phone number length or format" });
    }

    const baseQuery = `
            SELECT 
                m.m_id,
                m.name,
                m.gender,
                m.created_at,
                m.last_updated,
                m.img,
                m.emergencyphoneNumber,
                m.phoneNumber,
                m.height,
                m.weight,
                mp.title AS membership_title,
                mp.type,
                mp.free_pool_entries,
                amp.start_date,
                amp.end_date,
                DATEDIFF(amp.end_date, CURDATE()) AS remaining_days,
                COUNT(fpu.fpu_id) AS used_pool_entries,
                (mp.free_pool_entries - COUNT(fpu.fpu_id)) AS remaining_pool_entries,
                GROUP_CONCAT(DATE(fpu.entery_date) ORDER BY fpu.entery_date SEPARATOR ', ') AS pool_entry_dates
            FROM 
                members m
            JOIN (
                SELECT amp1.*
                FROM active_member_plan amp1
                INNER JOIN (
                    SELECT m_id, MAX(start_date) AS latest_start
                    FROM active_member_plan
                    GROUP BY m_id
                ) latest ON amp1.m_id = latest.m_id AND amp1.start_date = latest.latest_start
            ) amp ON amp.m_id = m.m_id
            JOIN membershipPlan mp ON amp.mp_id = mp.mp_id
            LEFT JOIN freePoolUsage fpu ON fpu.m_id = m.m_id AND fpu.amp_id = amp.amp_id`;

        const groupBy = `
            GROUP BY 
                m.m_id, m.name, m.gender, m.created_at,
                m.last_updated, m.img, m.emergencyphoneNumber,
                m.phoneNumber, m.height, m.weight,
                mp.title, mp.type, mp.free_pool_entries,
                amp.start_date, amp.end_date`;

    try {
        let result;
        if (m_id) {
            const sql = baseQuery + ` WHERE m.m_id = ? ` + groupBy;
            [result] = await db.query(sql, [m_id]);
        } else {
            const sql = baseQuery + ` WHERE m.phoneNumber = ? ` + groupBy;
            [result] = await db.query(sql, [m_phone]);
        }

        if (result.length === 0) {
            return res.status(404).json({ error: 'Member not found' });
        }

        return res.status(200).json({ result });
    } catch (error) {
        console.error(error); 
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = get_specified_member;