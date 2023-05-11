import { Router } from "express";
import { addCustomer, getCustomers } from "../controllers/customers.controller.js";

const customersRouter = Router();

customersRouter.get("/customers/:id", getCustomers);
customersRouter.post("/customers", addCustomer);

export default customersRouter;
