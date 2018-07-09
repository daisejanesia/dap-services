const uuid = require('uuid');
const Joi = require('joi');
const _ = require('lodash');
const Boom = require('boom');

const FlowTemplate = require('../model');
const flowTemplateAttributes = require('../model/attributes');
const helpers = require('../../helpers');

const overrideJoi = (joiMap, key, joiValidation) => {
  const joiItem = joiMap[key];
  return joiItem ? joiItem() : joiValidation;
};

module.exports = {
  getFlowTemplates(filters = {}) {
    const { feedType, flowType } = filters;
    const where = _.pickBy({ feedType, flowType }, helpers.isPresent);
    const whereClause = helpers.isPresent(where) ? { where } : undefined;
    return FlowTemplate.findAll(whereClause);
  },

  getFlowTemplateById(id) {
    return FlowTemplate.findById(id).then(data => {
      if (!helpers.isPresent(data))
        return Promise.reject(
          Boom.notFound(`The record with id ${id} does not exist`)
        );
      return data;
    });
  },

  createFlowTemplate(flowTemplate) {
    return FlowTemplate.create({ id: uuid.v4(), ...flowTemplate });
  },

  updateFlowTemplate(id, flowTemplate) {
    return FlowTemplate.update(
      { ...flowTemplate, id },
      {
        where: { id },
        returning: true
      }
    ).then(result => {
      const row = result[1];
      if (!row)
        return Promise.reject(Boom.notFound('The record does not exist'));
      return row[0];
    });
  },

  genValidationSchemaForPost() {
    return helpers.generateValidationSchema(
      flowTemplateAttributes,
      (key, joiValidation) => {
        const joiMap = {
          schema: () =>
            Joi.object()
              .keys()
              .required()
              .min(1),
          id: () => Joi.optional()
        };

        return overrideJoi(joiMap, key, joiValidation);
      }
    );
  },

  genValidationSchemaForUpdate() {
    return helpers.generateValidationSchema(
      flowTemplateAttributes,
      (key, joiValidation) => {
        const joiMap = {
          id: () => joiValidation.guid({ version: ['uuidv4'] }).required(),
          schema: () =>
            Joi.object()
              .keys()
              .min(1)
        };

        return overrideJoi(joiMap, key, joiValidation);
      }
    );
  }
};
