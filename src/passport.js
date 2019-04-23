var localStrategy = require('passport-local').Strategy;
var User = require('./models/user');

module.exports = function (passport) {

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });

    passport.use( new localStrategy(function(username, password, done){
        User.findByUsername(username, function(err, doc){
            if (err) {
                done(err);
            }
            else {
                if (doc) {
                    var valid = doc.comparePassword(password, doc.password);
                    if (valid) {
                        done(null, {
                            username: doc.username,
                            password: doc.password
                        });
                    }
                    else {
                        done(null, false);
                    }
                }
                else {
                    done(null, false);
                }
            }
        });

    }))
}