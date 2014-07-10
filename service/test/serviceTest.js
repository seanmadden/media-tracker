var request = require('supertest'),
    app = require('./../service'),
    mocha = require('mocha');

describe('GET lists', function() {
    it('responds with json', function(done) {
        request(app)
            .get('/api/lists')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });

    it('responds with "List Created"', function(done) {
        request(app)
            .post('/api/lists')
            .send({title: 'testList'})
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(function(res) {
                if (res.body.message !== 'List Created') {
                    return "List not created successfully";
                }
            })
            .expect(200, done);
    });

    it('responds with json', function(done) {
        request(app)
            .get('/api/testList')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
});