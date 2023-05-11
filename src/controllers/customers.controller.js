import { db } from "../database/database.connection.js";

export async function getCustomers(req, res) {
  const id = req.params.id;
  try {
    const customer = await db.query(`SELECT * FROM customers WHERE id=$1`, [
      id,
    ]);

    if (!customer.rowCount) return res.sendStatus(404);

    res.send(customer.rows[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
