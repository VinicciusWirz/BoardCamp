import Joi from "joi";

export const gameSchema = Joi.object({
  name: Joi.string().required(),
  image: Joi.string(),
  stockTotal: Joi.number().integer().min(1).required(),
  pricePerDay: Joi.number().integer().min(1).required(),
});
