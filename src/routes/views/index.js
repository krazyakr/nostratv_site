var express = require('express');
var router = express.Router();
var Auth = require('../auth');

router.use('/events', require('./events'));
router.use('/devices', require('./DevicesRouter'));

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'NOStraTV Extras' });
});

/* GET Login page. */
router.get('/login', function (req, res, next) {
    res.render('login', { title: 'NOStraTV Extras' });
});

router.get('/logout', function(req, res){
    req.logOut();
    res.redirect('/');
  });

module.exports = router;
