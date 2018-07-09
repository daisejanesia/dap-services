module.exports = (basePath, request, expect) => {
  describe('PUT', () => {
    const sample = {
      id: '6c0b8e2b-71b9-423c-be29-550b76c25963',
      name: 'test',
      flowType: 'test',
      feedType: 'test',
      schema: { foo: 'bar' }
    };

    it('should update a template for a given id', () =>
      request(`${basePath}/6c0b8e2b-71b9-423c-be29-550b76c25963`, {
        body: sample,
        method: 'PUT'
      }).then(response => {
        expect(response.statusCode, 'Status Code').to.eql(200);
      }));

    it('should return a 404 if id does not exist', () =>
      request(`${basePath}/6c0b8e2b-71b9-423c-be29-550b76c25964`, {
        body: sample,
        method: 'PUT'
      }).then(
        fulfilledResponse => {
          // Just in case in the future someone will change the api and forgot to return 404 if id does not exist.
          expect(fulfilledResponse.statusCode).to.not.equal(200);
        },
        rejectResponse => {
          expect(rejectResponse).to.be.ok;
          expect(rejectResponse.statusCode).to.eql(404);
        }
      ));

    it('should use the id provided in the query string rather than in the payload', () => {
      const errorSample = {
        id: '6c0b8e2b-71b9-423c-be29-550b76c25965',
        name: 'test',
        flowType: 'test',
        feedType: 'test',
        schema: { foo: 'bar' }
      };

      return request(`${basePath}/6c0b8e2b-71b9-423c-be29-550b76c25963`, {
        body: errorSample,
        method: 'PUT'
      }).then(response => {
        expect(response.statusCode, 'Status Code').to.eql(200);
        return request(
          '/dap/flow-templates/6c0b8e2b-71b9-423c-be29-550b76c25963'
        ).then(res => {
          expect(res.body.data).to.include({
            id: '6c0b8e2b-71b9-423c-be29-550b76c25963'
          });
        });
      });
    });
  });
};
