var request = require('supertest'),
    app = require('./../service'),
    mocha = require('mocha');

describe('GET lists', function() {
    it('respond with json', function(done) {
        request(app)
            .get('/api/lists')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
});