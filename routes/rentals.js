const express = require('express');
const router = express.Router();
const { Rental, validateRental } = require('../models/rental');
const { Movie } = require('../models/movie');
const { Customer } = require('../models/customer');

router.get('/', async (req, res) => {
  const rentals = await Movie.find().sort('-dateOut');
  res.json({ status: 'success', data: { rentals } });
});

router.post('/', async (req, res) => {
  const { error } = validateRental(req.body);
  if (error) return res.status(400).json({ status: 'fail', error: error.details[0].message });
  const { customerId, movieId } = req.body;
  const customer = await Customer.findById({ _id: customerId });
  if (!customer) return res.status(400).json({ status: 'fail', message: 'Invalid customerId' });

  const movie = await Movie.findById({ _id: movieId });
  if (!movie) return res.status(400).json({ status: 'fail', message: 'Invalid movieId' });

  if (movie.numberInStock === 0)
    return res.status(400).json({ status: 'fail', message: 'Movie not in stock' });

  let rental = new Rental({
    customer: {
      _id: customer.id,
      name: customer.name,
      phone: customer.phone
    },
    movie: {
      _id: movie.id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });
  // Implement Transaction
  //Ops1
  rental = await rental.save();

  //Ops2
  movie.numberInStock--;
  await movie.save();

  res.status(201).json({
    status: 'success',
    message: 'A new rental created',
    data: { rental }
  });
});

router.get('/:id', async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  if (!rental) return res.status(404).json({ status: 'fail', message: 'Rental with id not found' });
  res.json({ status: 'success', data: { rental } });
});

router.patch('/:id', async (req, res) => {
  const { error } = validateRental(req.body);
  if (error) return res.status(400).json({ status: 'fail', error: error.details[0].message });
  const rental = await Rental.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!rental) return res.status(404).json({ status: 'fail', message: 'Rental with id not found' });
  res.json({ status: 'scuccess', data: { rental } });
});

router.delete('/:id', async (req, res) => {
  const rental = await Rental.findByIdAndDelete(req.params.id);
  if (!rental) return res.status(404).json({ status: 'fail', message: 'Rental with id not found' });
  res.json({ status: 'success', data: { rental } });
});

module.exports = router;
