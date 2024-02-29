import Joi from "joi";

export function validateLocation(body) {
  const schema = Joi.object({
    longitude: Joi.string().required(),
    latitude: Joi.string().required(),
  });
  return schema.validate(body);
}
