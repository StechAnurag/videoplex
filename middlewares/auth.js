const jwt = require('jsonwebtoken');
const config = require('config');
const { User } = require('./../models/user');

async function authCheck(req, res, next) {
  const token = req.header('x-auth-token');
  if (!token)
    return res.status(401).json({ status: 'fail', message: 'Unauthorized: Access denied' });

  try {
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    // const user = await User.findById(decoded.id);
    // if (!user) {
    //   return res
    //     .status(401)
    //     .json({ status: 'fail', message: 'User belonging to the token, does not exist' });
    // }
    req.user = decoded.id;
    next();
  } catch (ex) {
    res.status(400).json({ status: 'fail', message: 'Invalid AuthToken' });
  }
}

function checkRole(req, res, next) {
  if (!req.user.isAdmin)
    return res.status(403).json({ status: 'fail', message: 'Forbidden: Access denied' });

  next();
}

module.exports.authCheck = authCheck;
module.exports.checkRole = checkRole;
