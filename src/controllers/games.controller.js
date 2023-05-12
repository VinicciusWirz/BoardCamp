import { db } from "../database/database.connection.js";

export async function getGames(req, res) {
  const name = req.query.name;
  const offset = req.query.offset;
  const limit = req.query.limit;
  const params = [];
  let query = `SELECT * FROM games `;
  if (name) {
    query += `WHERE LOWER(name) LIKE LOWER($${params.length + 1})`;
    params.push(`${name}%`);
  }
  if (offset) {
    query += `OFFSET $${params.length + 1}`;
    params.push(Number(offset));
  }
  if (limit) {
    query += `LIMIT $${params.length + 1}`;
    params.push(Number(limit));
  }
  query += `;`;
  try {
    const { rows: games } = !params.length
      ? await db.query(query)
      : await db.query(query, params);
    res.send(games);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function addGame(req, res) {
  const { name, image, stockTotal, pricePerDay } = req.body;
  try {
    const game = await db.query(`SELECT * FROM games WHERE name=$1;`, [name]);
    if (game.rowCount) return res.status(409).send("Game is already in db");
    await db.query(
      `INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4);`,
      [name, image, stockTotal, pricePerDay]
    );
    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
