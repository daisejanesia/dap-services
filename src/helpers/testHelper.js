/* eslint-disable import/no-extraneous-dependencies */

const sinon = require('sinon');
const rp = require('request-promise');
const path = require('path');
const { sequelizeMockingMocha } = require('sequelize-mocking');
const settings = require('../../../settings');

const apiHelper = require('../../../helpers/test/api-helper');
const isPresent = require('./isPresent');

const logger = require('../../../logger');

logger.level('debug');

module.exports = {
  setup({ fixturesPath, sequelize, context }) {
    // Basic configuration: create a sinon sandbox for testing
    let sandbox;

    beforeEach(() => {
      sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
      if (sandbox) sandbox.restore();
    });

    context.timeout(10000);
    // Load fake data for the flow configs
    sequelizeMockingMocha(
      sequelize,
      path.resolve(path.join(__dirname, fixturesPath)),
      { logging: false }
    );
  },

  requestPromise: (options = {}) => {
    const baseUrl = `http://localhost:${settings.port}`;

    const _request = rp.defaults({
      headers: apiHelper.defaultHeaders(),
      json: true,
      resolveWithFullResponse: true,
      ...options
    });

    return (route, additionalOptions = {}) => {
      if (!isPresent(route)) throw new Error('Please pass in the route path');

      const innerRoute = route.charAt(0) !== '/' ? `/${route}` : route;

      return _request({
        url: `${baseUrl}${innerRoute}`,
        ...additionalOptions
      });
    };
  }
};
