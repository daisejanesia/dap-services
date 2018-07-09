const options = {
  settings: `${process.env.PWD}/defaults.yml`,
  overrides: '/etc/trax-document-microservices/settings.yaml'
};

const settings = require('@trax/trax-settings')(options);

settings.port = process.env.PORT != null ? process.env.PORT : 3000;

module.exports = settings;
