var express = require('express');
var router = express.Router();
var Auth = require('../auth');

// Require controller modules
var DevicesController = require('../../controllers/views/DevicesController');

// Routes

// Index page
router.get('/', Auth.Required, DevicesController.Devices);

// Device page
router.get('/:deviceID', Auth.Required, DevicesController.Device);

// Save Device
router.post('/:deviceID/save', Auth.Required, DevicesController.SaveDevice);

module.exports = router;