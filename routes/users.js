const _ = require('lodash');
const bcrypt = require('bcrypt');
const router = require('express').Router();
const { User, validateUser } = require('../models/user');

router.post('/', async (req, res) => {
  const errorMessage = validateUser(req.body);
  if (errorMessage) return res.status(400).send(errorMessage);

  const foundUser = await User.findOne({ email: req.body.email });
  if (foundUser)
    return res.status(400).send('User with a given email already exists');

  try {
    const user = new User(req.body);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;

    await user.save();
    const token = user.generateAuthToken();
    res
      .header('x-auth-token', token)
      .send(_.pick(user, ['_id', 'name', 'email']));
  } catch (error) {
    res.status(500).send('Error happened while creating new user: ' + error);
  }
});

module.exports = router;
