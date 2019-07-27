const Joi = require('joi');
const mongoose = require('mongoose');

const joiSchema = {
  customerId: Joi.objectId().required(),
  movieId: Joi.objectId().required(),
  rentalFee: Joi.number()
    .min(0)
    .max(1000)
    .required()
};

const validateRental = rental => {
  const { error } = Joi.validate(rental, joiSchema);
  return error && error.details[0].message;
};

const Rental = mongoose.model(
  'Rental',
  new mongoose.Schema({
    customer: { type: mongoose.SchemaTypes.ObjectId, ref: 'Customer' },
    movie: {
      type: new mongoose.Schema({
        title: {
          type: String,
          required: true,
          minlength: 1,
          maxlength: 255,
          trim: true
        },
        dailyRentalRate: {
          type: Number,
          required: true,
          min: 0,
          max: 1000000,
          set: value => Math.round(value)
        }
      }),
      required: true
    },
    rentalFee: {
      type: Number,
      min: 0,
      max: 1000,
      set: value => Number(value.toFixed(2)),
      required: true
    },
    dateOut: { type: Date, default: Date.now },
    dateReturned: { type: Date }
  })
);

module.exports = {
  validateRental,
  Rental
};
