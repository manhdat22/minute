'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.createTable(
        'posts',
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          title: {
            allowNull: false,
            type: Sequelize.STRING,
          },
          slug: {
            allowNull: false,
            type: Sequelize.STRING,
          },
          content: {
            allowNull: false,
            type: Sequelize.TEXT,
          },
          authorId: {
            allowNull: false,
            type: Sequelize.INTEGER,
          },
          subId: {
            allowNull: false,
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
      await queryInterface.addIndex('posts', ['slug'], { transaction })
      await queryInterface.addIndex('posts', ['authorId'], { transaction })
      await queryInterface.addIndex('posts', ['subId'], { transaction })

      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('posts')
  },
}
