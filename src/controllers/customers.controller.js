import { db } from "../database/database.connection.js";

export async function getCustomers(req, res) {
  const id = req.params.id;
  const { cpf, offset, limit, order, desc } = req.query;
  const params = [];
  let query = `SELECT * FROM customers`;
  if (id) {
    query += ` WHERE id = $1`;
    params.push(id);
  } else {
    if (cpf) {
      params.push(`${cpf}%`);
      query += ` WHERE LOWER(cpf) LIKE LOWER($${params.length})`;
    }
    if (offset) {
      params.push(Number(offset));
      query += ` OFFSET $${params.length}`;
    }
    if (limit) {
      params.push(Number(limit));
      query += ` LIMIT $${params.length}`;
    }
    if (order) {
      query += ` ORDER BY "${order}"${desc ? ` DESC` : ``}`;
    }
  }
  query += `;`;

  try {
    const { rows, rowCount } = !params.length
      ? await db.query(query)
      : await db.query(query, params);

    if (!rowCount && query.includes('id')) return res.sendStatus(404);

    const customers = rows.map((customer) => ({
      ...customer,
      birthday: customer.birthday.toLocaleDateString("en-CA"),
    }));

    return res.send(id ? customers[0] : customers);
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
