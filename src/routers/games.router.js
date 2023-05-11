import { Router } from "express";
import { addGame, getGames } from "../controllers/games.controller.js";
import { gameSchema } from "../schemas/games.schema.js";
import schemaValidation from "../middlewares/schemaValidation.middleware.js";

const gamesRouter = Router();

gamesRouter.get("/games", getGames);
gamesRouter.post("/games", schemaValidation(gameSchema), addGame);

export default gamesRouter;
