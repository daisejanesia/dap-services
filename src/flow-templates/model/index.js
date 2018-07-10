const sequelize = require('../../sequelize');
const attributes = require('./attributes');

module.exports = sequelize.define('flow_template', attributes, {
  tableName: 'flow_template',
  underscored: true,
  timestamps: false
});
