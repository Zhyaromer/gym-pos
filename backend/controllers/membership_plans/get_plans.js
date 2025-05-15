const db = require("../../config/mysql/mysqlconfig");

const get_plans = async (_req, res) => {
    try {
        const [rows] = await db.query(`SELECT * FROM membershipplan`);

        if (rows.length === 0) {
          return res.status(404).json({ message: 'No plans found' });
        }

        res.status(200).json(rows);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
      }
};

module.exports = get_plans;