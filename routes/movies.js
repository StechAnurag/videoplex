const express = require('express');
const router = express.Router();
const { Movie, validateMovie } = require('../models/movie');
const { Genre } = require('../models/genre');
const { authCheck, checkRole } = require('./../middlewares/auth');
const validateObjectId = require('./../middlewares/validateObjectId');

router.get('/', async (req, res) => {
  const movies = await Movie.find().sort('title');
  res.json({ status: 'success', data: { movies } });
});

router.post('/', [authCheck, checkRole], async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) return res.status(400).json({ status: 'fail', error: error.details[0].message });
  const { title, genreId, numberInStock, dailyRentalRate } = req.body;
  const genre = await Genre.findById({ _id: genreId });
  if (!genre) return res.status(400).json({ status: 'fail', message: 'Invalid genre' });
  const movie = await Movie.create({
    title,
    genre: { _id: genre.id, name: genre.name },
    numberInStock,
    dailyRentalRate
  });
  res.status(201).json({
    status: 'success',
    message: 'Movie created',
    data: { movie }
  });
});

router.get('/:id', validateObjectId, async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(404).json({ status: 'fail', message: 'Movie with id not found' });
  res.json({ status: 'success', data: { movie } });
});

router.patch('/:id', validateObjectId, [authCheck, checkRole], async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) return res.status(400).json({ status: 'fail', error: error.details[0].message });
  const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!Movie) return res.status(404).json({ status: 'fail', message: 'Movie with id not found' });
  res.json({ status: 'scuccess', data: { Movie } });
});

router.delete('/:id', validateObjectId, [authCheck, checkRole], async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);
  if (!movie) return res.status(404).json({ status: 'fail', message: 'Movie with id not found' });
  res.json({ status: 'success', data: { movie } });
});

module.exports = router;
