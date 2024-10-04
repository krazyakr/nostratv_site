var Parser_NFLFullHD = require("../../business/parsers/parser_nflfullhd");
var Parser_ArenaVision = require('../../business/parsers/parser_arenavision');
var cache = require('memory-cache');
var acestreamHost = process.env.ACESTREAM_HOST;

exports.nfl = function (req, res) {
    var title = 'NOStraTV - NFL Games';

    Parser_NFLFullHD.getEvents(function (statusCode, result) {
        res.render('events/nfl', { title: title, list: result });
    });
}

exports.nfl_game = function (req, res) {
    Parser_NFLFullHD.getEventDetails(req.params.uid, function (statusCode, result) {
        var event = {};
        event.title = result.event.title;
        event.title = event.title.replace('Replay Full Game','');
        event.sources = [];

        result.event.streams.forEach(element => {
            var source = {};
            source.name = element.name;
            source.links = [];
            element.links.forEach(link => {
                Parser_NFLFullHD.getEventStream(result.event.id, link.id, function (statusCode2, result2) {
                    if (result2.stream.type == 'stream') {
                        result2.stream.links.forEach(link => {
                            if (link.name == 'sd') {
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

        var playlist = "#EXTM3U\n";
        var index = 1;
        event.sources.forEach(element => {
            element.links.forEach(link => {
                var item = "#EXTINF:0," + event.title + " Part " + index + "\n" + link + "\n"
                playlist = playlist + item
                index = index + 1;
            });
        });

        res.set('Content-Disposition', 'attachment; filename="nfl_game.m3u"')
        res.send(playlist);
    });
}

exports.livetvChannels = function(request, response){
    var title = 'NOStraTV - Live TV';
    
    Parser_ArenaVision.GetChannels(function (statusCode, result) {
        list = [];
        for(var streamId in result.channels)
        {
            element = result.channels[streamId];
            element.link = acestreamHost.replace("{channel_id}",element.streamID);
            list.push(element);
        }
        
        response.render('events/livetv', { title: title, list: list });
    });
}