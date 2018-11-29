var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'NOStraTV Extras' });
});

/* GET NFL page. */
router.get('/events/nfl', function(req, res, next) {
  res.render('events/nfl', { title: 'NOStraTV Extras - NFL Games' });
});

module.exports = router;
