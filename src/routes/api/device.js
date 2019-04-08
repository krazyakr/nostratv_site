var express = require('express');
var router = express.Router();

// Required controller modules
var controller = require('../../controllers/api/device');

// Routes

// Default handler
router.get('/', function (req, res, next) {
  res.statusCode = 501;
  res.json({ "Error": "Not Implemented" });
});

// Get Generic File
router.get('/file/:fileID', controller.getGenericFile);

// Get Device commands
router.get('/:deviceID/:secret/commands/:version', controller.getDeviceCommands);

// Get Device file
router.get('/:deviceID/:secret/file/:fileID', controller.getDeviceFile);

// Get Device IPTV
router.get('/:deviceID/:secret/iptv', controller.getDeviceIPTV);

module.exports = router;