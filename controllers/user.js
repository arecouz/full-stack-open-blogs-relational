const router = require('express').Router();
const { Op } = require('sequelize');
const { User } = require('../models');
const { Blog } = require('../models');

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: Blog,
          attributes: { exclude: ['userId'] },
        },
        {
          model: Blog,
          as: 'markedBlogs',
          attributes: { exclude: ['userId'] },
          through: { attributes: [] },
        },
      ],
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
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

router.get('/:id', async (req, res, next) => {
  try {
    let read = { [Op.in]: [true, false] };
    if (req.query.read) {
      read = req.query.read === 'true';
    }
    const user = await User.findByPk(req.params.id, {
      include: [
        {
          model: Blog,
          attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },
        },
        {
          model: Blog,
          as: 'markedBlogs',
          attributes: {
            exclude: [
              'author',
              'url',
              'likes',
              'year',
              'createdAt',
              'updatedAt',
            ],
          },
          through: { attributes: ['read'], where: { read } },
        },
      ],
    });

    if (!user) {
      res.status(404).json({ error: 'user not found' });
    }

    res.json(user);
  } catch (error) {
    next(error);
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
