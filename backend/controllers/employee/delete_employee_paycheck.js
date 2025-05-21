const db = require("../../config/mysql/mysqlconfig");

const delete_employee_paycheck = async (req, res) => {
    const { ep_id } = req.params;

    if (!ep_id) {
        return res.status(400).json({ error: 'id is required' });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const [partial] = await connection.query('SELECT epp_id FROM employeespartialpayment WHERE ep_id =?', [ep_id]);

        if (partial.length > 0) {
            await connection.query('DELETE FROM employeespartialpayment WHERE ep_id =?', [ep_id]);
        }

        const [result] = await connection.query('DELETE FROM employeespayment WHERE ep_id = ?', [ep_id]);

        if (result.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ error: 'Employee paycheck not found' });
        }

        await connection.commit();
        return res.status(200).json({ message: 'Employee paycheck deleted successfully' });
    } catch (err) {
        await connection.rollback();
        return res.status(500).json({ error: 'Internal server error' });
    } finally {
        connection.release();
    }
};

module.exports = delete_employee_paycheck;