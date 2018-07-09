module.exports = (basePath, request, expect) => {
  describe('GET', () => {
    it('should return all flow templates', () =>
      request(basePath).then(response => {
        expect(response.statusCode, 'Status Code').to.equal(200);
        expect(response.body).to.have.own.property('data');
        expect(response.body.data).to.not.empty;
      }));

    it('should filter the templates if provided with a query string', () =>
      request(`${basePath}?feedType=EXCEL`).then(response => {
        expect(response.statusCode, 'statusCode').to.equal(200);
        expect(response.body).to.have.own.property('data');
        expect(response.body.data).to.not.empty;
      }));

    it('should return a 400 if query-params is not recognize', () =>
      request(`${basePath}?invalid=foo`).catch(e =>
        expect(e.statusCode).to.equal(400)
      ));

    it('should return a flow base on id', () =>
      request(`${basePath}/6c0b8e2b-71b9-423c-be29-550b76c25963`).then(
        response => {
          expect(response.statusCode, 'statusCode').to.equal(200);
          expect(response.body.data).to.include({
            id: '6c0b8e2b-71b9-423c-be29-550b76c25963'
          });
        }
      ));

    it('should return a 404 if id does not exist', () =>
      request(`${basePath}/6c0b8e2b-71b9-423c-be29-550b76c25964`).catch(e => {
        expect(e.statusCode).to.equal(404);
      }));
  });
};
