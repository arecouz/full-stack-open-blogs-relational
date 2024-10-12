const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');

class Session extends Model {}
Session.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
  },
  {
    sequelize,
    underscored: true, // table names are derived from model names as plural snake case versions
    timestamps: false,
    modelName: 'session',
  }
);

module.exports = Session;
