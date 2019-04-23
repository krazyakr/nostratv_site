var express = require('express');
var router = express.Router();
var passport = require('passport');

require('../passport')(passport);

var authRouter = require('./auth')(passport);

// API routes
router.use('/api', require('./api'));

// Views routes
router.use('/', require('./views'));

// Auth routes
router.use('/auth', authRouter);

module.exports = router;
