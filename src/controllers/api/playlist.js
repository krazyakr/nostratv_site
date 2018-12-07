var Parser_ArenaVision = require('../../business/parsers/parser_arenavision');
var Parser_NFLFullHD = require("../../business/parsers/parser_nflfullhd");

// GET /api/playlist 
// Get the list of all IPTV channels in M3U format with all categories included
exports.channels_list = function (req, res) {
    Parser_ArenaVision.GetChannels(function (statusCode, result) {
        res.statusCode = statusCode;

        var playlist = "#EXTM3U\n";

        result.channels.forEach(element => {
            var item = "#EXTINF:0," + element.name + "\n" + element.stream + "\n"
            playlist = playlist + item
        });

        res.set('Content-Disposition', 'attachment; filename="channels_playlist.m3u"')
        res.send(playlist);
    });
};

exports.channels_list_by_category = function (req, res) {
    if (req.params.category == 'nflgames') {
        Parser_NFLFullHD.getEvents(function (statusCode, result) {
            res.statusCode = statusCode;

            var playlist = "#EXTM3U\n";

            result.events.forEach(element => {
                try {
                    Parser_NFLFullHD.getEventDetails(element.id, function (eventStatusCode, eventDetails) {
                        var event = {};
                        event.title = eventDetails.event.title;
                        event.title = event.title.replace('Replay Full Game', '');
                        event.sources = [];

                        var streamElement = eventDetails.event.streams[1];
                        var source = {};
                        source.name = streamElement.name;
                        source.links = [];
                        streamElement.links.forEach(link => {
                            Parser_NFLFullHD.getEventStream(element.id, link.id, function (statusCode2, result2) {
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

                        var index = 1;
                        event.sources.forEach(element => {
                            element.links.forEach(link => {
                                var item = "#EXTINF:0," + event.title + " Part " + index + "\n" + link + "\n"
                                playlist = playlist + item
                                index = index + 1;
                            });
                        });

                    });

                } catch (error) {
                    console.error('Error parsing ' + element.id, error);
                }
            });

            res.set('Content-Disposition', 'attachment; filename="nflgames_playlist.m3u"');
            res.send(playlist);
        });
    }
    else {
        Parser_ArenaVision.GetChannels(function (statusCode, result) {
            res.statusCode = statusCode;

            var playlist = "#EXTM3U\n";

            result.channels.forEach(element => {
                var item = "#EXTINF:0," + element.name + "\n" + element.stream + "\n"
                playlist = playlist + item
            });

            res.set('Content-Disposition', 'attachment; filename="channels_playlist.m3u"')
            res.send(playlist);
        });
    }
};