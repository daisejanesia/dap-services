const _ = require('lodash');
const path = require('path');
const settings = require('./settings');
const { logger } = require('@trax/node-core-services');
const { name } = require('../package.json');

const { environment } = settings;

module.exports = logger({
  name: _.get(settings, 'logger.name', _.kebabCase(`${name}-${environment}`)),
  level: _.get(settings, 'logger.level', 'debug'),
  environment,
  basePath: path.dirname(__dirname)
});
