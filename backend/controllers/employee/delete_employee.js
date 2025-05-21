const db = require("../../config/mysql/mysqlconfig");

const delete_employee = async (req, res) => {
    const { e_id } = req.params;

    if (!e_id) {
        return res.status(400).json({ error: 'id is required' });
    }

    try {
        const [result] = await db.query('DELETE FROM employees WHERE e_id = ?', [e_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'employee not found' });
        }

        return res.status(200).json({ message: 'employee deleted successfully' });
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = delete_employee;