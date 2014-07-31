/**
 * Created by Sean on 7/24/2014.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var OAuthClientsSchema = new Schema({
    clientId: { type: String },
    clientSecret: { type: String },
    redirectUri: { type: String }
});

OAuthClientsSchema.static('getClient', function(clientId, clientSecret, callback) {
    if (clientSecret === null) {
        return OAuthClientsModel.findOne({ clientId: clientId }, callback);
    }

    OAuthClientsModel.findOne({ clientId: clientId, clientSecret: clientSecret }, callback);
});

OAuthClientsSchema.static('grantTypeAllowed', function(clientId, grantType, callback) {
    if (grantType === 'password') {
        //TODO: only authorize certain client IDs for password grant type
        return callback(false, true)
    }
});

mongoose.model('OAuthClients', OAuthClientsSchema);
var OAuthClientsModel = mongoose.model('OAuthClients');
module.exports = OAuthClientsModel;
