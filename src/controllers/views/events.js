var Parser_NFLFullHD = require("../../business/parsers/parser_nflfullhd");

exports.nfl = function(req, res) {
    title = 'NOStraTV Extras - NFL Games';

    Parser_NFLFullHD.getEvents(function (statusCode, result) {
        res.statusCode = statusCode;
        
        res.render('events/nfl', { title: title, list: result });
    });
}