const db = require("../../config/mysql/mysqlconfig");

const get_all_members = async (_req, res) => {
    try {
        const sql = `
                      WITH latest_amp AS (
                        SELECT *
                        FROM active_member_plan amp1
                        WHERE amp1.start_date = (
                            SELECT MAX(start_date)
                            FROM active_member_plan amp2
                            WHERE amp2.m_id = amp1.m_id
                        )
                    )

                    SELECT 
                        m.m_id,
                        m.name,
                        m.gender,
                        DATE(m.created_at) AS created_at,
                        DATE(m.last_updated) AS last_updated,
                        m.img,
                        m.emergencyphoneNumber,
                        m.phoneNumber,
                        m.height,
                        m.weight,
                        mp.title AS membership_title,
                        mp.type,
                        mp.free_pool_entries,
                        DATE(amp.start_date) AS start_date,
                        DATE(amp.end_date) AS end_date,
                        CASE 
                            WHEN DATEDIFF(amp.end_date, CURDATE()) < 0 THEN 0
                            ELSE DATEDIFF(amp.end_date, CURDATE())
                        END AS remaining_days,
                        COUNT(fpu.fpu_id) AS used_pool_entries,
                        (mp.free_pool_entries - COUNT(fpu.fpu_id)) AS remaining_pool_entries,
                        GROUP_CONCAT(DATE(fpu.entery_date) ORDER BY fpu.entery_date SEPARATOR ', ') AS pool_entry_dates
                    FROM 
                        members m
                    JOIN 
                        latest_amp amp ON amp.m_id = m.m_id
                    JOIN 
                        membershipPlan mp ON amp.mp_id = mp.mp_id
                    LEFT JOIN 
                        freePoolUsage fpu ON fpu.m_id = m.m_id AND fpu.amp_id = amp.amp_id
                    GROUP BY 
                        m.m_id, m.name, m.gender, m.created_at, m.last_updated, m.img,
                        m.emergencyphoneNumber, m.phoneNumber, m.height, m.weight,
                        mp.title, mp.type, mp.free_pool_entries,
                        amp.start_date, amp.end_date;`;

        const [results] = await db.query(sql);

        if (results.length > 0) {
            return res.status(200).json({ results });
        } else {
            return res.status(404).json({ message: "No members found" });
        }
    } catch (err) {
        return res.status(500).json({ message: "internal error please try again" });
    }
};

module.exports = get_all_members;