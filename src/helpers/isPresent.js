const _ = require('lodash');

module.exports = value => {
  const checkerDef = {
    string: val => val.trim() !== '',
    undefined: val => val !== undefined,
    object: val => {
      const conditions = [
        _.isArray(val) && val.length > 1,
        _.isObject(val) && !_.isEmpty(val),
        !_.isObject(val) && !_.isArray(val) && val !== null
      ];

      return conditions.some(cond => cond);
    }
  };

  const checker = checkerDef[typeof value];
  return checker ? checker(value) : true;
};
