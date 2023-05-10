import { Router } from "express";
import costumersRouter from "./costumers.router.js";
import gamesRouter from "./games.router.js";
import rentalsRouter from "./rentals.router.js";

const router = Router();
router.use(costumersRouter);
router.use(gamesRouter);
router.use(rentalsRouter);

export default router;
