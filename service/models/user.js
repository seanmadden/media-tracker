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

UserSchema.static('authenticate', function(email, password, callback) {
    User.findOne({ email: email }, function(err, user) {
        if (err)
            return callback(err);
        callback(null, bcrypt.compareSync(password, user.password) ? user : null);
    });
});

UserSchema.static('getUser', function(email, password, callback) {
    User.authenticate(email, password, function(err, user) {
        if (err)
            return callback(err);

        callback(null, user.email);

    });
});

var User = mongoose.model('User', UserSchema);
module.exports = User;
