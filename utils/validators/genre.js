const Joi = require('joi');

const schema = {
  name: Joi.string()
    .min(3)
    .max(50)
    .required()
};

module.exports = course => {
  const { error } = Joi.validate(course, schema);

  return (error && error.details[0].message) || null;
};
