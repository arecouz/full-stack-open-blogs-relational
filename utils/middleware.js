const { SECRET } = require('../utils/configs');
const jwt = require('jsonwebtoken');
const { Session } = require('../models');

const logger = (req, _res, next) => {
  console.log(`request: ${req.method} ${req.originalUrl}`);
  next();
};

const tokenExtractor = async (req, res, next) => {
  // add middleware here for checking if there in the session db
  try {
    const auth = req.get('authorization');
    if (!(auth && auth.startsWith('Bearer'))) {
      console.error('not authorized');
      return res.status(401).end();
    }
    req.decodedToken = jwt.verify(auth.split(' ')[1], SECRET);

    const session = await Session.findOne({
      where: { userId: req.decodedToken.id },
    });
    console.log('!!!!!', session);

    if (!session) {
      return res.status(401).send({ message: 'Invalid token' });
    }

    req.session = session;

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
