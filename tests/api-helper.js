const jwt = require('jsonwebtoken');

const ApiHelper = {
  validToken(orgId = '607de0f1-6be7-4cef-9f6f-d3f896ec20b3', options = {}) {
    const payload = Object.assign(
      {},
      {
        actor: 1,
        email: 'jane.doe@traxtech.com',
        name: 'Jane Doe',
        context: 'client-site',
        organization: orgId
      },
      options
    );
    return jwt.sign(payload, 'secret', {
      issuer: 'client_site',
      expiresIn: 60 * 60
    });
  },
  validNonAdminToken(
    orgId = '607de0f1-6be7-4cef-9f6f-d3f896ec20b3',
    options = {}
  ) {
    const payload = Object.assign(
      {},
      {
        actor: 2,
        email: 'john.doe@traxtech.com',
        name: 'john Doe',
        context: 'client-site',
        organization: orgId
      },
      options
    );
    return jwt.sign(payload, 'secret', {
      issuer: 'client_site',
      expiresIn: 60 * 60
    }); // expressed in seconds
  },

  defaultHeaders(orgId, tokenOptions = {}, headers = {}) {
    return Object.assign(
      { Authorization: `Bearer ${this.validToken(orgId, tokenOptions)}` },
      headers
    );
  },
  defaultNonAdminHeaders(orgId, tokenOptions) {
    return {
      Authorization: `Bearer ${this.validNonAdminToken(orgId, tokenOptions)}`
    };
  }
};

module.exports = ApiHelper;
