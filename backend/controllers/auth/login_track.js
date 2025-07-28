const db = require("../../config/mysql/mysqlconfig");

class LoginTrack {
    static async addLoginRecord(e_id) {
        try {
            const sql = `INSERT INTO login_track (e_id, login_time) VALUES (?, NOW())`;
            const [result] = await db.query(sql, [e_id]);
            return result.insertId;
        } catch (error) {
            console.error('Error adding login record:', error);
            throw error;
        }
    }

    static async getLoginHistory(limit = 100) {
        try {
            const sql = `
                SELECT 
                    lt.login_track_id,
                    lt.e_id,
                    lt.login_time,
                    e.name as employee_name,
                    e.email as employee_email,
                    e.role as employee_role
                FROM login_track lt
                LEFT JOIN employees e ON lt.e_id = e.e_id
                ORDER BY lt.login_time DESC
                LIMIT ?
            `;
            const [rows] = await db.query(sql, [limit]);
            return rows;
        } catch (error) {
            console.error('Error getting login history:', error);
            throw error;
        }
    }
}

module.exports = LoginTrack;
