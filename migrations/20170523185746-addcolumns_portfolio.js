'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
   return queryInterface.addColumn('portfolios','technology',{
    type: Sequelize.TEXT,
    defaultValue: 'express'
   })
  },

  down: function (queryInterface, Sequelize) {
   return queryInterface.removeColumn('portfolios','technology')


  }
};
