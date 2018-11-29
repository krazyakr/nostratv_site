var express = require('express');
var router = express.Router();

// Require controller modules
var events_controller = require('../../controllers/api/event');

// Routes

/* GET events listing. */
router.get('/', events_controller.event_list);

/* GET events listing by source. */
router.get('/:source', events_controller.event_list_by_source);

/* GET event details by source. */
router.get('/:source/:uid', events_controller.event_details_by_source);

/* GET event stream by source. */
router.get('/:source/:uid/:stream', events_controller.event_stream_by_source);

module.exports = router;
