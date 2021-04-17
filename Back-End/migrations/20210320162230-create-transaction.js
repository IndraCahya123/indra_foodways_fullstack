'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      partnerId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.STRING
      },
      customerLoc: {
        allowNull: false,
        type: Sequelize.STRING
      },
      restaurantLoc: {
        allowNull: false,
        type: Sequelize.STRING
      },
      total: {
        type: Sequelize.INTEGER,
      },
      currentDate: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Transactions');
  }
};