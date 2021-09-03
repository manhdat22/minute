'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addIndex('subs', ['slug'])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('subs', ['slug'])
  },
}
