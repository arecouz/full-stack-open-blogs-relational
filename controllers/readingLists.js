const router = require('express').Router();
const User = require('../models/user');
const UserBlogs = require('../models/UserBlogs');
const { tokenExtractor } = require('../utils/middleware');

router.get('/', async (req, res) => {
  res.json({ msg: 'hello' });
});

// Helper function to check authorization
const checkAuthorization = (x, y) => {
  if (x !== y) {
    const error = new Error('User is not authorized to perform this action');
    error.status = 403;
    throw error;  // Throw the error, so it can be caught in the catch block
  }
};

router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id);
    checkAuthorization(user.id, req.body.userId)

    // Add blog to users reading list
    const entry = await UserBlogs.create(req.body);
    res.status(200).json(entry);
  } catch (error) {
    next(error);
  }
});

// Mark as read
router.put('/:id', tokenExtractor, async (req, res, next) => {
  try {
    const userBlogs = await UserBlogs.findByPk(req.params.id);
    if (userBlogs) {
      const user = await User.findByPk(req.decodedToken.id);
      checkAuthorization(user.id, userBlogs.dataValues.userId)

      // Update read status
      userBlogs.read = req.body.read;
      await userBlogs.save();
      res.status(200).json(userBlogs);
    } else {
      res.status(400).json({ error: 'user not found' });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
