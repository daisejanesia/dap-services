module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('user_preferences', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
      },
      email: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      actor: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: 'userPrefIndex'
      },
      context: {
        type: Sequelize.TEXT,
        unique: 'userPrefIndex',
        allowNull: false
      },
      usecase: {
        type: Sequelize.TEXT,
        unique: 'userPrefIndex',
        allowNull: false
      },
      instance: {
        unique: 'userPrefIndex',
        type: Sequelize.TEXT
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT
      },
      data: {
        type: Sequelize.TEXT,
        allowNull: false
      }
    }),
  down: queryInterface => queryInterface.dropTable('user_preferences')
};
