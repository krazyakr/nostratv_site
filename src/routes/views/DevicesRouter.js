var express = require('express');
var router = express.Router();

// Require controller modules
var DevicesController = require('../../controllers/views/DevicesController');

// Routes

// Index page
router.get('/', DevicesController.Devices);

// Device page
router.get('/:deviceID', DevicesController.Device);

// Save Device
router.post('/:deviceID/save', DevicesController.SaveDevice);

module.exports = router;