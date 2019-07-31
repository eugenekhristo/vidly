const router = require('express').Router();
const validateGenre = require('../utils/validators/genre');
const GenreModel = require('../models/genres');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

router.get('/', async (req, res) => {
  throw new Error('Could not connect to MongoDB');
  const genres = await GenreModel.getGenres();
  res.send(genres);
});

router.get('/:id', async (req, res) => {
  const genre = await GenreModel.getGenreById(req.params.id);

  if (!genre)
    return res.status(404).send(`There's no genre with id of ${req.params.id}`);

  res.send(genre);
});

router.post('/', authMiddleware, async (req, res) => {
  const errorMessage = validateGenre(req.body);
  if (errorMessage) return res.status(400).send(errorMessage);

  const savedGenre = await GenreModel.saveGenre(req.body);

  res.send(savedGenre);
});

router.put('/:id', authMiddleware, async (req, res) => {
  const errorMessage = validateGenre(req.body);
  if (errorMessage) return res.status(400).send(errorMessage);

  const updatedGenre = await GenreModel.updateGenre(req.params.id, req.body);
  if (!updatedGenre)
    return res.status(404).send(`There's no genre with id of ${genreId}`);

  res.send(updatedGenre);
});

router.delete('/:id', [authMiddleware, adminMiddleware], async (req, res) => {
  const deletedGenre = await GenreModel.deleteGenre(req.params.id);

  if (!deletedGenre) {
    return res.status(404).send(`There's no genre with id of ${req.params.id}`);
  }

  res.send(deletedGenre);
});

module.exports = router;
