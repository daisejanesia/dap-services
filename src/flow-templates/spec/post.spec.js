module.exports = (basePath, request, expect) => {
  describe('POST', () => {
    it('should post a new record', () => {
      const sample = {
        name: 'test',
        flowType: 'test',
        feedType: 'test',
        schema: { foo: 'bar' }
      };

      return request(basePath, {
        method: 'POST',
        body: sample
      }).then(response => {
        expect(response.statusCode, 'Status Code').to.equal(201);
        expect(response.body.data).to.deep.include(sample);
      });
    });
  });
};
