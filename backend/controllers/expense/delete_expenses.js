const db = require("../../config/mysql/mysqlconfig");

const remove_expense = async (req, res) => {
    const { expenses_id } = req.params;

    if (!expenses_id) {
        return res.status(400).json({ message: "Expense ID is required" });
    }

    try {
        const sql = "DELETE FROM expenses WHERE expenses_id = ?";
        const values = [expenses_id];

        const [result] = await db.query(sql, values);

        if (result.affectedRows > 0) {
            return res.status(200).json({ message: "Expense Removed Successfully" });
        } else {
            return res.status(400).json({ message: "Expense Not Found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = remove_expense;
