const { SECRET } = require('../utils/configs');
const jwt = require('jsonwebtoken');

const logger = (req, _res, next) => {
  console.log(`request: ${req.method} ${req.originalUrl}`);
  next();
};

const tokenExtractor = async (req, res, next) => {
  console.log('extracting token');
  try {
    const auth = req.get('authorization');
    console.log(auth);
    if (!(auth && auth.startsWith('Bearer'))) {
      console.error('not authorized');
      console.log(auth);
      return res.status(401).end();
    }
    req.decodedToken = jwt.verify(auth.split(' ')[1], SECRET);
    console.log(req.decodedToken);
    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({
      error: error.errors.map((err) => err.message),
    });
  }
  if (error.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      error: error.message,
    });
  }
  next(error);
};

module.exports = { logger, tokenExtractor, errorHandler };
