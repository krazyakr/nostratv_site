var express = require('express');
var router = express.Router();

// Require controller modules
var controller = require('../controllers/playlist');

// Routes

/* GET M3U playlist with IPTV channels */
router.get('/', controller.channels_list);

/* GET M3U playlist for :category with IPTV channels */
router.get('/:category', controller.channels_list);

module.exports = router;
