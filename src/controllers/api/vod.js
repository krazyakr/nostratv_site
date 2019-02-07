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
        res.json({});
    }
    else {
        res.statusCode = statusCode;
        res.json({ "Error": errorMsg.toString() });
    }
}