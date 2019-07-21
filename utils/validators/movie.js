const Joi = require('joi');

const schema = {
  title: Joi.string()
    .min(1)
    .max(50)
    .required(),
  numberInStock: Joi.number()
    .min(0)
    .required(),
  dailyRentalRate: Joi.number()
    .min(0)
    .required(),
  genreId: Joi.string().required()
};

module.exports = movie => {
  const { error } = Joi.validate(movie, schema);
  return error && error.details[0].message;
};
