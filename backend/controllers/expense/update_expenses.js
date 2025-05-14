const db = require("../../config/mysql/mysqlconfig");

const update_expense = async (req, res) => {
    const { expenses_id, expenses_category_id, name, expenses_date, price } = req.body;

    if (!expenses_id || !expenses_category_id || !name || !price) {
        return res.status(400).json({ message: "Expense ID, category, name, and price are required" });
    }

    try {
        const sql = `
            UPDATE expenses
            SET expenses_category_id = ?, name = ?, expenses_date = ?, price = ?
            WHERE expenses_id = ?
        `;
        const values = [expenses_category_id, name, expenses_date || new Date(), price, expenses_id];

        const [result] = await db.query(sql, values);

        if (result.affectedRows > 0) {
            return res.status(200).json({ message: "Expense Updated Successfully" });
        } else {
            return res.status(400).json({ message: "Expense Not Found or Not Updated" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = update_expense;