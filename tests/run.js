/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
/* eslint no-console: [0] */

const { spawn } = require('child_process');
const globby = require('globby');
const _ = require('lodash');
const moment = require('moment');
const path = require('path');

require('colors');

const log = (type, message) =>
  console.log(
    `[${moment().format('YY-MM-DD HH:mm:ss')}][${type}]`.white,
    message.cyan
  );

const getFiles = () => {
  const baseSpecs = _
    .chain(['tests/spec-helper.js', 'src/**/*spec.js'])
    .map(_path => globby.sync(path.normalize(`${__dirname}/../${_path}`)))
    .flatten()
    .value();
  return _.uniq([...baseSpecs]);
};

const spawnTests = () =>
  new Promise(resolve => {
    const params = _.compact([
      'NODE_ENV=test',
      './node_modules/.bin/nyc',
      './node_modules/.bin/mocha',
      '--reporter=dot',
      ...getFiles(),
      ...process.argv.slice(2)
    ]);
    const script = spawn('node_modules/.bin/cross-env', params, {
      stdio: 'inherit'
    });

    script.on('close', code => resolve(code));
  });

if (_.get(process.env, 'NODE_ENV', 'development') !== 'test') {
  console.error(
    `[${moment().format('YY-MM-DD HH:mm:ss')}][ERROR]`.red,
    "Environment 'test' is required.".white
  );
  process.exit(1);
}

log('SETUP', 'starting tests');
spawnTests()
  .then(code => process.exit(code))
  .catch(e => {
    console.trace(e);
    log('ERROR', e.message);
    process.exit(1);
  });
