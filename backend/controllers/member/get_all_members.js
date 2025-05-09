const db = require("../../config/mysql/mysqlconfig");

const get_all_members = async (req, res) => {
    try {
        const sql = `SELECT 
                    m.m_id,
                    m.name,
                    mp.title AS membership_title,
                    mp.access_level,
                    mp.free_pool_entries,
                    amp.start_date,
                    amp.end_date,
                    DATEDIFF(amp.end_date, CURDATE()) AS remaining_days,
                    COUNT(fpu.fpu_id) AS used_pool_entries,
                    (mp.free_pool_entries - COUNT(fpu.fpu_id)) AS remaining_pool_entries,
                    GROUP_CONCAT(DATE(fpu.entery_date) ORDER BY fpu.entery_date SEPARATOR ', ') AS pool_entry_dates
                FROM 
                    members m
                JOIN 
                    active_member_plan amp ON amp.m_id = m.m_id
                JOIN 
                    membershipPlan mp ON amp.mp_id = mp.mp_id
                LEFT JOIN 
                    freePoolUsage fpu ON fpu.m_id = m.m_id AND fpu.amp_id = amp.amp_id
                GROUP BY 
                    m.m_id, m.name, mp.title, mp.access_level, mp.free_pool_entries,
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