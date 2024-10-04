const logger = (req, _res, next) => {
  console.log(`request: ${req.method} ${req.originalUrl}`);
  next();
};

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({
      error: error.errors.map((err) => err.message),
    });
  }

  next(error);
};

module.exports = { logger, errorHandler };
