const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30,
    lowercase: true
  }
});

const Genre = mongoose.model('Genre', genreSchema);

const getGenres = async () => {
  const genres = await Genre.find().sort('name');
  return genres;
};

const getGenreById = async id => {
  const genre = await Genre.findById(id);
  return genre;
};

const saveGenre = async genre => {
  const newGenre = new Genre(genre);
  const savedGenre = await newGenre.save();
  return savedGenre;
};

const updateGenre = async (id, genre) => {
  const updatedGenre = await Genre.findByIdAndUpdate(
    id,
    {
      $set: genre
    },
    { new: true }
  );

  return updatedGenre;
};

const deleteGenre = async id => {
  const genre = await Genre.findByIdAndDelete(id);
  return genre;
};

module.exports = {
  Genre,
  genreSchema,
  saveGenre,
  getGenres,
  getGenreById,
  updateGenre,
  deleteGenre
};
