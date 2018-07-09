const Sequelize = require('sequelize');

module.exports = {
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
};
