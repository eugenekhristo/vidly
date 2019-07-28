const router = require('express').Router();
const mongoose = require('mongoose');
const Fawn = require('fawn');
const { validateRental, Rental } = require('../models/rental');
const { Customer } = require('../models/customers');
const { Movie } = require('../models/movie');
const authMiddleware = require('../middleware/auth');

Fawn.init(mongoose);
const task = Fawn.Task();

router.get('/', async (req, res) => {
  const rentals = await Rental.find()
    .populate('customer', 'name phone isGold')
    .sort('-dateOut');
  return res.send(rentals);
});

router.post('/', authMiddleware, async (req, res) => {
  const errorMessage = validateRental({
    ...req.body,
    rentalFee: +req.body.rentalFee
  });

  if (errorMessage) return res.send(errorMessage);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send('Invalid customer');

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send('Invalid movie');

  if (movie.numberInStock <= 0)
    return res.status(400).send('This movie is not in the stock');

  const rental = new Rental({
    customer: customer._id,
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    },
    rentalFee: +req.body.rentalFee
  });

  try {
    task
      .save('rentals', rental)
      .update('movies', { _id: movie._id }, { $inc: { numberInStock: -1 } })
      .run();

    res.send(rental);
  } catch (error) {
    res.status(500).send('Something failed on the server.');
  }
});

module.exports = router;
