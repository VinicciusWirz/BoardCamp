import { db } from "../database/database.connection.js";

export async function rentalValidId(req, res, next) {
  const id = req.params.id;
  try {
    const rental = await db.query(`SELECT * FROM rentals WHERE id=$1`, [id]);
    if (!rental.rowCount) return res.sendStatus(404);
    res.locals.rental = rental.rows[0];
    next();
  } catch (error) {
    res.status(500).send(error.message);
  }
}
