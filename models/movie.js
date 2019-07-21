const mongoose = require('mongoose');
const { genreSchema } = require('../models/genres');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 50
  },
  numberInStock: { type: Number, default: 0, min: 0 },
  dailyRentalRate: { type: Number, default: 0, min: 0 },
  genre: { type: genreSchema, required: true }
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = {
  movieSchema,
  Movie
};
