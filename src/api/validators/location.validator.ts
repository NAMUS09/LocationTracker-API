import Joi from "joi";

export function validateLocation(body: any) {
  const schema = Joi.object({
    longitude: Joi.string().required(),
    latitude: Joi.string().required(),
  });
  return schema.validate(body);
}
