const router = require('express').Router();
const { Blog } = require('../models');
const { User } = require('../models');
const { Op } = require('sequelize');
const {tokenExtractor} = require('../utils/middleware')


// Middleware to find blog by ID
const blogFinder = async (req, _res, next) => {
  try {
    req.blog = await Blog.findByPk(req.params.id);
    if (!req.blog) {
      const error = new Error('Blog not found');
      error.status = 404;
      next(error);
    }
    next();
  } catch (error) {
    next(error);
  }
};

// GET all blogs - with search, ordered by likes(desc)
router.get('/', async (req, res, next) => {
  try {
    let where = {};
    if (req.query.search) {
      where = {
        [Op.or]: [
          {
            title: { [Op.substring]: req.query.search },
          },
          {
            author: { [Op.substring]: req.query.search },
          },
        ],
      };
    }
    const blogs = await Blog.findAll({
      order: [['likes', 'DESC']],
      where,
    });
    res.json(blogs);
  } catch (error) {
    next(error);
  }
});

// POST create a new blog
router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id);
    const blog = await Blog.create({ ...req.body, userId: user.dataValues.id });
    if (blog) {
      return res.json(blog);
    }
  } catch (error) {
    next(error);
  }
});

// GET blog by ID
router.get('/:id', blogFinder, async (req, res, next) => {
  try {
    return res.json(req.blog);
  } catch (error) {
    next(error);
  }
});

// DELETE blog by ID
router.delete('/:id', blogFinder, tokenExtractor, async (req, res, next) => {
  try {
    if (!req.decodedToken) {
      console.error('no user');
      return res.status(401);
    }
    if (!req.blog) {
      console.error('blog not found');
      return res.status(404).json({ error: 'Blog not found' }).end();
    }
    const user = await User.findByPk(req.decodedToken.id);
    if (!(user.dataValues.id === req.blog.dataValues.userId)) {
      console.error('not your blog, cant delete');
      return res.status(401).end();
    }
    await req.blog.destroy();
    return res.status(204).end();
  } catch (error) {
    next(error);
  }
});

// PUT update blog likes by ID
router.put('/:id', blogFinder, async (req, res, next) => {
  try {
    if (req.blog) {
      req.blog.likes += 1;
      await req.blog.save();
      res.json(req.blog);
    } else {
      return res.status(404).json({ error: 'Blog not found' });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
