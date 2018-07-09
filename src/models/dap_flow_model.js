const Sequelize = require('sequelize');
const sequelize = require('../../src/sequelize');
const FlowTemplate = require('./dap_flow_template_model');

module.exports = sequelize.define(
  'flow_config',
  {
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
      references: {
        model: FlowTemplate,
        key: 'id'
      }
    },
    name: {
      type: Sequelize.TEXT,
      allowNull: false,
      unique: true
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
      allowNull: false,
      set(testConfig) {
        try {
          this.setDataValue('testConfig', JSON.stringify(testConfig));
        } catch (e) {
          this.setDataValue('testConfig', testConfig);
        }
      },
      get() {
        const value = this.getDataValue('testConfig');
        try {
          return JSON.parse(value);
        } catch (e) {
          return value;
        }
      }
    },
    prodConfig: {
      type: Sequelize.TEXT,
      allowNull: false,
      set(prodConfig) {
        try {
          this.setDataValue('prodConfig', JSON.stringify(prodConfig));
        } catch (e) {
          this.setDataValue('prodConfig', prodConfig);
        }
      },
      get() {
        const value = this.getDataValue('prodConfig');
        try {
          return JSON.parse(value);
        } catch (e) {
          return value;
        }
      }
    }
  },
  {
    tableName: 'flow_config',
    underscored: true,
    timestamps: true
  }
);
