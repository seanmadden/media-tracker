var request = require('supertest'),
    app = require('./../service');

function checkMessage(expected, actual) {
    if (expected !== actual)
        return "Failure.\nExpected: '" + expected + "'\nGot: " + actual;

    return false;
}
describe('GET lists', function() {
    var token = "NOT SET YET";

    it('gets a bearer token', function(done) {
        request(app)
            .post("/oauth/token")
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({
                username: 'fff',
                password: 'asdf',
                grant_type: 'password',
                client_id: 'example',
                client_secret: 'aaaaaaaaaaaa'
            })
            .end(function(err, res) {
                token = res.body.access_token;
                done();
            })
    });

    it('responds with all lists', function(done) {
        console.log("using token: ", token);
        request(app)
            .get('/api/lists')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect(function(res) {
                checkMessage('SUCCESS', res.body.status)
            })
            .expect('Content-Type', /json/)
            .expect(200, done);
    });

    it('responds with "List Created"', function(done) {
        request(app)
            .post('/api/lists')
            .send({title: 'testList'})
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect('Content-Type', /json/)
            .expect(function(res) {
                return checkMessage('List Created', res.body.message) == true
            })
            .expect(200, done);
    });

    it('responds with "List already exists"', function(done) {
        request(app)
            .post('/api/lists')
            .send({title: 'testList'})
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect('Content-Type', /json/)
            .expect(function(res) {
                return checkMessage('List Already Exists!', res.body.message)
            })
            .expect(200, done);

    });

    it('adds an item to our list', function(done) {
        request(app)
            .post('/api/testList')
            .send({title: 'testItem'})
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect('Content-Type', /json/)
            .expect(200, done);
    });

    it('adds another item to our list', function(done) {
        request(app)
            .post('/api/testList')
            .send({title: 'testItem2'})
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect('Content-Type', /json/)
            .expect(200, done);
    });

    it('returns the contents of a list', function(done) {
        request(app)
            .get('/api/testList')
            .set('Authorization', 'Bearer ' + token)
            .expect('Content-Type', /json/)
            .expect(function(res) {
                checkMessage(2, res.body.count);
            })
            .expect(200, done);
    });

    it('deletes testItem2 from the testList', function(done) {
        request(app)
            .delete('/api/testList/testItem2')
            .set('Authorization', 'Bearer ' + token)
            .expect('Content-Type', /json/)
            .expect(function(res) {
                return checkMessage('ListItem Deleted!', res.body.message)
            })
            .expect(200, done);

    });

    it('deletes the test list', function(done) {
        request(app)
            .delete('/api/testList')
            .set('Authorization', 'Bearer ' + token)
            .expect(function(res) {
                return checkMessage('List Deleted!', res.body.message)
            })
            .expect('Content-Type', /json/)
            .expect(200, done);
    });

    it('responds with no list items', function(done) {
        request(app)
            .get('/api/testList')
            .set('Authorization', 'Bearer ' + token)
            .expect('Content-Type', /json/)
            .expect(function(res) {
                return checkMessage('List not found', res.body.message)
            })
            .expect(200, done);
    });
});
