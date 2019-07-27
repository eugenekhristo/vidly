const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const joiSchema = {
  name: Joi.string()
    .min(2)
    .max(255)
    .required(),
  email: Joi.string()
    .min(5)
    .max(255)
    .email()
    .required(),
  password: Joi.string()
    .min(5)
    .max(25)
    .required()
};

const validateUser = user => {
  const { error } = Joi.validate(user, joiSchema);
  return error && error.details[0].message;
};

const mongooseSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 255,
    required: true,
    trim: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    validate: {
      validator: value => {
        value = value.toLowerCase().trim();
        return value.match(
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i
        );
      },
      message: 'Email is not correct format. Please try again'
    },
    unique: true,
    required: true
  },
  password: {
    type: String,
    minlength: 2,
    maxlength: 1024,
    required: true
  }
});

mongooseSchema.methods.generateAuthToken = function() {
  return jwt.sign({ _id: this._id }, config.get('secretKeyJwt'));
};

const User = mongoose.model('User', mongooseSchema);

module.exports = { validateUser, User };
