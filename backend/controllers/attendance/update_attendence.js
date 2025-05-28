const db = require("../../config/mysql/mysqlconfig");

const update_attendence_record = async (req, res) => {
    let { attendence_id, entry_time, leaving_time, state, note } = req.body;

    if (!attendence_id || !entry_time || !state) {
        return res.status(400).json({ message: "Attendence ID is required" });
    }

    try {
        let sql = `
            UPDATE attendence
            SET entry_time = ?,
                state = ?,
                note = ?
        `;
        const values = [entry_time ?? null, state ?? null, note ?? null];

        if (leaving_time) {
            const start = new Date(`1970-01-01T${entry_time}`);
            const end = new Date(`1970-01-01T${leaving_time}`);

            if (end < start) end.setDate(end.getDate() + 1);

            const diffMs = end - start;
            const diffMins = Math.floor(diffMs / 60000);
            const hours = Math.floor(diffMins / 60);
            const minutes = diffMins % 60;
            const working_hours = `${hours} کاتژمێرو ${minutes} خولەک`;

            sql += `,
                leaving_time = ?,
                working_hours = ?
            `;
            values.push(leaving_time, working_hours);
        }

        sql += ` WHERE attendence_id = ?`;
        values.push(attendence_id);

        const [result] = await db.query(sql, values);

        if (result.affectedRows > 0) {
            return res.status(200).json({ message: "Attendence Record Updated Successfully" });
        } else {
            return res.status(404).json({ message: "Attendence Record Not Found" });
        }
    } catch (error) {
        console.error("Error updating attendence:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = update_attendence_record;