const logger = require('./logger');
const raven = require('./raven');
const Server = require('./server');

// Start the server
process.on('uncaughtException', err => {
  raven.captureException(err);
  logger.fatal(err);
  setTimeout(() => {
    process.exit(1);
  }, 1000);
});

Server.then(server =>
  server.start().then(() => logger.info('Server running at:', server.info.uri))
).catch(err => logger.error(err) || process.exit(1));
