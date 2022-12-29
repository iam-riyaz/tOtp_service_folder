import { Segments, celebrate, Joi } from "celebrate";

const mobileValidator = Joi.string()
  .length(10)
  .pattern(/\d{10}$/);

export const emailAndPhone = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    phone: mobileValidator.required(),
  }),
});
