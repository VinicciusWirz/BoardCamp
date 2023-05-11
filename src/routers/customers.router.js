import { Router } from "express";
import { addCustomer, getCustomers } from "../controllers/customers.controller.js";
import schemaValidation from "../middlewares/schemaValidation.middleware.js";
import { customerSchema } from "../schemas/customer.schema.js";

const customersRouter = Router();

customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", getCustomers);
customersRouter.post("/customers", schemaValidation(customerSchema), addCustomer);

export default customersRouter;
