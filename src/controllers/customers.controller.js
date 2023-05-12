import { db } from "../database/database.connection.js";

export async function getCustomers(req, res) {
  const id = req.params.id;
  const cpf = req.query.cpf;

  try {
    if (!req.params.id) {
      const { rows } = cpf
        ? await db.query(
            `SELECT * FROM customers WHERE LOWER(cpf) LIKE LOWER($1);`,
            [`${cpf}%`]
          )
        : await db.query(`SELECT * FROM customers`);
      const customers = rows.map((c) => ({
        ...c,
        birthday: c.birthday.toLocaleDateString("en-CA"),
      }));
      return res.send(customers);
    }

    const { rows, rowCount } = await db.query(
      `SELECT * FROM customers WHERE id=$1`,
      [id]
    );

    if (!rowCount) return res.sendStatus(404);

    const customer = rows[0];
    customer.birthday = customer.birthday.toLocaleDateString("en-CA");

    res.send(customer);
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
    if (customer.rows[0]) return res.sendStatus(409);

    await db.query(
      `INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)`,
      [name, phone, cpf, birthday]
    );
    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function editCustomers(req, res) {
  const id = req.params.id;
  const { name, phone, cpf, birthday } = req.body;

  try {
    const cpfInUse = await db.query(
      `SELECT * FROM customers WHERE cpf = $1 AND id != $2;`,
      [cpf, id]
    );
    if (cpfInUse.rowCount) return res.sendStatus(409);

    await db.query(
      `UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id=$5`,
      [name, phone, cpf, birthday, id]
    );
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
