var Parser_NFLFullHD = require("../../business/parsers/parser_nflfullhd");

// GET /events/ - get list of existing events
exports.event_list = function (req, res) {
    var result = {"events":[]};
    res.json(result);
};

// GET /events/:source - get list of existing events
exports.event_list_by_source = function (req, res) {
    if (req.params.source == 'nflfullhd') {
        Parser_NFLFullHD.getEvents(function (statusCode, result) {
            res.statusCode = statusCode;
            res.json(result);
        });
    }
    else {
        res.statusCode = 404;
        res.json({"error":"Unknown source"});
    }
};

// GET /events/:source/:uid - get event details and streams list
exports.event_details_by_source = function (req, res) {
    if (req.params.source == 'nflfullhd') {
        Parser_NFLFullHD.getEventDetails(req.params.uid, function (statusCode, result) {
            res.statusCode = statusCode;
            res.json(result);
        });
    }
    else {
        res.statusCode = 404;
        res.json({"error":"Unknown source"});
    }
};

// GET /events/:source/:uid/:stream - get event stream
exports.event_stream_by_source = function (req, res) {
    if (req.params.source == 'nflfullhd') {
        Parser_NFLFullHD.getEventStream(req.params.uid, req.params.stream, function (statusCode, result) {
            res.statusCode = statusCode;
            res.json(result);
        });
    }
    else {
        res.statusCode = 404;
        res.json({"error":"Unknown source"});
    }
};