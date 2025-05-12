const db = require("../../config/mysql/mysqlconfig");

const paying_employee = async (req, res) => {
   const { e_id } = req.params;
   const { year, month, paymentDate, amount, paid_amount, notes, isPartial } = req.body;

   if (!e_id) {
      return res.status(400).json({ message: "Employee ID is required" });
   }

   if (!year || !month || !paymentDate || isNaN(amount) || isNaN(paid_amount)) {
      return res.status(400).json({ message: "All fields are required and must be valid" });
   }

   if (amount <= 0 || paid_amount <= 0) {
      return res.status(400).json({ message: "Amounts must be positive values" });
   }

   const connection = await db.getConnection();
   try {
      await connection.beginTransaction();

      const sql = `
         INSERT INTO employeespayment(e_id, year, month, paid_date, paid_amount, note, has_paid_full)
         VALUES (?, ?, ?, ?, ?, ?, ?)`;

      const has_paid_full = paid_amount >= amount;
      const [result] = await connection.query(sql, [
         e_id,
         year,
         month,
         paymentDate,
         paid_amount,
         notes || null,
         has_paid_full
      ]);

      if (result.affectedRows === 0) {
         throw new Error("Failed to insert payment record");
      }

      if (isPartial && paid_amount < amount) {
         const remainingAmount = amount - paid_amount;
         const partialSql = `
            INSERT INTO employeespartialpayment(ep_id, paid_date, remaining_paid_amount)
            VALUES (?, ?, ?)`;

         const [partialPayment] = await connection.query(partialSql, [
            result.insertId,
            paymentDate,
            remainingAmount
         ]);

         if (partialPayment.affectedRows === 0) {
            throw new Error("Failed to insert partial payment record");
         }
      }

      await connection.commit();
      return res.status(200).json({ message: "Payment processed successfully" });
   } catch (error) {
      await connection.rollback();
      console.error("Payment processing error:", error);
      return res.status(500).json({ message: "Payment processing failed" });
   } finally {
      connection.release();
   }
}

module.exports = paying_employee;