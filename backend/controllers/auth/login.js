const db = require("../../config/mysql/mysqlconfig");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const LoginTrack = require("./login_track");

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        // Check if employee exists
        const sql = `SELECT e_id, name, email, password, role FROM employees WHERE email = ?`;
        const [rows] = await db.query(sql, [email]);

        if (rows.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const employee = rows[0];

        // Verify password
        const isValidPassword = await bcrypt.compare(password, employee.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Track login
        try {
            await LoginTrack.addLoginRecord(employee.e_id);
        } catch (trackError) {
            console.error('Error tracking login:', trackError);
            // Don't fail the login if tracking fails
        }

        // Create JWT token
        const token = jwt.sign(
            {
                e_id: employee.e_id,
                name: employee.name,
                email: employee.email,
                role: employee.role
            },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '8h' }
        );

        // Set HTTP-only cookie
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 8 * 60 * 60 * 1000 // 8 hours
        });

        // Return success response
        res.status(200).json({
            message: "Login successful",
            employee: {
                e_id: employee.e_id,
                name: employee.name,
                email: employee.email,
                role: employee.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = login; 