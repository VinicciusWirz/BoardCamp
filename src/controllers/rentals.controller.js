import { db } from "../database/database.connection.js";

export async function getRentals(req, res){
    res.send("placeholder, rentals");
}

export async function addRental(req, res) {
  const { customerId, gameId, daysRented } = req.body;
  try {
    const customer = await db.query(`SELECT * FROM customers WHERE id=$1;`, [
      customerId,
    ]);
    const game = await db.query(`SELECT * FROM games WHERE id=$1;`, [gameId]);
    const gameRentals = await db.query(
      `SELECT * FROM rentals WHERE "gameId"=$1;`,
      [gameId]
    );
    const validation =
      !game.rowCount ||
      !customer.rowCount ||
      gameRentals.rowCount >= game.rows[0].stockTotal;

    if (validation) return res.sendStatus(400);

    const rentDate = new Date().toLocaleDateString("en-CA");
    const originalPrice = game.rows[0].pricePerDay * daysRented;

    await db.query(
      `INSERT INTO 
    rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") 
     VALUES ($1, $2, $3, $4, $5, $6, $7);`,
      [customerId, gameId, rentDate, daysRented, null, originalPrice, null]
    );

    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
