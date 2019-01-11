var express = require('express');
var router = express.Router();

// Required controller modules
// var events_controller = require('../../controllers/views/events');

// Routes

// Default handler
router.get('/', function(req, res, next) {
    res.statusCode = 501;
    res.json({"Error":"Not Implemented"});
  });

module.exports = router;