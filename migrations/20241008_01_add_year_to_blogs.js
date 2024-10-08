const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('blogs', 'year', {
      type: DataTypes.INTEGER,
      validate: {
        len: [4, 4],
        min: 0,
        max: new Date().getFullYear(),
      },
    });
  },
  down: async ({ context: queryInterface }) => {
    queryInterface.removeColumn('blogs', 'year');
  },
};
