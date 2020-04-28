const express = require('express');
const router = express.Router();
const { Genre, validateGenre } = require('../models/genre');
const { authCheck, checkRole } = require('./../middlewares/auth');
const validateObjectId = require('./../middlewares/validateObjectId');

router.get('/', async (req, res) => {
  const genres = await Genre.find().sort('name');
  res.json({ status: 'success', data: { genres } });
});

router.post('/', authCheck, async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).json({ status: 'fail', error: error.details[0].message });
  const genre = await Genre.create({ name: req.body.name });
  res.status(201).json({
    status: 'success',
    message: 'Genre created',
    data: { genre }
  });
});

router.get('/:id', validateObjectId, async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) return res.status(404).json({ status: 'fail', message: 'Genre with id not found' });
  res.json({ status: 'success', data: { genre } });
});

router.patch('/:id', validateObjectId, authCheck, checkRole, async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).json({ status: 'fail', error: error.details[0].message });
  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );
  if (!genre) return res.status(404).json({ status: 'fail', message: 'Genre with id not found' });
  res.json({ status: 'scuccess', data: { genre } });
});

router.delete('/:id', validateObjectId, authCheck, checkRole, async (req, res) => {
  const genre = await Genre.findByIdAndDelete(req.params.id);
  if (!genre) return res.status(404).json({ status: 'fail', message: 'Genre with id not found' });
  res.json({ status: 'success', data: { genre } });
});

module.exports = router;
