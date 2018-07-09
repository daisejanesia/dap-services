module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface
      .createTable('flow_template', {
        id: {
          type: Sequelize.TEXT,
          allowNull: false,
          primaryKey: true
        },
        name: {
          type: Sequelize.TEXT
        },
        flowType: {
          type: Sequelize.TEXT
        },
        feedType: {
          type: Sequelize.TEXT
        },
        schema: {
          type: Sequelize.TEXT
        }
      })
      .then(() => {
        queryInterface.createTable('flow_config', {
          id: {
            type: Sequelize.TEXT,
            allowNull: false,
            primaryKey: true
          },
          context: {
            type: Sequelize.TEXT,
            allowNull: false
          },
          flowTemplateId: {
            type: Sequelize.TEXT,
            allowNull: true,
            references: { model: 'flow_template', key: 'id' }
          },
          name: {
            type: Sequelize.TEXT,
            allowNull: false,
            primaryKey: true
          },
          status: {
            type: Sequelize.TEXT,
            allowNull: false
          },
          enabled: {
            type: Sequelize.BOOLEAN
          },
          flowType: {
            type: Sequelize.TEXT
          },
          feedType: {
            type: Sequelize.TEXT
          },
          description: {
            type: Sequelize.TEXT
          },
          testConfig: {
            type: Sequelize.TEXT,
            allowNull: false
          },
          prodConfig: {
            type: Sequelize.TEXT,
            allowNull: false
          },
          created_at: {
            type: Sequelize.DATE
          },
          updated_at: {
            type: Sequelize.DATE
          }
        });
      }),
  down: queryInterface => queryInterface.dropTable('flow_config')
};
