const db = require("../../config/mysql/mysqlconfig");

const get_employee_payment_status = async (req, res) => {
    try {
        const { year, month } = req.query;
        
        if (!year || !month) {
            return res.status(400).json({ message: 'Year and month parameters are required' });
        }

        const sql = `
        WITH 
        all_employees AS (
            SELECT 
                e_id,
                name,
                role,
                salary
            FROM 
                employees
        ),
        
        paid_employees AS (
            SELECT 
                ep.e_id,
                ep.ep_id,
                e.name,
                e.role,
                e.salary,
                ep.paid_amount,
                ep.has_paid_full,
                CASE 
                    WHEN ep.has_paid_full = 1 THEN 'Fully Paid'
                    ELSE 'Partially Paid'
                END AS payment_status,
                IFNULL(epp.remaining_paid_amount, 0) AS remaining_amount
            FROM 
                employeespayment ep
            JOIN 
                employees e ON ep.e_id = e.e_id
            LEFT JOIN 
                employeespartialpayment epp ON ep.ep_id = epp.ep_id
            WHERE 
                ep.year = ? AND ep.month = ?
        ),
        
        -- Employees who haven't been paid at all in the specified month/year
        unpaid_employees AS (
            SELECT 
                e.e_id,
                e.name,
                e.role,
                e.salary
            FROM 
                employees e
            WHERE 
                e.e_id NOT IN (
                    SELECT e_id 
                    FROM employeespayment 
                    WHERE year = ? AND month = ?
                )
        )
        
        -- Main query combining all data
        SELECT
            -- Totals for all employees
            (SELECT COUNT(*) FROM all_employees) AS total_employees_count,
            (SELECT SUM(salary) FROM all_employees) AS total_salary_amount,
            
            -- Paid employees stats
            (SELECT COUNT(*) FROM paid_employees) AS paid_employees_count,
            (SELECT SUM(paid_amount) FROM paid_employees) AS total_paid_amount,
            
            -- Fully paid employees stats
            (SELECT COUNT(*) FROM paid_employees WHERE has_paid_full = 1) AS fully_paid_count,
            (SELECT SUM(paid_amount) FROM paid_employees WHERE has_paid_full = 1) AS fully_paid_amount,
            
            -- Partially paid employees stats
            (SELECT COUNT(*) FROM paid_employees WHERE has_paid_full = 0) AS partially_paid_count,
            (SELECT SUM(paid_amount) FROM paid_employees WHERE has_paid_full = 0) AS partially_paid_amount,
            (SELECT SUM(remaining_amount) FROM paid_employees WHERE has_paid_full = 0) AS remaining_to_pay_amount,
            
            -- Unpaid employees stats
            (SELECT COUNT(*) FROM unpaid_employees) AS unpaid_employees_count,
            (SELECT SUM(salary) FROM unpaid_employees) AS unpaid_salary_amount;
        `;

        const [results] = await db.query(sql, [year, month, year, month]);

        if (!results || results.length === 0) {
            return res.status(404).json({ message: 'No data found' });
        }

        const detailedSql = `
        SELECT 
            e.e_id,
            e.name,
            e.role,
            e.salary,
            CASE 
                WHEN ep.ep_id IS NULL THEN 'Not Paid'
                WHEN ep.has_paid_full = 1 THEN 'Fully Paid'
                ELSE 'Partially Paid'
            END AS payment_status,
            IFNULL(ep.paid_amount, 0) AS paid_amount,
            IFNULL(epp.remaining_paid_amount, 0) AS remaining_amount,
            e.salary - IFNULL(ep.paid_amount, 0) AS amount_due
        FROM 
            employees e
        LEFT JOIN 
            employeespayment ep ON e.e_id = ep.e_id AND ep.year = ? AND ep.month = ?
        LEFT JOIN 
            employeespartialpayment epp ON ep.ep_id = epp.ep_id
        ORDER BY 
            payment_status, e.name`;

        const [detailedResults] = await db.query(detailedSql, [year, month]);

        return res.status(200).json({
            summary: results[0],
            details: detailedResults
        });
    } catch (error) {
        console.error('Error fetching payment status:', error);
        return res.status(500).json({ 
            message: 'Internal Server Error',
            error: error.message 
        });
    }
}

module.exports = get_employee_payment_status;