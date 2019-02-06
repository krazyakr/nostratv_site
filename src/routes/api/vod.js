var express = require('express');
var router = express.Router();

// Require controller modules
var controller = require('../../controllers/api/vod');

// Routes

// Default handler
router.get('/', function (req, res, next) {
    res.statusCode = 501;
    res.json({ "Error": "Not Implemented" });
});

// POST request
router.post('/', function (req, res, next) {
    res.statusCode = 501;
    res.json({ "Error": "Not Implemented" });
});

// POST login request
router.post('/login', controller.doLogin);

module.exports = router;