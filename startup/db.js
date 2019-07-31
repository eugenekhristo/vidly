const mongoose = require('mongoose');
const config = require('config');
const winston = require('winston');

module.exports = async () => {
  await mongoose.connect(config.get('db.url'), {
    useNewUrlParser: true,
    useCreateIndex: true
  });

  winston.info(`Connected to MongoDB server...`);
};
