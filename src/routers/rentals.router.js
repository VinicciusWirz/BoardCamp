import { Router } from "express";
import {
  addRental,
  returnRental,
  getRentals,
  deleteRental,
} from "../controllers/rentals.controller.js";
import schemaValidation from "../middlewares/schemaValidation.middleware.js";
import { rentalSchema } from "../schemas/rental.schema.js";
import { rentalValidId } from "../middlewares/rentalValidId.middleware.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post("/rentals", schemaValidation(rentalSchema), addRental);
rentalsRouter.post("/rentals/:id/return", rentalValidId, returnRental);
rentalsRouter.delete("/rentals/:id", rentalValidId, deleteRental);

export default rentalsRouter;
