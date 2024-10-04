var Parser_ArenaVision = require('../../business/parsers/parser_arenavision');
var Parser_NFLFullHD = require("../../business/parsers/parser_nflfullhd");
var cache = require('memory-cache');
var acestreamHost = process.env.ACESTREAM_HOST;

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

// GET /api/playlist 
// Get the list of all IPTV channels in M3U format with all categories included
exports.channels_list = function (req, res) {
    getChannelsArena(res);
};

exports.channels_list_by_category = function (req, res) {
    if (req.params.category == 'nflgames') {
        getEventsNFLGames(res);
    }
    else {
        getChannelsArena(res);
    }
};

function getEventsNFLGames(res) {
    const cache_key = 'nflgames_list';
    if (cache.get(cache_key)) {
        console.log('Found element ' + cache_key + ' in cache');
        playlist = cache.get(cache_key);
        statusCode = 200;
        res.statusCode = statusCode;
        res.set('Content-Disposition', 'attachment; filename="nflgames_playlist.m3u"');
        res.send(playlist);
    }
    else {
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
                        var streamElement = eventDetails.event.streams[0];
                        var source = {};
                        source.name = streamElement.name;
                        source.links = [];
                        streamElement.links.forEach(link => {
                            Parser_NFLFullHD.getEventStream(element.id, link.id, function (statusCode2, result2) {
                                if (result2.stream.type == 'stream') {
                                    result2.stream.links.forEach(link => {
                                        if (link.name == 'sd') {
                                            source.links = source.links.concat(link.url);
                                        }
                                    });
                                }
                            });
                        });
                        if (source.links.length > 0) {
                            event.sources = event.sources.concat(source);
                        }
                        var index = 1;
                        event.sources.forEach(element => {
                            element.links.forEach(link => {
                                var item = "#EXTINF:0 tvg-id=\"1\" tvg-name=\"Games\" group-title=\"" + event.title + "\"," + event.title + " Part " + index + "\n" + link + "\n";
                                playlist = playlist + item;
                                index = index + 1;
                            });
                        });
                    });
                }
                catch (error) {
                    console.error('Error parsing ' + element.id, error);
                }
            });
            cache.put(cache_key, playlist, (12 + getRandomInt(4)) * 60 * 60 * 1000, function (key, value) {
                console.log('Removing cache for ' + key);
            });
            res.set('Content-Disposition', 'attachment; filename="nflgames_playlist.m3u"');
            res.send(playlist);
        });
    }
}

function getChannelsArena(res) {
    const cache_key = 'channels_list';
    if (cache.get(cache_key)) {
        console.log('Found element ' + cache_key + ' in cache');
        playlist = cache.get(cache_key);
        statusCode = 200;
        res.statusCode = statusCode;
        res.set('Content-Disposition', 'attachment; filename="channels_playlist.m3u"');
        res.send(playlist);
    }
    else {
        Parser_ArenaVision.GetChannels(function (statusCode, result) {
            res.statusCode = statusCode;
            var playlist = "#EXTM3U\n";
            for(var streamId in result.channels)
            {
                element = result.channels[streamId];
                link = acestreamHost.replace("{channel_id}",element.streamID);
                var item = "#EXTINF:0 group-title=\"Arenavision Live TV\"," + element.name + "\n" + link + "\n";
                playlist = playlist + item;
            }
            
            cache.put(cache_key, playlist, (12 + getRandomInt(4)) * 60 * 60 * 1000, function (key, value) {
                console.log('Removing cache for ' + key);
            });
            res.set('Content-Disposition', 'attachment; filename="channels_playlist.m3u"');
            res.send(playlist);
        });
    }
}
