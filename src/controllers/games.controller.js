import { db } from "../database/database.connection.js";

export async function getGames(req, res) {
  const name = req.query.name;
  try {
    const { rows: games } = name
      ? await db.query(`SELECT * FROM games WHERE LOWER(name) LIKE LOWER($1);`, [`${name}%`])
      : await db.query(`SELECT * FROM games;`);
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
