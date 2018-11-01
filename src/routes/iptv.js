var express = require('express');
var router = express.Router();

// Require controller modules
var controller = require('../controllers/iptv');

// Routes

/* GET events listing. */
router.get('/', controller.iptv_list);

module.exports = router;
