const Sequelize = require('sequelize');
const sequelize = require('../../src/sequelize');

module.exports = sequelize.define(
  'flow_template',
  {
    id: {
      type: Sequelize.TEXT,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    flowType: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    feedType: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    schema: {
      type: Sequelize.TEXT,
      allowNull: false,
      set(schema) {
        try {
          this.setDataValue('schema', JSON.stringify(schema));
        } catch (e) {
          this.setDataValue('schema', schema);
        }
      },
      get() {
        const value = this.getDataValue('schema');
        try {
          return JSON.parse(value);
        } catch (e) {
          return value;
        }
      }
    }
  },
  {
    tableName: 'flow_template',
    underscored: true,
    timestamps: false
  }
);
