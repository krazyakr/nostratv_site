var express = require('express');
var router = express.Router();

router.use('/events', require('./events'));
router.use('/playlist', require('./playlist'));
router.use('/device', require('./device'));

module.exports = router;