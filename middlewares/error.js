module.exports = (err, req, res, next) => {
  // Log the exception
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong'
  });
};
