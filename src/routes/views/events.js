var express = require('express');
var router = express.Router();

// Require controller modules
var events_controller = require('../../controllers/views/events');

// Routes

// NFL Events page
router.get('/nfl', events_controller.nfl);

module.exports = router;