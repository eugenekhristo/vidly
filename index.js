require('colors');
const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const genresRouter = require('./routes/genres');
const customersRouter = require('./routes/customers');
const moviesRouter = require('./routes/movies');
const rentalsRouter = require('./routes/rentals');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');

if(!config.get('secretKeyJwt')) {
  console.error(`Environment variable for 'secretKeyJwt' is not set!`);
  process.exit(1);
}

const app = express();

app.use(express.json());
app.use('/api/genres', genresRouter);
app.use('/api/customers', customersRouter);
app.use('/api/movies', moviesRouter);
app.use('/api/rentals', rentalsRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server is running on PORT ${PORT}...`.cyan)
);

mongoose
  .connect(config.get('db.url'), { useNewUrlParser: true })
  .then(() => console.log(`Connected to MongoDB server...`.yellow))
  .catch(err =>
    console.log(`Error happened while connecting to MongoDB server:`.red, err)
  );
