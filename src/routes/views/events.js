var express = require('express');
var router = express.Router();

// Require controller modules
var events_controller = require('../../controllers/views/events');

// Routes

// NFL Events page
router.get('/nfl', events_controller.nfl);

// NFL Event Game Detail
router.get('/nfl/:uid', events_controller.nfl_game);

module.exports = router;