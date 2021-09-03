'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.addColumn('users', 'avatarId', {
        type: Sequelize.INTEGER,
      })
      await queryInterface.addColumn('subs', 'iconId', {
        type: Sequelize.INTEGER,
      })
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'avatarId')
    await queryInterface.removeColumn('subs', 'iconId')
  },
}
