/* eslint import/no-dynamic-require: "off" */
const {
  server: {
    setup,
    globRoutes,
    plugins: { swagger, jwtAuth, bunyan, raven }
  }
} = require('@trax/node-core-services');
const settings = require('./settings');
const pack = require('../package');
const logger = require('./logger');

require('./sequelize');

global.__base = `${__dirname}/`;

const serviceName = pack.name.replace(/-service(s)?/, '');

const setupServer = async () => {
  // setup server
  const server = await setup({
    port: settings.port
  });
  // setup plugins
  await bunyan(server, logger);
  await jwtAuth(server, {
    key: settings.jwt.secret,
    verifyOptions: {
      algorithms: settings.jwt.algorithms
    }
  });
  await swagger(server, pack, {
    swaggerUIPath: `/${serviceName}/swaggerui/`,
    jsonPath: `/${serviceName}/swagger.json`,
    documentationPath: `/${serviceName}/documentation`
  });
  await raven(server, settings.sentry.dsn, {
    environment: settings.environment,
    release: pack.version
  });
  // Load Routes
  await globRoutes(server, `${__dirname}/**/route.js`, `/${serviceName}`);

  return server;
};

module.exports = setupServer();
