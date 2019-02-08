var vodClient = require('../../business/vod/vodClient');

exports.doLogin = function (req, res) {
    statusCode = 200;
    errorMsg = "Unexpected error";

    //TODO: request authentication with client key

    var jsonRequest = req.body;
    var loginData = vodClient.doLogin(jsonRequest.username, jsonRequest.password);

    if (statusCode == 200) {
        res.statusCode = statusCode;
        res.json(loginData);
    }
    else {
        res.statusCode = statusCode;
        res.json({ "Error": errorMsg.toString() });
    }
}

exports.getMovies = function (req, res) {
    statusCode = 200;
    errorMsg = "Unexpected error";

    //TODO: request authentication with client key

    var data = vodClient.getMovies(req.headers.token);

    if (statusCode == 200) {
        res.statusCode = statusCode;
        res.json(data);
    }
    else {
        res.statusCode = statusCode;
        res.json({ "Error": errorMsg.toString() });
    }
}

exports.getMovie = function (req, res) {
    statusCode = 200;
    errorMsg = "Unexpected error";

    //TODO: request authentication with client key

    var data = vodClient.getMovie(req.headers.token, req.query.itemId);

    if (statusCode == 200) {
        res.statusCode = statusCode;
        res.json(data);
    }
    else {
        res.statusCode = statusCode;
        res.json({ "Error": errorMsg.toString() });
    }
}

exports.getVideo = function( request, response ) {
    statusCode = 200;
    errorMsg = "Unexpected error";

    //TODO: request authentication with client key

    var data = vodClient.getVideo(request.headers.token, request.query.itemId, request.query.type);

    if (statusCode == 200) {
        response.statusCode = statusCode;
        response.json(data);
    }
    else {
        response.statusCode = statusCode;
        response.json({ "Error": errorMsg.toString() });
    }
}