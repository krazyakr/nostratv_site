var vodClient = require('../../business/vod/vodClient');

exports.doLogin = function (req, res) {
    console.debug(req.body);
    var body = JSON.parse(req.body);
    var response = vodClient.doLogin(body.username, body.password);

    if (response == null) {
        res.statusCode = 500;
        res.json({ "Error": "Internal Server Error" });
    }
}