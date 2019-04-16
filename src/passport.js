var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
    function (username, password, done) {

        if (username == 'admin' && password == 'nostraTV') {
            return done(null, { username: username });
        }
        else {
            return done(null, false, { message: 'Invalid username or password.' });
        }

        // User.findOne({ username: username }, function(err, user) {
        //   if (err) { return done(err); }
        //   if (!user) {
        //     return done(null, false, { message: 'Incorrect username.' });
        //   }
        //   if (!user.validPassword(password)) {
        //     return done(null, false, { message: 'Incorrect password.' });
        //   }
        //   return done(null, user);
        // });
    }
));