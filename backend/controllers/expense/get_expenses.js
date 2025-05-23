const db = require("../../config/mysql/mysqlconfig");

const get_expenses = async (req, res) => {
    try {
        const { filter, start_date, end_date, category_id } = req.query;
        const finalFilter = filter || (!start_date && !end_date ? 'today' : null);

        let whereClause = '';
        let params = [];

        if (finalFilter && (!start_date && !end_date)) {
            whereClause = 'WHERE ';
            switch (finalFilter) {
                case 'today':
                    whereClause += 'DATE(expenses_date) = CURDATE()';
                    break;
                case 'yesterday':
                    whereClause += 'DATE(expenses_date) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)';
                    break;
                case 'week':
                    whereClause += 'expenses_date >= DATE_SUB(CURDATE(), INTERVAL 1 WEEK)';
                    break;
                case 'last_week':
                    whereClause += `YEARWEEK(expenses_date, 1) = YEARWEEK(CURDATE(), 1) - 1`;
                    break;
                case 'month':
                    whereClause += 'expenses_date >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)';
                    break;
                case 'last_month':
                    whereClause += `
                        MONTH(expenses_date) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
                        AND YEAR(expenses_date) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))`;
                    break;
                case 'year':
                    whereClause += 'expenses_date >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)';
                    break;
                case 'all':
                    whereClause = '';
                    break;
                default:
                    whereClause = '';
            }
        }
        else if (!finalFilter && start_date && end_date) {
            whereClause = 'WHERE expenses_date BETWEEN ? AND ?';
            params.push(start_date, end_date);
        }

        if (category_id) {
            if (whereClause) {
                whereClause += ' AND expenses_category_id = ?';
            } else {
                whereClause = 'WHERE expenses_category_id = ?';
            }
            params.push(category_id);
        }

        const query = `
            SELECT e.*, 
                DATE_FORMAT(e.expenses_date, '%Y-%m-%d') AS expenses_date,
                c.name AS category_name 
            FROM expenses e
            LEFT JOIN expenses_category c ON e.expenses_category_id = c.expenses_category_id
            ${whereClause}
            ORDER BY expenses_date DESC
            `;

        const [rows] = await db.query(query, params);

        const total = rows.reduce((sum, expense) => sum + parseFloat(expense.price), 0);

        res.json({
            success: true,
            data: rows,
            count: rows.length,
            total: total
        });
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch expenses',
            error: error.message
        });
    }
};

module.exports = get_expenses;