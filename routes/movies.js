const router = require('express').Router();
const { Movie, validateGenre } = require('../models/movie');
const { Genre } = require('../models/genres');

router.get('/', async (req, res) => {
  const movies = await Movie.find();
  res.send(movies);
});

router.get('/:id', async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.send(`There's no movie with id of ${req.params.id}`);
  res.send(movie);
});

router.post('/', async (req, res) => {
  const errorMessage = validateGenre(req.body);
  if (errorMessage) return res.status(400).send(errorMessage);

  const genres = await Genre.find({
    _id: { $in: [...req.body.genres] }
  }).select('name');

  if (genres.length !== req.body.genres.length)
    return res.status(400).send('One of genres is not valid');

  const movie = new Movie({ ...req.body, genres });
  await movie.save();
  res.send(movie);
});

router.put('/:id', async (req, res) => {
  const errorMessage = validateGenre(req.body);
  if (errorMessage) return res.send(errorMessage);

  const genres = await Genre.find({ _id: { $in: req.body.genres } }).select(
    'name'
  );
  if (genres.length !== req.body.genres.length)
    return res.status(400).send('One of genres is not valid');

  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          ...req.body,
          genres
        }
      },
      { new: true }
    );

    if (!movie)
      return res
        .status(404)
        .send(`There's no movie with id of ${req.params.id}`);

    res.send(movie);
  } catch (error) {
    res
      .status(500)
      .send(
        `There's something happened on the server (${
          error.message
        }). Please try again. `
      );
  }
});

router.delete('/:id', async (req, res) => {
  const deletedMovie = await Movie.findByIdAndDelete(req.params.id);

  if (!deletedMovie)
    return res.send(`There's no movie with id of ${req.params.id}`);
  res.send(deletedMovie);
});

module.exports = router;
