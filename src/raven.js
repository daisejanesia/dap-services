const { raven } = require('@trax/node-core-services');
const settings = require('./settings');
const packageJson = require('../package.json');

const { environment } = settings;

module.exports = raven(settings.sentry.dsn, {
  release: packageJson.version,
  environment
});
