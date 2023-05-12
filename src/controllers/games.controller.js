import { db } from "../database/database.connection.js";

export async function getGames(req, res) {
  const { name, offset, limit } = req.query;
  const params = [];
  let query = `SELECT * FROM games `;
  if (name) {
    params.push(`${name}%`);
    query += `WHERE LOWER(name) LIKE LOWER($${params.length})`;
  }
  if (offset) {
    params.push(Number(offset));
    query += ` OFFSET $${params.length}`;
  }
  if (limit) {
    params.push(Number(limit));
    query += ` LIMIT $${params.length}`;
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
