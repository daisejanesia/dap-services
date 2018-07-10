const FlowConfig = require('../models/dap_flow_model');
const _ = require('lodash');
const Boom = require('boom');
const uuid = require('uuid');

const transformConfig = (item, purpose) => {
  if (purpose === 'pipeline') {
    // for pipeline
    const configToUse =
      item.dataValues.status === 'Test'
        ? JSON.parse(item.dataValues.testConfig)
        : JSON.parse(item.dataValues.prodConfig);
    const flowConfiguration = {
      id: item.dataValues.id,
      flowTemplateId: item.dataValues.flowTemplateId,
      context: item.dataValues.context,
      name: item.dataValues.name,
      status: item.dataValues.status,
      enabled: item.dataValues.enabled,
      flowType: item.dataValues.flowType,
      feedType: item.dataValues.feedType,
      description: item.dataValues.description,
      items: configToUse
    };
    return flowConfiguration;
  }
  // for UI output
  const config = item.dataValues;
  const flowConfiguration = {
    id: config.id,
    flowTemplateId: config.flowTemplateId,
    context: config.context,
    name: config.name,
    status: config.status,
    enabled: config.enabled,
    flowType: config.flowType,
    feedType: config.feedType,
    description: config.description,
    testConfig: JSON.parse(config.testConfig),
    prodConfig: JSON.parse(config.prodConfig)
  };
  return flowConfiguration;
};

const getAllFlows = (context, id, name, status, enabled, purpose) => {
  const whereFilter = _.omitBy({ context, id, name, status, enabled }, item =>
    _.isEmpty(_.toString(item))
  );
  return FlowConfig.findAll({
    where: whereFilter
  }).then(existingFlow =>
    existingFlow.map(item => transformConfig(item, purpose))
  );
};

const getFlowById = (id, purpose) =>
  FlowConfig.findById(id).then(existingFlow => {
    if (_.isEmpty(existingFlow)) {
      return Promise.reject(Boom.notFound());
    }
    return transformConfig(existingFlow, purpose);
  });

const createFlowConfiguration = newConfig => {
  const config = Object.assign({}, newConfig);
  if (_.isEmpty(config.id)) config.id = uuid.v4();
  else return Promise.reject(Boom.badRequest());
  return FlowConfig.create(config);
};

const updateFlowConfiguration = (flowId, flowConfig) => {
  const config = Object.assign({}, flowConfig);
  config.id = flowId;
  return FlowConfig.findById(flowId).then(existingFlow => {
    if (_.isEmpty(existingFlow)) {
      return Promise.reject(Boom.notFound());
    }
    return FlowConfig.update(config, {
      where: { id: flowId },
      returning: true
    });
  });
};

const releaseFlowConfiguration = (flowId, newValues) => {
  const config = Object.assign({}, newValues);
  FlowConfig.findById(flowId).then(existingFlow => {
    if (_.isEmpty(existingFlow)) {
      return Promise.reject(Boom.notFound());
    }

    return FlowConfig.update(
      {
        context: config.context,
        status: config.status
      },
      {
        where: { id: flowId },
        returning: true
      }
    );
  });
};

const enableFlowConfiguration = (flowId, enableFlow) =>
  FlowConfig.findById(flowId).then(existingFlow => {
    if (_.isEmpty(existingFlow)) {
      return Promise.reject(Boom.notFound());
    }

    return FlowConfig.update(
      { enabled: enableFlow },
      {
        where: { id: flowId },
        returning: true
      }
    );
  });

const deleteFlowConfiguration = flowId =>
  FlowConfig.findById(flowId).then(existingFlow => {
    if (_.isEmpty(existingFlow)) {
      return Promise.reject(Boom.notFound());
    }
    return FlowConfig.destroy({
      where: { id: flowId }
    });
  });

const deleteFlowByContext = topology =>
  FlowConfig.destroy({
    where: { context: topology }
  }).then(affectedRows => {
    if (affectedRows < 1) return Promise.reject(Boom.notFound());
    return affectedRows;
  });

module.exports = {
  getFlowById,
  getAllFlows,
  createFlowConfiguration,
  updateFlowConfiguration,
  releaseFlowConfiguration,
  enableFlowConfiguration,
  deleteFlowConfiguration,
  deleteFlowByContext
};
