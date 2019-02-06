var vodClient = require('../../business/vod/vodClient');

exports.doLogin = function (req, res) {
    console.debug(req.body);
    statusCode = 500;
    errorMsg = "Unexpected error";

    var jsonRequest = req.body;
    var response = vodClient.doLogin(jsonRequest.username, jsonRequest.password);

    if (statusCode == 200) {
        res.statusCode = statusCode;
        res.json("{'result':'result'}");
    }
    else {
        res.statusCode = statusCode;
        res.json({ "Error": errorMsg.toString() });
    }
}