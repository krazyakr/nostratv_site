const url = require('url');
const HTTPRequest = require("../../net/httprequest");

exports.decode = function(link) {
    var result = "";
    var headers = { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:43.0) Gecko/20100101 Firefox/43.0' };

    var html = HTTPRequest.getHTMLSync(link, headers).content;
    if (html.indexOf('{type:"video/mp4",src:') > 0) {
        start = html.indexOf('(', html.indexOf('{type:"video/mp4",src:')) + 2;
        end = html.indexOf("'", start + 1);
        var encoded = html.substring(start, end);

        start = html.indexOf(',', end) + 1;
        end = html.indexOf(")", start);
        var code = html.substring(start, end);

        var source = decodeHelper(encoded, code);
        if (source.endsWith('@')) source = source.slice(0, -1);
        
        source = 'http:' + source;
        result = { 'stream': source, 'subtitle':null };
    }

    return result;
}

function myRange(start, stop, step) {
    if (typeof stop == 'undefined') {
        // one param defined
        stop = start;
        start = 0;
    }

    if (typeof step == 'undefined') {
        step = 1;
    }

    if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
        return [];
    }

    var result = [];
    for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
        result.push(i);
    }

    return result;
}

function decodeHelper(encoded, code) {
    _0x59b81a = ""
    k = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
    k = k.split("").reverse().join("");

    count = 0;
    var range = myRange(0, encoded.length - 1);
    for (index in range) {
        while (count <= encoded.length - 1) {
            _0x4a2f3a = k.indexOf(encoded[count]);
            count += 1;
            _0x29d5bf = k.indexOf(encoded[count]);
            count += 1;
            _0x3b6833 = k.indexOf(encoded[count]);
            count += 1;
            _0x426d70 = k.indexOf(encoded[count]);
            count += 1;

            _0x2e4782 = ((_0x4a2f3a << 2) | (_0x29d5bf >> 4));
            _0x2c0540 = (((_0x29d5bf & 15) << 4) | (_0x3b6833 >> 2));
            _0x5a46ef = ((_0x3b6833 & 3) << 6) | _0x426d70;
            _0x2e4782 = _0x2e4782 ^ code;

            _0x59b81a = String(_0x59b81a) + String.fromCharCode(_0x2e4782);

            if (_0x3b6833 != 64) _0x59b81a = String(_0x59b81a) + String.fromCharCode(_0x2c0540);
            if (_0x3b6833 != 64) _0x59b81a = String(_0x59b81a) + String.fromCharCode(_0x5a46ef);
        }
    }

    return _0x59b81a
}