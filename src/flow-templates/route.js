const Boom = require('boom');
const Service = require('./service');
const Joi = require('joi');

const logger = require('../../../logger');

logger.level('debug');

const _getTemplates = {
  method: 'GET',
  path: '/dap/flow-templates',
  config: {
    validate: {
      query: Joi.object().keys({
        feedType: Joi.string(),
        flowType: Joi.string()
      })
    }
  },
  handler: (request, reply) =>
    Service.getFlowTemplates(request.query)
      .then(data => reply({ data }))
      .catch(e => reply(Boom.wrap(e)))
};

const _getTemplate = {
  method: 'GET',
  path: '/dap/flow-templates/{id}',
  config: {
    validate: {
      params: {
        id: Joi.string()
          .guid({ version: ['uuidv4'] })
          .required()
      }
    }
  },
  handler: (request, reply) => {
    const { id } = request.params;
    Service.getFlowTemplateById(id)
      .then(data => reply({ data }))
      .catch(e => reply(Boom.wrap(e)));
  }
};

const _createFlowTemplate = {
  method: 'POST',
  path: '/dap/flow-templates',
  config: {
    validate: {
      payload: Service.genValidationSchemaForPost()
    }
  },
  handler: (request, reply) =>
    Service.createFlowTemplate(request.payload)
      .then(data => reply({ data }).code(201))
      .catch(e => reply(Boom.wrap(e)))
};

const _updateFlowTemplate = {
  method: 'PUT',
  path: '/dap/flow-templates/{id}',
  config: {
    validate: {
      params: {
        id: Joi.string()
          .guid({ version: ['uuidv4'] })
          .required()
      },
      payload: Service.genValidationSchemaForUpdate()
    }
  },
  handler: (request, reply) =>
    Service.updateFlowTemplate(request.params.id, request.payload)
      .then(data => reply({ data }))
      .catch(e => reply(Boom.wrap(e)))
};

module.exports = [
  _getTemplates,
  _createFlowTemplate,
  _updateFlowTemplate,
  _getTemplate
];
