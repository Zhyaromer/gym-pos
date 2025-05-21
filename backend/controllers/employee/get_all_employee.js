const db = require("../../config/mysql/mysqlconfig");

const getAllEmployee = async (req, res) => {
    try {
        const sql = `
        SELECT 
            e_id,
            name,
            email,
            gender,
            date_of_birth,
            TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) AS age,
            working_date,
            TIMESTAMPDIFF(YEAR, working_date, CURDATE()) AS working_years,
            phoneNumber,
            emergencyphoneNumber,
            address,
            role,
            salary,
            img,
            created_at,
            last_updated
        FROM 
            employees`;

        const [rows] = await db.query(sql);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'No employees found' });
        }
        
        return res.status(200).json(rows);
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = getAllEmployee;