import { db } from "../database/database.connection.js";

export async function getCustomers(req, res) {
  const id = req.params.id;

  try {
    if (!req.params.id) {
      const result = await db.query(`SELECT * FROM customers`);
      const costumers = result.rows.map((c) => ({
        ...c,
        birthday: c.birthday.toISOString().substring(0, 10),
      }));
      return res.send(costumers);
    }

    const customer = await db.query(`SELECT * FROM customers WHERE id=$1`, [
      id,
    ]);

    if (!customer.rowCount) return res.sendStatus(404);

    customer.rows[0].birthday = customer.rows[0].birthday
      .toISOString()
      .substring(0, 10);

    res.send(customer.rows[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function addCustomer(req, res) {
  const { name, phone, cpf, birthday } = req.body;

  try {
    const customer = await db.query(`SELECT * FROM customers WHERE cpf=$1`, [
      cpf,
    ]);
    if (customer) return res.sendStatus(409);

    await db.query(
      `INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)`,
      [name, phone, cpf, birthday]
    );
    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
