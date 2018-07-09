/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
/* eslint no-console: "off" */

process.env.NODE_ENV = 'test';
const moment = require('moment');
const Server = require('../src/server');
require('colors');

if (process.argv.includes('--external')) {
  process.env.SHOW_EXTERNAL = 'false';
}

const log = message =>
  console.log(
    `[${moment().format('YY-MM-DD HH:mm:ss')}][SETUP]`.white,
    message.cyan
  );

process.on('unhandledRejection', reason => {
  console.log(`Reason:`, reason);
});

let server = null;

before(async function before() {
  this.timeout(30000);
  server = await Server;
  log('Starting Server');
  await server.start();
});

after(function after() {
  this.timeout(30000);
  return server.stop();
});

// require('./suid_spec_helper');
