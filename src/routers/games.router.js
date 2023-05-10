import { Router } from "express";
import { getGames } from "../controllers/games.controller.js";

const gamesRouter = Router();

gamesRouter.get("/games", getGames);

export default gamesRouter;
