/**
 * Created by Sean on 7/24/2014.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var OAuthAccessTokensSchema = new Schema({
    accessToken: { type: String },
    clientId: { type: String },
    userId: { type: String },
    expires: { type: Date }
});

mongoose.model('OAuthAccessTokens', OAuthAccessTokensSchema);
var OAuthAccessTokensModel = mongoose.model('OAuthAccessTokens');

module.exports.getAccessToken = function(bearerToken, callback) {
    OAuthAccessTokensModel.findOne({ accessToken: bearerToken }, callback);
};

module.exports.saveAccessToken = function(token, clientId, expires, userId, callback) {
    var accessToken = new OAuthAccessTokensModel({
        accessToken: token,
        clientId: clientId,
        userId: userId,
        expires: expires
    });

    accessToken.save(callback);
};
