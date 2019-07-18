const router = require('express').Router();
const validateGenre = require('../utils/validators/genre');

let genres = [
  { id: 1, name: 'Horror' },
  { id: 2, name: 'Comedy' },
  { id: 3, name: 'Drama' }
];

router.get('/', (req, res) => {
  res.send(genres);
});

router.post('/', (req, res) => {
  const errorMessage = validateGenre(req.body);
  if (errorMessage) return res.status(400).send(errorMessage);

  const newGenre = { id: genres.length + 1, ...req.body };
  genres.push(newGenre);
  res.send(newGenre);
});

router.put('/:id', (req, res) => {
  const errorMessage = validateGenre(req.body);
  if (errorMessage) return res.status(400).send(errorMessage);

  const genreId = parseInt(req.params.id);
  const genreToUpdate = genres.find(genre => genre.id === genreId);
  if (!genreToUpdate)
    return res.status(404).send(`There's no genre with id of ${genreId}`);

  genres = genres.map(genre =>
    genre.id === genreId ? { ...genre, ...req.body } : genre
  );
  const updatedGenre = genres.find(genre => genre.id === genreId);
  res.send(updatedGenre);
});

router.delete('/:id', (req, res) => {
  const genreId = parseInt(req.params.id);

  const genreToDelete = genres.find(genre => genre.id === genreId);
  if (!genreToDelete)
    return res.status(404).send(`There's no genre with id of ${genreId}`);

  genres = genres.filter(genre => genre.id !== genreId);
  res.send(genreToDelete);
});

module.exports = router;
