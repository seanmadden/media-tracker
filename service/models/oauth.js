/**
 * Created by Sean on 7/24/2014.
 */

var AccessToken = require('./oauth_accesstoken');
var RefreshToken = require('./oauth_refreshtoken');
var Client = require('./oauth_client');
var User = require('./user');

module.exports.getClient = Client.getClient;
module.exports.grantTypeAllowed = Client.grantTypeAllowed;
module.exports.getAccesstoken = AccessToken.getAccessToken;
module.exports.saveAccessToken = AccessToken.saveAccessToken;
module.exports.getRefreshToken = RefreshToken.getRefreshToken;
module.exports.saveRefreshToken = RefreshToken.saveRefreshToken;
module.exports.getUser = User.getUser;
