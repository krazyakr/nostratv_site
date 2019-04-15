var express = require('express');
var router = express.Router();

// API routes
router.use('/api', require('./api'));

// Views routes
router.use('/', require('./views'));

module.exports = router;
