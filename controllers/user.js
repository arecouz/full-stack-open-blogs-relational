const router = require('express').Router();
const { User } = require('../models');
const {Blog} = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] },
    },
  });
  res.json(users);
});

router.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.put('/:username', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { username: req.params.username },
    });
    if (user) {
      user.username = req.body.newUsername;
      await user.save();
      res.status(200).json(user);
    } else {
      res.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});

router.delete('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (user) {
    await User.destroy({ where: { id: req.params.id } });
    return res.status(204).end();
  } else {
    res.status(404).end();
  }
});

module.exports = router;
