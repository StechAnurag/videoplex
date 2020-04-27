const { User } = require('../../../models/user');
const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

describe('user.generateToken', () => {
  it('should return a valid JWT', () => {
    // const payload = { id: new mongoose.Types.ObjectId().toHexString(), isAdmin: true };
    const payload = { _id: '5ea6aedc707ef93a7d72327f', isAdmin: true };
    const user = new User(payload);
    const token = user.generateToken();
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    expect(decoded).toMatchObject(payload);
  });
});
