import { db } from "../database/database.connection.js";

export async function getGames(req, res) {
  try {
    const {rows: games} = await db.query(`SELECT * FROM games`);
    res.send(games);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
