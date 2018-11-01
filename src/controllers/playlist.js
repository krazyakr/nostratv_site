var Parser_ArenaVision = require( '../business/parsers/parser_arenavision' );

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