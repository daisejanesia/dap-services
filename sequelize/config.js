const settings = require('../src/settings');

module.exports = {
  [settings.environment]: {
    username: settings.sequelize.username,
    password: settings.sequelize.password,
    database: settings.sequelize.database,
    host: settings.sequelize.options.host,
    dialect: settings.sequelize.options.dialect
  }
};
