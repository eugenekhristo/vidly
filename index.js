require('colors');
const path = require('path');
const express = require('express');
const config = require('config');
const validateGenre = require('./utils/validators/genre');

const app = express();

app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));

console.log(config.get('name'));
console.log(config.get('password'));
console.log(config.get('email.name'));

// console.log(app.get('env'));
// console.log(process.env.NODE_ENV);

let genres = [
  { id: 1, name: 'Horror' },
  { id: 2, name: 'Comedy' },
  { id: 3, name: 'Drama' }
];

app.get('/api/genres', (req, res) => {
  res.send(genres);
});

app.post('/api/genres', (req, res) => {
  const errorMessage = validateGenre(req.body);
  if (errorMessage) return res.status(400).send(errorMessage);

  const newGenre = { id: genres.length + 1, ...req.body };
  genres.push(newGenre);
  res.send(newGenre);
});

app.put('/api/genres/:id', (req, res) => {
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

app.delete('/api/genres/:id', (req, res) => {
  const genreId = parseInt(req.params.id);

  const genreToDelete = genres.find(genre => genre.id === genreId);
  if (!genreToDelete)
    return res.status(404).send(`There's no genre with id of ${genreId}`);

  genres = genres.filter(genre => genre.id !== genreId);
  res.send(genreToDelete);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server is running on PORT ${PORT}...`.cyan)
);
