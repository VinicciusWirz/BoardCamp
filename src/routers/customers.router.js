import { Router } from "express";
import { getCustomers } from "../controllers/customers.controller.js";

const customersRouter = Router();

customersRouter.get("/customers/:id", getCustomers);

export default customersRouter;
