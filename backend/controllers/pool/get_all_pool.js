const db = require("../../config/mysql/mysqlconfig");

const get_all_pool = async (req, res) => {
    const { date } = req.query;

    if (!date) {
        return res.status(400).json({ error: 'Missing date parameter (format: YYYY-MM-DD)' });
    }

    const sql1 =
        `
        SELECT 
          COUNT(CASE WHEN age = 'گەورە' THEN 1 END) AS adult,
          COUNT(CASE WHEN age = 'منداڵ' THEN 1 END) AS kids,
          COUNT(CASE WHEN gender = 'ئافرەت' THEN 1 END) AS female,
          COUNT(CASE WHEN gender = 'پیاو' THEN 1 END) AS male,
          COUNT(swimmingpool_id) AS sold_tickets,
          SUM(price) AS total_sold_tickets
        FROM swimmingpool
        WHERE entry_date = ?`;

    const sql2 = `SELECT * FROM swimmingpool WHERE entry_date = ?`;

    try {
        const [statsRows] = await db.query(sql1, [date]);
        const [allRows] = await db.query(sql2, [date]);

        res.json({
            date,
            stats: statsRows[0],
            records: allRows,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
}

module.exports = get_all_pool;