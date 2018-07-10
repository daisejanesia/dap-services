const chai = require('chai');
const sequelize = require('../../sequelize');

const TestHelper = require('../../helpers/testHelper');

const GetSpec = require('./get.spec');
const PostSpec = require('./post.spec');
const PutSpec = require('./put.spec');

const { expect } = chai;
chai.use(require('chai-shallow-deep-equal'));

describe('/flow-templates', function() {
  TestHelper.setup({
    fixturesPath: '../../../helpers/test/fixtures/dap/flow-templates.json',
    sequelize,
    context: this
  });

  const request = TestHelper.requestPromise();
  const basePath = '/dap/flow-templates';

  GetSpec(basePath, request, expect);
  PostSpec(basePath, request, expect);
  PutSpec(basePath, request, expect);
});
