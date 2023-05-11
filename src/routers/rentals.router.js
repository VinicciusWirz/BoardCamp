import { Router } from "express";
import { addRental, getRentals } from "../controllers/rentals.controller.js";
import schemaValidation from "../middlewares/schemaValidation.middleware.js";
import { rentalSchema } from "../schemas/rental.schema.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post("/rentals", schemaValidation(rentalSchema), addRental);

export default rentalsRouter;
