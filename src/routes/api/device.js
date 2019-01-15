var express = require('express');
var router = express.Router();

// Required controller modules
var controller = require('../../controllers/api/device');

// Routes

// Default handler
router.get('/', function(req, res, next) {
    res.statusCode = 501;
    res.json({"Error":"Not Implemented"});
  });

// Get Generic File
router.get('/file/:fileID', controller.getGenericFile );

// Get Device commands
router.get('/:DeviceID/commands', function(req, res, next) {
    res.statusCode = 501;
    res.json({"Error":"Not Implemented"});
  });

// Get Device file
router.get('/:DeviceID/file/:FileID', function(req, res, next) {
    res.statusCode = 501;
    res.json({"Error":"Not Implemented"});
  });

module.exports = router;