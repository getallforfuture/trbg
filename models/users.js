let crypto = require('crypto');
let util = require('util');
let mongoose = require('../libs/mongoose');
let async = require('async');

    Schema = mongoose.Schema;
 let schema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

schema.encryptPassword = function(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

schema.virtual('password')
    .set(function(password) {
        this._plainPassword = password;
        this.salt = Math.random() + '';
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function() { return this._plainPassword; });


schema.checkPassword = function(password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

schema.authorize = function(username, password, callback) {
    let User = this;

    async.waterfall([
        function(callback) {
            User.findOne({username: username}, callback);
        },
        function(user, callback) {
            if (user) {
                if (user.checkPassword(password)) {
                    callback(null, user);
                } else {
                    callback(new AuthError("Пароль неверен"));
                }
            } else {
                let user = new User({username: username, password: password});
                user.save(function(err) {
                    if (err) return callback(err);
                    callback(null, user);
                });
            }
        }
    ], callback);
};

module.exports.User = mongoose.model('User', schema);


function AuthError(message) {
    Error.apply(this, arguments);
    Error.captureStackTrace(this, AuthError);

    this.message = message;
}
util.inherits(AuthError, Error);


AuthError.prototype.name = 'AuthError';

module.exports.AuthError = AuthError;
