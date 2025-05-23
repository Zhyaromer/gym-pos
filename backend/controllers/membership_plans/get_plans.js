const db = require("../../config/mysql/mysqlconfig");

const get_plans = async (_req, res) => {
  try {
    const [rows] = await db.query(`select distinct type , mp_id , title as duration , price , free_pool_entries from membershipplan`);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No plans found' });
    }

    const plans = {};
    Object.keys(rows).forEach((key) => {
      const plan = rows[key];
      if (plan.type) {
        if (!plans[plan.type]) {
          plans[plan.type] = {
            type: plan.type,
            plans: []
          }
        }
        plans[plan.type].plans.push({
          mp_id: plan.mp_id,
          duration: plan.duration,
          price: plan.price,
          free_pool_entries: plan.free_pool_entries
        }
        )
      }
    });

    res.status(200).json(plans);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

module.exports = get_plans;