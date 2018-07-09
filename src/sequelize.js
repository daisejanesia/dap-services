const Sequelize = require('sequelize');
const logger = require('./logger');
const {
  sequelize: { database, options, password, username }
} = require('./settings');

options.logging = logger.debug.bind(logger);

const sequelizeMS = new Sequelize(database, username, password, options);

module.exports = sequelizeMS;
