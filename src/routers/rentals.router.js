import { Router } from "express";
import { addRental, getRentals } from "../controllers/rentals.controller.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post("/rentals", addRental);

export default rentalsRouter;
