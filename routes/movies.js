const router = require('express').Router();
const { Movie } = require('../models/movie');
const { getGenreById } = require('../models/genres');
const validateMovie = require('../utils/validators/movie');

router.get('/', async (req, res) => {
  const movies = await Movie.find().sort('title');
  res.send(movies);
});

router.get('/:id', async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  res.send(movie);
});

router.post('/', async (req, res) => {
  const errorMessage = validateMovie(req.body);
  if (errorMessage) return res.status(400).send(errorMessage);

  const genre = await getGenreById(req.body.genreId);
  if (!genre)
    return res
      .status(400)
      .send('Invalid ID for genre. No genres with such an ID');

  let movie = new Movie({
    title: req.body.title,
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
    genre: {
      _id: genre._id,
      name: genre.name
    }
  });

  movie = await movie.save();
  res.send(movie);
});

router.delete('/:id', async (req, res) => {
  const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
  if (!deletedMovie)
    return res.status(404).send(`There's no movie with ID of ${req.params.id}`);
  res.send(deletedMovie);
});

router.put('/:id', async (req, res) => {
  const errorMessage = validateMovie(req.body);
  if (errorMessage) return res.status(400).send(errorMessage);

  const genre = await getGenreById(req.body.genreId);
  if (!genre)
    return res.status(400).send('Invalid genre. No genres with such an ID');

  const { title, numberInStock, dailyRentalRate } = req.body;

  const updatedMovie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title,
      genre: {
        _id: genre._id,
        name: genre.name
      },
      numberInStock,
      dailyRentalRate
    },
    { new: true }
  );

  if (!updatedMovie)
    return res.status(404).send(`There's no movie with ID of ${req.params.id}`);

  res.send(updatedMovie);
});

module.exports = router;
