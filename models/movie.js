const mongoose = require('mongoose');
const Joi = require('joi');
const { genreSchema } = require('../models/genres');

const Movie = mongoose.model(
  'Movie',
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 255,
      trim: true
    },
    numberInStock: {
      type: Number,
      required: true,
      min: 0,
      max: 1000000
    },
    dailyRentalRate: {
      type: Number,
      required: true,
      min: 0,
      max: 1000000
    },
    genres: { type: [genreSchema], required: true }
  })
);

const joiSchema = {
  title: Joi.string()
    .min(1)
    .max(255)
    .required(),
  numberInStock: Joi.number()
    .min(0)
    .max(1000000)
    .required(),
  dailyRentalRate: Joi.number()
    .min(0)
    .max(1000000)
    .required(),
  genres: Joi.array().items(Joi.objectId().required())
};

const validateGenre = genre => {
  const { error } = Joi.validate(genre, joiSchema);
  return error && error.details[0].message;
};

module.exports = {
  Movie,
  validateGenre
};
