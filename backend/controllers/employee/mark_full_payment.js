const db = require("../../config/mysql/mysqlconfig");

const mark_full_payment = async (req, res) => {
    const { e_id, year, month } = req.params;

    if (!e_id || !year || !month) {
        return res.status(400).json({ message: 'e_id, year, and month parameters are required' });
    }

    if (!/^\d{4}$/.test(year) || month < 1 || month > 12) {
        return res.status(400).json({ message: 'Invalid year or month value' });
    }

    const sql1 = `
    select salary from employees
    where e_id = ?
    `;

    const sql2 = `
    update employeespayment 
    set has_paid_full = 1 , paid_amount = ? , paid_date = ?
    where e_id =? and year =? and month =?
    `;

    const sql3 = `
    select ep_id from employeespayment 
    where e_id =? and year =? and month =?
    `;

    const sql4 = `
    update employeespartialpayment
    set remaining_paid_amount = 0
    where ep_id =?
    `;

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const [result1] = await connection.query(sql1, [e_id]);
        if (result1.length === 0) {
            connection.rollback();
            return res.status(404).json({ message: 'Employee not found' });
        }
        const salary = result1[0].salary;
        const paidDate = new Date().toISOString().split('T')[0];

        const [result2] = await connection.query(sql2, [salary, paidDate, e_id, year, month]);

        if (result2.affectedRows === 0) {
            connection.rollback();
            return res.status(404).json({ message: 'Payment update failed' });
        }

        const [result3] = await connection.query(sql3, [e_id, year, month]);

        if (result3.length === 0) {
            connection.rollback();
            return res.status(404).json({ message: 'Payment record not found for given month and year' });
        }

        const ep_id = result3[0].ep_id;

        const [result4] = await connection.query(sql4, [ep_id]);

        if (result4.affectedRows === 0) {
            connection.rollback();
            return res.status(404).json({ message: 'Partial payment update failed' });
        }

        await connection.commit();
        return res.status(200).json({ message: 'Employee payment marked as full paid successfully' });
    } catch (error) {
        connection.rollback();
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    } finally {
        connection.release();
    }
}

module.exports = mark_full_payment;