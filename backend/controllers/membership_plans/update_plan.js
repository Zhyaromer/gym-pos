const db = require("../../config/mysql/mysqlconfig");

const update_plans = async (req, res) => {
    const { title, duration, free_pool_entries, price } = req.body;
    const { plan_id } = req.params;

    if (!plan_id) {
        return res.status(400).json({ message: "Membership plan ID is required" });
    }

    if (!title || duration == null || free_pool_entries == null || price == null) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const [result] = await db.query(
            `UPDATE membershipplan SET title = ?, duration = ?, free_pool_entries = ?, price = ?
             WHERE mp_id = ?`,
            [title, duration, free_pool_entries, price, plan_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Membership plan not found' });
        }

        res.json({ message: 'Membership plan updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
}

module.exports = update_plans;