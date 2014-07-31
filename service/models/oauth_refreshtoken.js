/**
 * Created by Sean on 7/24/2014.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var OAuthRefreshTokensSchema = new Schema({
    refreshToken: { type: String },
    clientId: { type: String },
    userId: { type: String },
    expires: { type: Date }
});

mongoose.model('OAuthRefreshTokens', OAuthRefreshTokensSchema);
var OAuthRefreshTokensModel = mongoose.model('OAuthRefreshTokens');

module.exports.saveRefreshToken = function(token, clientId, expires, userId, callback) {
    var refreshToken = new OAuthRefreshTokensModel({
        refreshToken: token,
        clientId: clientId,
        userId: userId,
        expires: expires
    });

    refreshToken.save(callback);
};

module.exports.getRefreshToken = function(refreshToken, callback) {
    OAuthRefreshTokensModel.findOne({ refreshToken: refreshToken }, callback);
};