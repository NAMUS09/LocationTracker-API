import Joi from "joi";

export function validateLocation(body) {
  const schema = Joi.object({
    altitude: Joi.number().allow(null),
    accuracy: Joi.number().allow(null),
    altitudeAccuracy: Joi.number().allow(null),
    heading: Joi.number().allow(null),
    speed: Joi.number().allow(null),
    longitude: Joi.number().required(),
    latitude: Joi.number().required(),
  });
  return schema.validate(body);
}
