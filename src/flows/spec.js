const chai = require('chai');
const request = require('request');
const sinon = require('sinon');
const path = require('path');
const { sequelizeMockingMocha } = require('sequelize-mocking');
const settings = require('../../src/settings');
const sequelize = require('../../src/sequelize');
const apiHelper = require('../../tests/api-helper');
const _ = require('lodash');

const { expect } = chai;
chai.use(require('chai-shallow-deep-equal'));

describe('Flow Configurations API:', function() {
  const _request = request.defaults({
    headers: apiHelper.defaultHeaders()
  });

  // Basic configuration: create a sinon sandbox for testing
  let sandbox = null;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox && sandbox.restore();
  });

  this.timeout(10000);
  // Load fake data for the flow configs
  sequelizeMockingMocha(
    sequelize,
    path.resolve(
      path.join(__dirname, '../../tests/fixtures/flows/flow_data.json')
    ),
    { logging: false }
  );

  describe('GET /flows', () => {
    it('get all flow configs for ui', done => {
      const purpose = 'ui';
      _request(
        `http://localhost:${settings.port}/dap/flows?purpose=${purpose}`,
        (err, response, body) => {
          expect(err).to.eql(null);
          expect(response.statusCode, 'HTTP status code').to.eql(200);
          const value = JSON.parse(body).data;
          expect(_.size(value)).to.eql(3);
          value.forEach(element => {
            expect(_.has(element, 'testConfig')).to.eql(true);
            expect(_.has(element, 'prodConfig')).to.eql(true);
          });
          done();
        }
      );
    });

    it('get all flow configs for pipeline', done => {
      const purpose = 'pipeline';
      _request(
        `http://localhost:${settings.port}/dap/flows?purpose=${purpose}`,
        (err, response, body) => {
          expect(err).to.eql(null);
          expect(response.statusCode, 'HTTP status code').to.eql(200);
          const value = JSON.parse(body).data;
          expect(_.size(value)).to.eql(3);
          value.forEach(element => {
            expect(_.has(element, 'test_config')).to.eql(false);
            expect(_.has(element, 'prod_config')).to.eql(false);
            expect(_.has(element, 'items')).to.eql(true);
          });
          done();
        }
      );
    });

    it('get all flow configs by Id', done => {
      const purpose = 'pipeline';
      const id = '07e6745eb28c47f78eff3f57c234127c';
      _request(
        `http://localhost:${settings.port}/dap/flows/${id}?purpose=${purpose}`,
        (err, response, body) => {
          expect(err).to.eql(null);
          expect(response.statusCode, 'HTTP status code').to.eql(200);
          const value = JSON.parse(body).data;
          expect(value.id).to.eq(id);
          done();
        }
      );
    });

    it('get all flow configs by context', done => {
      const purpose = 'pipeline';
      const context = 'data_pipeline-FLOW_TEST';
      _request(
        `http://localhost:${
          settings.port
        }/dap/flows?purpose=${purpose}&context=${context}`,
        (err, response, body) => {
          expect(err).to.eql(null);
          expect(response.statusCode, 'HTTP status code').to.eql(200);
          const value = JSON.parse(body).data;
          expect(_.size(value)).to.eql(2);
          value.forEach(element => {
            expect(element.context).to.eq(context);
          });
          done();
        }
      );
    });

    it('get all flow configs by name', done => {
      const purpose = 'pipeline';
      const name = 'Pfizer_Test1';
      _request(
        `http://localhost:${
          settings.port
        }/dap/flows?purpose=${purpose}&name=${name}`,
        (err, response, body) => {
          expect(err).to.eql(null);
          expect(response.statusCode, 'HTTP status code').to.eql(200);
          const value = JSON.parse(body).data;
          expect(_.size(value)).to.eql(1);
          expect(value[0].name).to.eq(name);
          done();
        }
      );
    });

    it('get all flow configs by name', done => {
      const purpose = 'pipeline';
      const name = 'Pfizer_Test1';
      _request(
        `http://localhost:${
          settings.port
        }/dap/flows?purpose=${purpose}&flow_name=${name}`,
        (err, response) => {
          expect(err).to.eql(null);
          expect(response.statusCode, 'HTTP status code').to.eql(400);
          done();
        }
      );
    });

    it('get all flow configs by status', done => {
      const purpose = 'pipeline';
      const status = 'Test';
      _request(
        `http://localhost:${
          settings.port
        }/dap/flows?purpose=${purpose}&status=${status}`,
        (err, response, body) => {
          expect(err).to.eql(null);
          expect(response.statusCode, 'HTTP status code').to.eql(200);
          const value = JSON.parse(body).data;
          expect(_.size(value)).to.eql(2);
          value.forEach(element => {
            expect(element.status).to.eq(status);
          });
          done();
        }
      );
    });

    it('get all enabled flow configs', done => {
      const purpose = 'pipeline';
      const enabled = true;
      _request(
        `http://localhost:${
          settings.port
        }/dap/flows?purpose=${purpose}&enabled=${enabled}`,
        (err, response, body) => {
          expect(err).to.eql(null);
          expect(response.statusCode, 'HTTP status code').to.eql(200);
          const value = JSON.parse(body).data;
          expect(_.size(value)).to.eql(2);
          value.forEach(element => {
            expect(element.enabled).to.eq(enabled);
          });
          done();
        }
      );
    });

    it('get all disabled flow configs', done => {
      const purpose = 'pipeline';
      const enabled = false;
      _request(
        `http://localhost:${
          settings.port
        }/dap/flows?purpose=${purpose}&enabled=${enabled}`,
        (err, response, body) => {
          expect(err).to.eql(null);
          expect(response.statusCode, 'HTTP status code').to.eql(200);
          const value = JSON.parse(body).data;
          expect(_.size(value)).to.eql(1);
          value.forEach(element => {
            expect(element.enabled).to.eq(enabled);
          });
          done();
        }
      );
    });

    it("return error if flow that doesn't exist", done => {
      const purpose = 'pipeline';
      const id = 'ca15b31a-7601-11e8-adc0-fa7ae01bbebc';
      _request(
        `http://localhost:${settings.port}/dap/flows/${id}?purpose=${purpose}`,
        (err, response) => {
          expect(err).to.eql(null);
          expect(response.statusCode, 'HTTP status code').to.eql(400);
          done();
        }
      );
    });

    it('return error if flow id is not a valid GUID', done => {
      const purpose = 'pipeline';
      const id = '07e6745eb28c47f78eff3f57c234127xx';
      _request(
        `http://localhost:${settings.port}/dap/flows/${id}?purpose=${purpose}`,
        (err, response) => {
          expect(err).to.eql(null);
          expect(response.statusCode, 'HTTP status code').to.eql(400);
          done();
        }
      );
    });
  });

  describe('POST /flows', () => {
    it('create a new flow', done => {
      const data = {
        flowTemplateId: '1234',
        context: 'data_pipeline-STAGE',
        name: 'Datian_Emerson_EXCEL_Invoice',
        status: 'Test',
        enabled: true,
        flowType: 'FPS',
        feedType: 'Excel',
        description: 'Excel to FPS',
        testConfig: {
          id: '750d0b29e98e4e12978699d13847e140',
          message_classifier: {
            equals: {
              route_id: 11857
            }
          },
          parser_selector: {
            parser: 'excel_to_json'
          }
        },
        prodConfig: {
          id: '750d0b29e98e4e12978699d13847e140',
          message_classifier: {
            equals: {
              route_id: 11857
            }
          },
          parser_selector: {
            parser: 'excel_to_json'
          }
        }
      };

      _request.post(
        {
          url: `http://localhost:${settings.port}/dap/flows`,
          form: data
        },
        (err, response, body) => {
          expect(err).to.eql(null);
          expect(response.statusCode, 'HTTP status code').to.eql(201);
          const responseBody = JSON.parse(body).data;
          expect(responseBody).to.have.property('created_at');
          expect(_.isNull(responseBody.created_at)).to.eql(false);
          expect(responseBody).to.have.property('id');
          expect(_.isEmpty(responseBody.id)).to.eql(false);
          expect(responseBody).to.have.property('enabled');
          expect(responseBody.enabled).to.eql(true);
          done();
        }
      );
    });

    it('create a new flow with non-existing flow template', done => {
      const data = {
        flowTemplateId: '12345',
        context: 'data_pipeline-STAGE',
        name: 'Datian_Emerson_EXCEL_Invoice',
        status: 'Test',
        enabled: true,
        flowType: 'FPS',
        feedType: 'Excel',
        description: 'Excel to FPS',
        testConfig: {
          id: '750d0b29e98e4e12978699d13847e140',
          message_classifier: {
            equals: {
              route_id: 11857
            }
          },
          parser_selector: {
            parser: 'excel_to_json'
          }
        },
        prodConfig: {
          id: '750d0b29e98e4e12978699d13847e140',
          message_classifier: {
            equals: {
              route_id: 11857
            }
          },
          parser_selector: {
            parser: 'excel_to_json'
          }
        }
      };

      _request.post(
        { url: `http://localhost:${settings.port}/dap/flows`, form: data },
        (err, response) => {
          expect(err).to.eql(null);
          expect(response.statusCode, 'HTTP status code').to.eql(500);
          done();
        }
      );
    });

    it('create a new flow with no context', done => {
      const data = {
        flowTemplateId: '1234',
        name: 'Datian_Emerson_EXCEL_Invoice',
        status: 'Test',
        enabled: true,
        flowType: 'FPS',
        feedType: 'Excel',
        description: 'Excel to FPS',
        testConfig: {
          id: '750d0b29e98e4e12978699d13847e140',
          message_classifier: {
            equals: {
              route_id: 11857
            }
          },
          parser_selector: {
            parser: 'excel_to_json'
          }
        },
        prodConfig: {
          id: '750d0b29e98e4e12978699d13847e140',
          message_classifier: {
            equals: {
              route_id: 11857
            }
          },
          parser_selector: {
            parser: 'excel_to_json'
          }
        }
      };

      _request.post(
        { url: `http://localhost:${settings.port}/dap/flows`, form: data },
        (err, response) => {
          expect(err).to.eql(null);
          expect(response.statusCode, 'HTTP status code').to.eql(400);
          done();
        }
      );
    });

    it('create a new flow with no test config', done => {
      const data = {
        flowTemplateId: '1234',
        context: 'data_pipeline-STAGE',
        name: 'Datian_Emerson_EXCEL_Invoice',
        status: 'Test',
        enabled: true,
        flowType: 'FPS',
        feedType: 'Excel',
        description: 'Excel to FPS',
        prodConfig: {
          id: '750d0b29e98e4e12978699d13847e140',
          message_classifier: {
            equals: {
              route_id: 11857
            }
          },
          parser_selector: {
            parser: 'excel_to_json'
          }
        }
      };
      _request.post(
        { url: `http://localhost:${settings.port}/dap/flows`, form: data },
        (err, response) => {
          expect(err).to.eql(null);
          expect(response.statusCode, 'HTTP status code').to.eql(400);
          done();
        }
      );
    });

    it('create a new flow with no prod config', done => {
      const data = {
        flowTemplateId: '1234',
        context: 'data_pipeline-STAGE',
        name: 'Datian_Emerson_EXCEL_Invoice',
        status: 'Test',
        enabled: true,
        flowType: 'FPS',
        feedType: 'Excel',
        description: 'Excel to FPS',
        testConfig: {
          id: '750d0b29e98e4e12978699d13847e140',
          message_classifier: {
            equals: {
              route_id: 11857
            }
          },
          parser_selector: {
            parser: 'excel_to_json'
          }
        }
      };
      _request.post(
        { url: `http://localhost:${settings.port}/dap/flows`, form: data },
        (err, response) => {
          expect(err).to.eql(null);
          expect(response.statusCode, 'HTTP status code').to.eql(400);
          done();
        }
      );
    });

    it('create a flow with duplicate name', done => {
      const data = {
        flowTemplateId: '1234',
        context: 'data_pipeline-STAGE',
        name: 'Pfizer_Test1',
        status: 'Test',
        enabled: true,
        flowType: 'FPS',
        feedType: 'Excel',
        description: 'Excel to FPS',
        testConfig: {
          id: '750d0b29e98e4e12978699d13847e140',
          message_classifier: {
            equals: {
              route_id: 11857
            }
          },
          parser_selector: {
            parser: 'excel_to_json'
          }
        },
        prodConfig: {
          id: '750d0b29e98e4e12978699d13847e140',
          message_classifier: {
            equals: {
              route_id: 11857
            }
          },
          parser_selector: {
            parser: 'excel_to_json'
          }
        }
      };
      _request.post(
        { url: `http://localhost:${settings.port}/dap/flows`, form: data },
        (err, response) => {
          expect(err).to.eql(null);
          expect(response.statusCode, 'HTTP status code').to.eql(500);
          done();
        }
      );
    });
  });

  describe('PUT /flows', () => {
    it('update an existing flow', done => {
      const id = '07e6745eb28c47f78eff3f57c234127c';
      const data = {
        flowTemplateId: '1234',
        context: 'data_pipeline-FLOW_TEST',
        name: 'Datian_Emerson_EXCEL_Invoice',
        status: 'Test',
        enabled: false,
        flowType: 'FPS',
        feedType: 'Excel',
        description: 'Excel to FPS',
        testConfig: {
          id: '750d0b29e98e4e12978699d13847e140',
          message_classifier: {
            equals: {
              route_id: 118571
            }
          },
          parser_selector: {
            parser: 'excel_to_json'
          },
          excel_to_json: {
            skip_hidden: true,
            sheet_index: [0],
            skip_empty_cells: false
          },
          scac_finder: {
            scac: 'DTW'
          },
          stream_to_fps: {
            env_id: 'a8bec80d-55ca-4d5a-b44a-8e5c0379d922',
            feed_type: 'EXCEL',
            bill_limit: '500'
          },
          map_json: {
            map_id: '5ae02c4d639b6b4a02658de5',
            new_lang: true
          }
        },
        prodConfig: {
          id: '750d0b29e98e4e12978699d13847e140',
          message_classifier: {
            equals: {
              route_id: 11857
            }
          },
          parser_selector: {
            parser: 'excel_to_json'
          },
          excel_to_json: {
            skip_hidden: true,
            sheet_index: [0],
            skip_empty_cells: false
          },
          scac_finder: {
            scac: 'DTW'
          },
          stream_to_fps: {
            env_id: 'a8bec80d-55ca-4d5a-b44a-8e5c0379d922',
            feed_type: 'EXCEL',
            bill_limit: '500'
          },
          map_json: {
            map_id: '5ae02c4d639b6b4a02658de5',
            new_lang: true
          }
        }
      };

      _request.put(
        {
          url: `http://localhost:${settings.port}/dap/flows/${id}`,
          form: data
        },
        (err, response) => {
          expect(err).to.eql(null);
          expect(response.statusCode, 'HTTP status code').to.eql(200);
          return done();
        }
      );
    });

    it('update a flow with non-existing template id', done => {
      const id = '07e6745eb28c47f78eff3f57c234127c';
      const data = {
        flowTemplateId: '12345678',
        context: 'data_pipeline-FLOW_TEST',
        name: 'Datian_Emerson_EXCEL_Invoice',
        status: 'Test',
        enabled: true,
        flowType: 'FPS',
        feedType: 'Excel',
        description: 'Excel to FPS',
        testConfig: {
          id: '750d0b29e98e4e12978699d13847e140',
          message_classifier: {
            equals: {
              route_id: 11857
            }
          },
          parser_selector: {
            parser: 'excel_to_json'
          }
        },
        prodConfig: {
          id: '750d0b29e98e4e12978699d13847e140',
          message_classifier: {
            equals: {
              route_id: 11857
            }
          },
          parser_selector: {
            parser: 'excel_to_json'
          }
        }
      };

      _request.put(
        {
          url: `http://localhost:${settings.port}/dap/flows/${id}`,
          form: data
        },
        (err, response) => {
          expect(err).to.eql(null);
          expect(response.statusCode, 'HTTP status code').to.eql(500);
          return done();
        }
      );
    });

    it('update a flow with non-existing id', done => {
      const id = '90fccc58-15b2-416d-967b-ebxx80b7694f2';
      const data = {
        flowTemplateId: '1234',
        context: 'data_pipeline-STAGE',
        name: 'Datian_Emerson_EXCEL_Invoice',
        status: 'Test',
        enabled: true,
        flowType: 'FPS',
        feedType: 'Excel',
        description: 'Excel to FPS',
        testConfig: {
          id: '750d0b29e98e4e12978699d13847e140',
          message_classifier: {
            equals: {
              route_id: 11857
            }
          },
          parser_selector: {
            parser: 'excel_to_json'
          }
        },
        prodConfig: {
          id: '750d0b29e98e4e12978699d13847e140',
          message_classifier: {
            equals: {
              route_id: 11857
            }
          },
          parser_selector: {
            parser: 'excel_to_json'
          }
        }
      };

      _request.put(
        {
          url: `http://localhost:${settings.port}/dap/flows/${id}`,
          form: data
        },
        (err, response) => {
          expect(err).to.eql(null);
          expect(response.statusCode, 'HTTP status code').to.eql(404);
          return done();
        }
      );
    });

    it('enable an existing flow', done => {
      const id = '07e6745eb28c47f78eff3f57c234127c';
      const data = {
        flowTemplateId: '1234',
        context: 'data_pipeline-FLOW_TEST',
        name: 'Datian_Emerson_EXCEL_Invoice',
        status: 'Test',
        enabled: true,
        flowType: 'FPS',
        feedType: 'Excel',
        description: 'Excel to FPS',
        testConfig: {
          id: '750d0b29e98e4e12978699d13847e140',
          message_classifier: {
            equals: {
              route_id: 11857
            }
          },
          parser_selector: {
            parser: 'excel_to_json'
          },
          excel_to_json: {
            skip_hidden: true,
            sheet_index: [0],
            skip_empty_cells: false
          },
          scac_finder: {
            scac: 'DTW'
          },
          stream_to_fps: {
            env_id: 'a8bec80d-55ca-4d5a-b44a-8e5c0379d922',
            feed_type: 'EXCEL',
            bill_limit: '500'
          },
          map_json: {
            map_id: '5ae02c4d639b6b4a02658de5',
            new_lang: true
          }
        },
        prodConfig: {
          id: '750d0b29e98e4e12978699d13847e140',
          message_classifier: {
            equals: {
              route_id: 11857
            }
          },
          parser_selector: {
            parser: 'excel_to_json'
          },
          excel_to_json: {
            skip_hidden: true,
            sheet_index: [0],
            skip_empty_cells: false
          },
          scac_finder: {
            scac: 'DTW'
          },
          stream_to_fps: {
            env_id: 'a8bec80d-55ca-4d5a-b44a-8e5c0379d922',
            feed_type: 'EXCEL',
            bill_limit: '500'
          },
          map_json: {
            map_id: '5ae02c4d639b6b4a02658de5',
            new_lang: true
          }
        }
      };

      _request.put(
        {
          url: `http://localhost:${settings.port}/dap/flows/${id}`,
          form: data
        },
        (err, response) => {
          expect(err).to.eql(null);
          expect(response.statusCode, 'HTTP status code').to.eql(200);
          return done();
        }
      );
    });

    it('enable a non-existing flow', done => {
      const id = '07e6745eb28c47f78eff3f57c234127x1c';
      const data = {
        flowTemplateId: '1234',
        context: 'data_pipeline-FLOW_TEST',
        name: 'Datian_Emerson_EXCEL_Invoice',
        status: 'Test',
        enabled: true,
        flowType: 'FPS',
        feedType: 'Excel',
        description: 'Excel to FPS',
        testConfig: {
          id: '750d0b29e98e4e12978699d13847e140',
          message_classifier: {
            equals: {
              route_id: 11857
            }
          },
          parser_selector: {
            parser: 'excel_to_json'
          },
          excel_to_json: {
            skip_hidden: true,
            sheet_index: [0],
            skip_empty_cells: false
          },
          scac_finder: {
            scac: 'DTW'
          },
          stream_to_fps: {
            env_id: 'a8bec80d-55ca-4d5a-b44a-8e5c0379d922',
            feed_type: 'EXCEL',
            bill_limit: '500'
          },
          map_json: {
            map_id: '5ae02c4d639b6b4a02658de5',
            new_lang: true
          }
        },
        prodConfig: {
          id: '750d0b29e98e4e12978699d13847e140',
          message_classifier: {
            equals: {
              route_id: 11857
            }
          },
          parser_selector: {
            parser: 'excel_to_json'
          },
          excel_to_json: {
            skip_hidden: true,
            sheet_index: [0],
            skip_empty_cells: false
          },
          scac_finder: {
            scac: 'DTW'
          },
          stream_to_fps: {
            env_id: 'a8bec80d-55ca-4d5a-b44a-8e5c0379d922',
            feed_type: 'EXCEL',
            bill_limit: '500'
          },
          map_json: {
            map_id: '5ae02c4d639b6b4a02658de5',
            new_lang: true
          }
        }
      };

      _request.put(
        {
          url: `http://localhost:${settings.port}/dap/flows/${id}`,
          form: data
        },
        (err, response) => {
          expect(err).to.eql(null);
          expect(response.statusCode, 'HTTP status code').to.eql(404);
          return done();
        }
      );
    });
  });

  describe('DELETE /flows', () => {
    it('delete an existing flow', done => {
      const id = '07e6745eb28c47f78eff3f57c234127c';
      _request.delete(
        { url: `http://localhost:${settings.port}/dap/flows/${id}` },
        (err, response) => {
          expect(err).to.eql(null);
          expect(response.statusCode, 'HTTP status code').to.eql(204);
          return done();
        }
      );
    });

    it('delete whole context', done => {
      const context = 'data_pipeline-FLOW_TEST';
      _request.delete(
        {
          url: `http://localhost:${settings.port}/dap/flows?context=${context}`
        },
        (err, response) => {
          expect(err).to.eql(null);
          expect(response.statusCode, 'HTTP status code').to.eql(204);
          return done();
        }
      );
    });

    it('return Not Found when no context found', done => {
      const context = 'data_pipeline-BLABLA';
      _request.delete(
        {
          url: `http://localhost:${settings.port}/dap/flows?context=${context}`
        },
        (err, response) => {
          expect(err).to.eql(null);
          expect(response.statusCode, 'HTTP status code').to.eql(404);
          return done();
        }
      );
    });

    it('delete a non-existing flow id', done => {
      const id = '111753a5-afba-424f-8594-c5eb1d17acfb';
      _request.delete(
        { url: `http://localhost:${settings.port}/dap/flows/${id}` },
        (err, response) => {
          expect(err).to.eql(null);
          expect(response.statusCode, 'HTTP status code').to.eql(404);
          return done();
        }
      );
    });

    it('returns bad request on non GUID input', done => {
      const id = 'abcd';
      _request.delete(
        { url: `http://localhost:${settings.port}/dap/flows/${id}` },
        (err, response) => {
          expect(err).to.eql(null);
          expect(response.statusCode, 'HTTP status code').to.eql(400);
          return done();
        }
      );
    });
  });
});
