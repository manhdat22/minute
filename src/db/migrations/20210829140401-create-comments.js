'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.createTable(
        'comments',
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          content: {
            allowNull: false,
            type: Sequelize.TEXT,
          },
          userId: {
            allowNull: false,
            type: Sequelize.INTEGER,
          },
          postId: {
            allowNull: false,
            type: Sequelize.INTEGER,
          },
          parentId: {
            type: Sequelize.INTEGER,
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
        },
        { transaction },
      )
      await queryInterface.addIndex('comments', ['userId'], { transaction })
      await queryInterface.addIndex('comments', ['postId'], { transaction })
      await queryInterface.addIndex('comments', ['parentId'], { transaction })

      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('comments')
  },
}
