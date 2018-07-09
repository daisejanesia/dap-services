const Sequelize = require('sequelize');
const sequelize = require('../src/sequelize');

const db = {
  EInvoicePermissions: require('../src/permissions/model')
};

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
