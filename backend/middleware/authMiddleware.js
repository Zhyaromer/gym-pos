const jwt = require('jsonwebtoken');
const db = require('../config/mysql/mysqlconfig');

const authenticateToken = async (req, res, next) => {
    try {
        // Get token from cookie
        const token = req.cookies.authToken;

        if (!token) {
            return res.status(401).json({ message: "Access token required" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

        // Check if employee still exists and is active
        const sql = `SELECT e_id, name, email, role, is_active FROM employees WHERE e_id = ?`;
        const [rows] = await db.query(sql, [decoded.e_id]);

        if (rows.length === 0) {
            return res.status(401).json({ message: "Employee not found" });
        }

        const employee = rows[0];

        // Check if employee is still active
        if (!employee.is_active) {
            return res.status(401).json({ message: "Account is deactivated" });
        }

        // Attach user info to request
        req.user = {
            e_id: employee.e_id,
            name: employee.name,
            email: employee.email,
            role: employee.role
        };

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expired" });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token" });
        }
        
        console.error('Auth middleware error:', error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = authenticateToken; 