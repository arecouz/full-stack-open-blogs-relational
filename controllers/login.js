const { User } = require('../models');
const router = require('express').Router();
const { SECRET } = require('../utils/configs');
const jwt = require('jsonwebtoken');

router.post('/', async (req, res) => {
  const user = await User.findOne({
    where: { username: req.body.username },
  });
  const passwordCorrect = req.body.password === 'secret';

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid username or password',
    });
  }

  const userForToken = { username: user.username, id: user.id };
  const token = jwt.sign(userForToken, SECRET);

  res.status(200).json({token, user})
});

module.exports = router;
