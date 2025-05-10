const db = require("../../config/mysql/mysqlconfig");

const delete_member = async (req, res) => {
    const { m_id } = req.params;

    if (!m_id) {
        return res.status(400).json({ error: 'id is required' });
    }

    try {
        const [result] = await db.query('DELETE FROM members WHERE m_id = ?', [m_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Member not found' });
        }

        return res.status(200).json({ message: 'Member deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = delete_member;
