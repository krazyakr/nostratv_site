var express = require('express');
var router = express.Router();
var Auth = require('../auth');

// Require controller modules
var events_controller = require('../../controllers/views/events');

// Routes

/* GET Events page. */
router.get('/', Auth.Required, function (req, res, next) {
    res.render('events/index', { title: 'NOStraTV' });
});

/* GET Live TV page. */
router.get('/livetv', Auth.Required, events_controller.livetvChannels);

// NFL Events page
router.get('/nfl', Auth.Required, events_controller.nfl);

// NFL Event Game Detail
router.get('/nfl/:uid', Auth.Required, events_controller.nfl_game);

module.exports = router;