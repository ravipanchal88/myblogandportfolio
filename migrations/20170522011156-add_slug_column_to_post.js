'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
   return queryInterface.addColumn('posts','slug',{
    type: Sequelize.TEXT,
    defaultValue: 'slug'
   })
  },

  down: function (queryInterface, Sequelize) {
   return queryInterface.removeColumn('posts','slug')
  }
};
