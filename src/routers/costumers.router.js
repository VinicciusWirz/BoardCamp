import { Router } from "express";
import { getCostumers } from "../controllers/costumers.controller.js";

const costumersRouter = Router();

costumersRouter.get("/costumers", getCostumers);

export default costumersRouter;
