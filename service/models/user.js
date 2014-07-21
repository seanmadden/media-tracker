/**
 * Created by Sean on 7/19/2014.
 * Inspired by http://devsmash.com/blog/password-authentication-with-mongoose-and-bcrypt
 */

var bcrypt = require('bcryptjs');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
    email: { type: String, required: true},
    email_lower: { type: String, required: true, index: { unique: true }},
    password: { type: String, required: true }
});

var OAuthAccessTokensSchema = new Schema({
    accessToken: { type: String },
    clientId: { type: String },
    userId: { type: String },
    expires: { type: Date }
});

var OAuthRefreshTokensSchema = new Schema({
    refreshToken: { type: String },
    clientId: { type: String },
    userId: { type: String },
    expires: { type: Date }
});

var OAuthClientsSchema = new Schema({
    clientId: { type: String },
    clientSecret: { type: String },
    redirectUri: { type: String }
});

mongoose.model('OAuthAccessTokens', OAuthAccessTokensSchema);
mongoose.model('OAuthRefreshTokens', OAuthRefreshTokensSchema);
mongoose.model('OAuthClients', OAuthClientsSchema);

var OAuthAccessTokensModel = mongoose.model('OAuthAccessTokens'),
    OAuthRefreshTokensModel = mongoose.model('OAuthRefreshTokens'),
    OAuthClientsModel = mongoose.model('OAuthClients');

//Make sure to salt and hash the password before saving it to the db
UserSchema.pre('save', function(next) {
    var user = this;

    if (!user.isModified('password'))
        return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err)
            return next(err);

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err)
                return next(err);

            user.password = hash;
            next();
        });

    });

});

UserSchema.methods.comparePassword = function(password, callback) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if (err)
            return callback(err);

        callback(null, isMatch);
    });
};

UserSchema.getAccessToken = function(bearerToken, callback) {
    OAuthAccessTokensModel.findOne({ accessToken: bearerToken }, callback);
};

UserSchema.getClient = function(clientId, clientSecret, callback) {
    if (clientSecret === null) {
        return OAuthClientsModel.findOne({ clientId: clientId }, callback);
    }

    OAuthClientsModel.findOne({ clientId: clientId, clientSecret: clientSecret }, callback);
};

UserSchema.saveAccessToken = function(token, clientId, expires, userId, callback) {
    var accessToken = new OAuthAccessTokensModel({
        accessToken: token,
        clientId: clientId,
        userId: userId,
        expires: expires
    });

    accessToken.save(callback);
};

UserSchema.saveRefreshToken = function(token, clientId, expires, userId, callback) {
    var refreshToken = new OAuthRefreshTokensModel({
        refreshToken: token,
        clientId: clientId,
        userId: userId,
        expires: expires
    });

    refreshToken(callback);
};

UserSchema.getRefreshToken = function(refreshToken, callback) {
    OAuthRefreshTokensModel.findOne({ refreshToken: refreshToken }, callback);
};

module.exports = mongoose.model('User', UserSchema);
