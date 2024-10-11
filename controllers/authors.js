const router = require('express').Router();
const { Blog } = require('../models'); 
const sequelize = require('sequelize');

router.get('/', async (req, res, next) => {
  try {
    const authors = await Blog.findAll({
      group: 'author',
      attributes: [
        'author',
        [sequelize.fn('COUNT', sequelize.col('id')), 'articles'],
        [sequelize.fn('SUM', sequelize.col('likes')), 'likes']
      ],
      order: [['likes', 'DESC']]
    });
    return res.json(authors);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
