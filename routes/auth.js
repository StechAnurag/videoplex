const express = require('express');
const bcrypt = require('bcrypt');
const Joi = require('@hapi/joi');
const router = express.Router();
const { User } = require('../models/user');

router.post('/', async (req, res) => {
  const { error } = validateInput(req.body);
  if (error) return res.status(400).json({ status: 'fail', message: error.details[0].message });

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({ status: 'fail', message: 'Invalid email or password' });

  if (!(await bcrypt.compare(req.body.password, user.password)))
    return res.status(400).json({ status: 'fail', message: 'Invalid email or password' });

  const token = user.generateToken();

  res.header('x-auth-token', token).json({
    status: 'success',
    message: 'Login successful',
    data: {
      user: {
        name: user.name
      }
    }
  });
});

function validateInput(user) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).email().required(),
    password: Joi.string().min(5).max(255).required()
  });
  return schema.validate(user);
}

module.exports = router;
