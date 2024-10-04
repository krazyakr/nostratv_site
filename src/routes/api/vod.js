var express = require('express');
var router = express.Router();

// Require controller modules
var controller = require('../../controllers/api/vod');

// Routes

// Default handler
router.get('/', function (req, res, next) {
    res.statusCode = 501;
    res.json({ "Error": "Not Implemented" });
});

// POST request
router.post('/', function (req, res, next) {
    res.statusCode = 501;
    res.json({ "Error": "Not Implemented" });
});

// POST login request
router.post('/login', controller.doLogin);

// GET Get movies paginated
router.get('/movies', controller.getMovies);

// POST Search movies paginated
router.post('/searchMovies', controller.searchMovies);

// GET Get a movie data
router.get('/movie', controller.getMovie);

// GET Get the video stream of a movie
router.get('/video', controller.getVideo);

module.exports = router;