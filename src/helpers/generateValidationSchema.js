const _ = require('lodash');
const Hoek = require('hoek');
const Sequelize = require('sequelize');
const Joi = require('joi');

const joiString = joi => joi.string().trim();
const joiNumber = joi => joi.number();
const joiInt = joi => joiNumber(joi).integer();

const sequelizeTypeToJoi = {
  [Sequelize.TEXT()]: joiString,
  [Sequelize.STRING()]: joi => joiString(joi).max(255),
  [Sequelize.CHAR()]: joi => joiString(joi).max(255),
  [Sequelize.TINYINT()]: joi => joiInt(joi).max(127),
  [Sequelize.SMALLINT()]: joi => joiInt(joi).max(65536),
  [Sequelize.MEDIUMINT()]: joi => joiInt(joi),
  [Sequelize.INTEGER()]: joi => joiInt(joi),
  [Sequelize.FLOAT()]: joi => joiNumber(joi),
  [Sequelize.DOUBLE()]: joi => joiNumber(joi),
  [Sequelize.DECIMAL()]: joi => joiNumber(joi),
  [Sequelize.REAL()]: joi => joiNumber(joi),
  [Sequelize.BOOLEAN()]: joi => joi.bolean(),
  [Sequelize.DATE()]: joi => joi.date()
};

const getJoiType = (sequelizeType, joi) => {
  const fn = sequelizeTypeToJoi[sequelizeType];
  return fn ? fn(joi) : joi;
};

const generateJoiValidation = meta => {
  const actions = {
    type(sequelizeType, joi) {
      return getJoiType(sequelizeType, joi);
    },
    allowNull(flag, joi) {
      return !flag ? joi.required() : joi;
    }
  };

  const joiValidation = _.reduce(
    meta,
    (joi, val, key) => {
      const action = actions[key];
      return action ? action(val, joi) : joi;
    },
    Joi
  );

  return joiValidation;
};

module.exports = (modelAttributes, keyCallback = Hoek.ignore) => {
  const generatedSchema = _.reduce(
    modelAttributes,
    (obj, val, key) => {
      const validation = generateJoiValidation(val);
      const validationExtended = keyCallback(key, validation) || validation;
      return { ...obj, [key]: validationExtended };
    },
    {}
  );
  return Joi.object(generatedSchema);
};
