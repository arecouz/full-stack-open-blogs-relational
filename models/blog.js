const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');

class Blog extends Model {}
Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author: {
      type: DataTypes.STRING,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    year: {
      type: DataTypes.INTEGER,
      validate: {
        len: [4, 4],
        min: 0,
        max: new Date().getFullYear(),
      },
    },
  },
  {
    sequelize,
    underscored: true, // table names are derived from model names as plural snake case versions
    timestamps: true,
    modelName: 'blog',
  }
);

module.exports = Blog;
