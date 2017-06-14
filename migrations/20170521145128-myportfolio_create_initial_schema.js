'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable('portfolios', {
     id: {
       type:          Sequelize.INTEGER,
       primaryKey:    true,
       autoIncrement: true
     },
     title:     Sequelize.STRING,
     body:      Sequelize.TEXT,
     imageFilename:  Sequelize.STRING,
     createdAt: Sequelize.DATE,
     updatedAt: Sequelize.DATE
    });
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.dropTable('portfolios');
  }
};
