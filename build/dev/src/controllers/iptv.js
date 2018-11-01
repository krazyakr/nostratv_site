const HTTPRequest = require("../business/net/httprequest");

const jsonSource = "https://pastebin.com/raw/747LTLG0";

// GET /iptv/ - get list of iptv channels
exports.iptv_list = function (req, res) {
    HTTPRequest.getJSON(HTTPRequest.getOptionsFromURL(new URL(jsonSource), true, true), function (statusCode, result) {
        res.statusCode = statusCode;
        res.json(result);
    });
};