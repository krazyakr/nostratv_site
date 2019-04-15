var express = require('express');
var router = express.Router();

router.use('/events', require('./events'));
router.use('/devices', require('./DevicesRouter'));

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'NOStraTV Extras' });
});

module.exports = router;
