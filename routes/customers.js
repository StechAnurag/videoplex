const express = require('express');
const router = express.Router();
const { Customer, validateCustomer } = require('./../models/customer');

router.get('/', async (req, res) => {
  const customer = await Customer.find().sort('name');
  res.json({ status: 'success', data: { customer } });
});

router.post('/', async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).json({ status: 'fail', error: error.details[0].message });
  const { name, phone, isGold = false } = req.body;
  const customer = await Customer.create({ name, phone, isGold });
  res.status(201).json({
    status: 'success',
    message: 'Customer created',
    data: { customer }
  });
});

router.get('/:id', async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer)
    return res.status(404).json({ status: 'fail', message: 'Customer with id not found' });
  res.json({ status: 'success', data: { customer } });
});

router.patch('/:id', async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).json({ status: 'fail', error: error.details[0].message });
  const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!Customer)
    return res.status(404).json({ status: 'fail', message: 'Customer with id not found' });
  res.json({ status: 'scuccess', data: { Customer } });
});

router.delete('/:id', async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);
  if (!customer)
    return res.status(404).json({ status: 'fail', message: 'Customer with id not found' });
  res.json({ status: 'success', data: { customer } });
});

module.exports = router;
