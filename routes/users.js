const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const router = express.Router();
const { User, validateUser } = require('../models/user');
const { authCheck } = require('./../middlewares/auth');

router.get('/me', authCheck, (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: _.pick(req.user, ['name', 'email'])
    }
  });
});

router.post('/', async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).json({ status: 'fail', message: error.details[0].message });

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).json({ status: 'fail', message: 'User already registered.' });

  /* user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  }); */
  user = new User(_.pick(req.body, ['name', 'email', 'password']));
  user.password = await bcrypt.hash(user.password, 10);
  await user.save();

  // select what to return
  user = _.pick(user, ['_id', 'name', 'email']);
  res.json({
    status: 'success',
    message: 'Registration Successful',
    data: {
      user
    }
  });
});

module.exports = router;
