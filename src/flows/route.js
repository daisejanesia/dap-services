const Joi = require('joi');
const FlowListings = require('../flows/helper');

const _getFlows = {
  method: 'GET',
  path: '/flows',
  config: {
    description: 'Get all flows configured for specific DAP topology',
    tags: ['api', 'dap', 'flow_config'],
    validate: {
      query: {
        purpose: Joi.string().required(),
        context: Joi.string(),
        name: Joi.string(),
        status: Joi.string(),
        enabled: Joi.boolean()
      }
    }
  },
  handler: async request => {
    const { purpose, context, name, status, enabled } = request.query;
    const { id } = request.params;
    const flows = await FlowListings.getAllFlows(
      context,
      id,
      name,
      status,
      enabled,
      purpose
    );
    return { data: flows.get() };
  }
};

const _getFlowById = {
  method: 'GET',
  path: '/flows/{id}',
  config: {
    description: 'Get specific flow',
    tags: ['api', 'dap', 'flow_config'],
    validate: {
      query: {
        purpose: Joi.string().required()
      },
      params: {
        id: Joi.string().guid({ version: ['uuidv4'] })
      }
    }
  },
  handler: async request => {
    const { purpose } = request.query;
    const { id } = request.params;
    const flows = await FlowListings.getFlowById(id, purpose);
    return { data: flows.get() };
  }
};

const _createFlow = {
  method: 'POST',
  path: '/flows',
  handler: async (request, h) => {
    const flowConfig = request.payload;
    const createdFlow = await FlowListings.createFlowConfiguration(flowConfig);
    return h.response(createdFlow.get()).code(201);
  },
  config: {
    security: true,
    validate: {
      payload: Joi.object({
        id: Joi.string().guid({ version: ['uuidv4'] }),
        flowTemplateId: Joi.string()
          .trim()
          .required()
          .label('Flow Template Id'),
        context: Joi.string()
          .trim()
          .required()
          .default('data_pipeline-STAGE')
          .label('Context'),
        name: Joi.string()
          .trim()
          .required()
          .label('Flow Name'),
        status: Joi.string()
          .required()
          .label('Status'),
        enabled: Joi.boolean()
          .required()
          .label('Enabled'),
        flowType: Joi.string()
          .required()
          .label('Flow Type'),
        feedType: Joi.string()
          .required()
          .label('Feed Type'),
        description: Joi.string()
          .trim()
          .allow([null, ''])
          .label('Description'),
        testConfig: Joi.any()
          .required()
          .options({
            allowUnknown: true
          }),
        prodConfig: Joi.any()
          .required()
          .options({
            allowUnknown: true
          })
      })
    },
    description: 'insert a new flow configuration',
    tags: ['api', 'flow']
  }
};

const _updateFlow = {
  method: 'PUT',
  path: '/flows/{id}',
  handler: async request => {
    const flowConfig = request.payload;
    const { id } = request.params;
    const updatedFlow = await FlowListings.updateFlowConfiguration(
      id,
      flowConfig
    );
    return updatedFlow.get();
  },
  config: {
    security: true,
    validate: {
      payload: Joi.object({
        flowTemplateId: Joi.string()
          .trim()
          .required()
          .label('Flow Template Id'),
        context: Joi.string()
          .trim()
          .required()
          .default('data_pipeline-STAGE')
          .label('Context'),
        name: Joi.string()
          .trim()
          .required()
          .label('Flow Name'),
        status: Joi.string()
          .required()
          .label('Status'),
        enabled: Joi.boolean()
          .required()
          .label('Enabled'),
        flowType: Joi.string()
          .required()
          .label('Flow Type'),
        feedType: Joi.string()
          .required()
          .label('Feed Type'),
        description: Joi.string()
          .trim()
          .allow([null, ''])
          .label('Description'),
        testConfig: Joi.any()
          .required()
          .options({
            allowUnknown: true
          }),
        prodConfig: Joi.any()
          .required()
          .options({
            allowUnknown: true
          })
      })
    },
    description: 'upsert a flow configuration',
    tags: ['api', 'flow']
  }
};

const _enableFlow = {
  method: 'PUT',
  path: '/flows/{id}/enable',
  handler: async request => {
    const { enable } = request.payload;
    const { id } = request.params;
    const updatedFlow = await FlowListings.enableFlowConfiguration(id, enable);
    return updatedFlow.get();
  },
  config: {
    security: true,
    validate: {
      payload: Joi.object({
        enable: Joi.boolean()
          .required()
          .default(true)
          .label('Enable Context')
      })
    },
    description: 'enable or disable a flow configuration',
    tags: ['api', 'flow']
  }
};

const _releaseFlow = {
  method: 'PUT',
  path: '/flows/{id}/release',
  handler: async request => {
    const flowConfig = request.payload;
    const { id } = request.params;
    const updatedFlow = await FlowListings.releaseFlowConfiguration(
      id,
      flowConfig
    );
    return updatedFlow.get();
  },
  config: {
    security: true,
    validate: {
      payload: Joi.object({
        context: Joi.string()
          .trim()
          .required()
          .default('data_pipeline-STAGE')
          .label('Context'),
        status: Joi.string()
          .required()
          .label('Status')
      })
    },
    description: 'release a flow configuration to prod',
    tags: ['api', 'flow']
  }
};

const _deleteOneFlow = {
  method: 'DELETE',
  path: '/flows/{id}',
  handler: async (request, h) => {
    const { id } = request.params;
    await FlowListings.deleteFlowConfiguration(id);
    return h.response().code(204);
  },
  config: {
    validate: {
      params: {
        id: Joi.string()
          .guid({ version: ['uuidv4'] })
          .trim()
          .required()
          .label('id')
      }
    },
    security: true,
    description: 'delete config on a context by id',
    tags: ['api', 'flow', 'delete']
  }
};

const _deleteFlowByContext = {
  method: 'DELETE',
  path: '/flows',
  handler: async (request, h) => {
    const { context } = request.query;
    await FlowListings.deleteFlowByContext(context);
    return h.response().code(204);
  },
  config: {
    validate: {
      query: {
        context: Joi.string()
          .trim()
          .required()
          .label('context')
      }
    },
    security: true,
    description: 'delete config by context',
    tags: ['api', 'flow', 'delete']
  }
};

module.exports = [
  _getFlowById,
  _getFlows,
  _createFlow,
  _updateFlow,
  _enableFlow,
  _releaseFlow,
  _deleteOneFlow,
  _deleteFlowByContext
];
