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
        
        SELECT
            (SELECT COUNT(*) FROM all_employees) AS total_employees_count,
            (SELECT SUM(salary) FROM all_employees) AS total_salary_amount,
            (SELECT COUNT(*) FROM paid_employees) AS paid_employees_count,
            (SELECT SUM(paid_amount) FROM paid_employees) AS total_paid_amount,
            (SELECT COUNT(*) FROM paid_employees WHERE has_paid_full = 1) AS fully_paid_count,
            (SELECT SUM(paid_amount) FROM paid_employees WHERE has_paid_full = 1) AS fully_paid_amount,
            (SELECT COUNT(*) FROM paid_employees WHERE has_paid_full = 0) AS partially_paid_count,
            (SELECT SUM(paid_amount) FROM paid_employees WHERE has_paid_full = 0) AS partially_paid_amount,
            (SELECT SUM(remaining_amount) FROM paid_employees WHERE has_paid_full = 0) AS remaining_to_pay_amount,
            (SELECT COUNT(*) FROM unpaid_employees) AS unpaid_employees_count,
            (SELECT SUM(salary) FROM unpaid_employees) AS unpaid_salary_amount;
        `;

        const [summaryResults] = await db.query(sql, [year, month, year, month]);

        if (!summaryResults || summaryResults.length === 0) {
            return res.status(404).json({ message: 'No summary data found' });
        }

        const detailsSql = `
                        WITH
                    paid_or_partially_paid AS (
                        SELECT 
                            e.e_id,
                            e.name,
                            e.img,
                            e.role,
                            e.salary,
                            ep.ep_id,
                            ep.paid_amount,
                            ep.paid_date,
                            ep.has_paid_full,
                            ep.note,
                            ep.month,
                            ep.year,
                            CASE 
                                WHEN ep.has_paid_full = 1 THEN 'Fully Paid'
                                ELSE 'Partially Paid'
                            END AS payment_status,
                            e.salary - IFNULL(ep.paid_amount, 0) AS amount_due
                        FROM 
                            employeespayment ep
                        JOIN 
                            employees e ON ep.e_id = e.e_id
                        WHERE 
                            ep.year = ? AND ep.month = ?
                    ),

                    unpaid AS (
                        SELECT 
                            e.e_id,
                            e.name,
                            e.img,
                            e.role,
                            e.salary,
                            0 AS paid_amount,
                            NULL AS paid_date,
                            0 AS has_paid_full,
                            NULL AS note,
                            NULL as month,
                            null as ep_id,
                            NULL as year,
                            'Not Paid' AS payment_status,
                            e.salary AS amount_due
                        FROM 
                            employees e
                        WHERE 
                            e.e_id NOT IN (
                                SELECT e_id 
                                FROM employeespayment 
                                WHERE year = ? AND month = ?
                            )
                    )

                    SELECT * FROM paid_or_partially_paid
                    UNION ALL
                    SELECT * FROM unpaid;`;

        const [detailsResults] = await db.query(detailsSql, [year, month, year, month]);

        const groupedDetails = {
            paid_or_partially_paid: detailsResults.filter(emp =>
                emp.payment_status === 'Fully Paid' || emp.payment_status === 'Partially Paid'),
            unpaid: detailsResults.filter(emp => emp.payment_status === 'Not Paid')
        };

        return res.status(200).json({
            summary: summaryResults[0],
            details: groupedDetails
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

module.exports = get_employee_payment_status;