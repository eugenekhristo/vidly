const bcrypt = require('bcrypt');
const Joi = require('joi');
const router = require('express').Router();
const { User } = require('../models/user');

const joiSchema = {
  email: Joi.string()
    .min(5)
    .max(255)
    .email()
    .required(),
  password: Joi.string()
    .min(5)
    .max(255)
    .required()
};

const validateRequest = req => {
  const { error } = Joi.validate(req, joiSchema);
  return error && error.details[0].message;
};

router.post('/', async (req, res) => {
  const errorMessage = validateRequest(req.body);
  if (errorMessage) return res.status(400).send(errorMessage);

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('email or password is not correct');

  const isValidPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!isValidPassword)
    return res.status(400).send('email or password is not correct');

  const token = user.generateAuthToken();
  return res.send(token);
});

module.exports = router;
