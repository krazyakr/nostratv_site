var Parser_NFLFullHD = require("../../business/parsers/parser_nflfullhd");

exports.nfl = function (req, res) {
    var title = 'NOStraTV Extras - NFL Games';

    Parser_NFLFullHD.getEvents(function (statusCode, result) {
        res.render('events/nfl', { title: title, list: result });
    });
}

exports.nfl_game = function (req, res) {
    title = 'NOStraTV Extras - NFL Games';

    Parser_NFLFullHD.getEventDetails(req.params.uid, function (statusCode, result) {
        var event = {};
        event.title = result.event.title;
        event.sources = [];

        result.event.streams.forEach(element => {
            var source = {};
            source.name = element.name;
            source.links = [];
            element.links.forEach(link => {
                Parser_NFLFullHD.getEventStream(result.event.id, link.id, function (statusCode2, result2) {
                    if (result2.stream.type == 'stream') {
                        result2.stream.links.forEach(link => {
                            if (link.name == 'hd') {
                                source.links = source.links.concat(link.url);
                            }
                        });
                    }
                })
            });
            if (source.links.length > 0) {
                event.sources = event.sources.concat(source);
            }
        });

        res.render('events/nflgame', { title: title, game: event });
    });
}