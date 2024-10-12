const { User } = require('../models');
const { Session } = require('../models');
const router = require('express').Router();
const { SECRET } = require('../utils/configs');
const jwt = require('jsonwebtoken');
const { tokenExtractor } = require('../utils/middleware');

const getExpirationDate = (hours = 24) => {
  const now = new Date();
  return new Date(now.getTime() + hours * 60 * 60 * 1000);
};

router.post('/', async (req, res) => {
  const user = await User.findOne({
    where: { username: req.body.username },
  });
  const passwordCorrect = req.body.password === 'secret';

  if (user.disabled) {
    return res.status(401).json({ error: 'user has been disabled' });
  }

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid username or password',
    });
  }

  const userForToken = { username: user.username, id: user.id };
  const token = jwt.sign(userForToken, SECRET);
  const expiresAt = getExpirationDate(24);

  await Session.create({
    userId: user.id,
    token,
    expiresAt,
  });

  res.status(200).json({ token, user });
});

router.delete('/', tokenExtractor, async (req, res, next) => {
  try {
    console.log(req.decodedToken);
    const session = await Session.findByPk(req.decodedToken.id);
    await session.destroy()
    res.status(200).end()
  } catch (error) {
    next(error);
  }
});

module.exports = router;
