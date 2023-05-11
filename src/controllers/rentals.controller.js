import { db } from "../database/database.connection.js";

export async function getRentals(req, res) {
  const customerId = req.query.customerId;
  try {
    const query = `
    SELECT
      rentals.*,
      customers.name AS customer_name,
      games.name AS game_name
    FROM rentals
    JOIN customers ON rentals."customerId" = customers.id
    JOIN games ON rentals."gameId" = games.id
    ${customerId ? `WHERE "customerId"=$1` : ``};`;

    const { rows, rowCount } = customerId
      ? await db.query(query, [customerId])
      : await db.query(query);

    if (!rowCount) return res.send([]);

    const rentalsList = rows.map((r) => ({
      id: r.id,
      customerId: r.customerId,
      gameId: r.gameId,
      rentDate: r.rentDate.toLocaleDateString("en-CA"),
      daysRented: r.daysRented,
      returnDate: r.returnDate
        ? r.returnDate.toLocaleDateString("en-CA")
        : null,
      originalPrice: r.originalPrice,
      delayFee: r.delayFee,
      customer: { id: r.customerId, name: r.customer_name },
      game: { id: r.gameId, name: r.game_name },
    }));

    res.send(rentalsList);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function addRental(req, res) {
  const { customerId, gameId, daysRented } = req.body;
  try {
    const customer = await db.query(`SELECT * FROM customers WHERE id=$1;`, [
      customerId,
    ]);
    const game = await db.query(`SELECT * FROM games WHERE id=$1;`, [gameId]);
    const gameRentals = await db.query(
      `SELECT * FROM rentals WHERE "gameId"=$1 AND "returnDate" IS NULL;`,
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

export async function returnRental(req, res) {
  const id = req.params.id;
  const returnDate = new Date().toLocaleDateString("en-CA");
  const rent = res.locals.rental;
  if (rent.returnDate) return res.sendStatus(400);

  try {
    const game = await db.query(`SELECT * FROM games WHERE id=$1;`, [
      rent.gameId,
    ]);
    if (!game.rowCount) return res.sendStatus(404);

    const dateDiff = Math.abs(new Date(returnDate) - rent.rentDate);
    const daysUsed = Math.round(dateDiff / 86400000);

    let delayFee = null;
    if (daysUsed > rent.daysRented) {
      const daysLate = daysUsed - rent.daysRented;
      const originalPrice = rent.originalPrice / rent.daysRented;
      delayFee = daysLate * originalPrice;
    } else {
      delayFee = 0;
    }
    await db.query(
      `UPDATE 
        rentals 
    SET 
        "returnDate"=$1, 
        "delayFee"=$2 
    WHERE 
        id=$3;`,
      [returnDate, delayFee, id]
    );
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function deleteRental(req, res) {
  const id = req.params.id;
  const rent = res.locals.rental;
  if (!rent.returnDate) return res.sendStatus(400);

  try {
    await db.query(`DELETE FROM rentals WHERE id=$1;`, [id]);

    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
