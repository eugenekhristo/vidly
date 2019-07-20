const Joi = require('Joi');

const schema = {
  name: Joi.string()
    .min(2)
    .max(30)
    .required(),
  phone: Joi.string()
    .min(5)
    .max(30)
    .required(),
  isGold: Joi.boolean().required()
};

module.exports = customer => {
  const { error } = Joi.validate(customer, schema);
  return error && error.details[0].message;
};
