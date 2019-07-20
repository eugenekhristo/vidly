require('colors');
const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const genresRouter = require('./routes/genres');
const customersRouter = require('./routes/customers');

const app = express();

app.use(express.json());
app.use('/api/genres', genresRouter);
app.use('/api/customers', customersRouter);

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
