var express = require('express');
var router = express.Router();
var User = require('../models/user');

module.exports = function (passport) {

    router.post('/signup', function (req, res) {
        var body = req.body,
            username = body.username,
            password = body.password;

        User.findByUsername(username, function (err, doc) {
            if (err) {
                res.status(500).send('Internal error');
            }
            else {
                if (doc) {
                    res.status(500).send('User already exists');
                }
                else {
                    var record = new User(username);;
                    record.username = username;
                    record.password = record.generatePassword(password);
                    record.save(function (err, user) {
                        if (err) {
                            res.status(500).send('DB error');
                        }
                        else {
                            res.send(user);
                        }
                    });
                }
            }
        });
    });

    router.post('/login', passport.authenticate('local', {
        failureRedirect: '/login',
        successRedirect: '/'
    }), function (req, res) {
        res.send('hello');
    });

    return router;
};

module.exports.Required = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    }
    else {
        res.redirect('/login');
    }
}