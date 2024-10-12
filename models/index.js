const Blog = require('./blog');
const User = require('./user');
const UserBlogs = require('./UserBlogs');
const Session = require('./session')

User.hasMany(Blog);
Blog.belongsTo(User);


// Reading List
User.belongsToMany(Blog, { through: UserBlogs, as: 'markedBlogs' });
Blog.belongsToMany(User, { through: UserBlogs, as: 'usersMarked' });



module.exports = {
  Blog,
  User,
  UserBlogs,
  Session
};
