require('colors');
require('express-async-errors');
const express = require('express');
const mongoose = require('mongoose');
const winston = require('winston');
require('winston-mongodb');
const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const app = express();
require('./startup/routes')(app);

winston.exceptions.handle(
  new winston.transports.File({
    filename: 'exceptions.log',
    exitOnError: true
  })
);

process.on('unhandledRejection', error => {
  throw error;
});

winston.add(new winston.transports.File({ filename: 'loginfo.log' }));
winston.add(
  new winston.transports.MongoDB({
    db: 'mongodb://localhost/vidly',
    level: 'error'
  })
);

if (!config.get('secretKeyJwt')) {
  console.error(`Environment variable for 'secretKeyJwt' is not set!`);
  process.exit(1);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server is running on PORT ${PORT}...`.cyan)
);

mongoose
  .connect(config.get('db.url'), {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => console.log(`Connected to MongoDB server...`.yellow));
