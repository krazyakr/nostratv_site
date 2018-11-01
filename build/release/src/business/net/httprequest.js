var http = require("http");
var https = require("https");
var request = require('sync-request');

exports.getHeaders = function( extraHeaders = {} ){
    headers = {
        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    }

    headers = Object.assign(headers, extraHeaders);

    return headers;
}

exports.getOptionsFromURL = function (url, isGet = true, isJson = false) {
    var options = {
        host: url.hostname,
        port: url.protocol == 'https:' ? 443 : 80,
        path: url.pathname + url.search,
        method: isGet ? 'GET' : 'POST',
        headers: {
            'Content-Type': isJson ? 'application/json' : 'application/html'
        }
    };

    return options;
}

/**
 * getJSON:  REST get request returning JSON object(s)
 * @param options: http options object
 * @param callback: callback to pass the results JSON object(s) back
 */
exports.getJSON = function (options, onResult) {
    console.debug("rest::getJSON");

    var port = options.port == 443 ? https : http;
    var req = port.request(options, function (res) {
        var output = '';
        console.debug(options.host + ':' + res.statusCode);
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function () {
            var obj = JSON.parse(output);
            onResult(res.statusCode, obj);
        });
    });

    req.on('error', function (err) {
        //res.send('error: ' + err.message);
    });

    req.end();
};

/**
 * getHTML:  REST get request returning HTML object(s)
 * @param options: http options object
 * @param callback: callback to pass the results JSON object(s) back
 */
exports.getHTMLASync = function (options, onResult) {
    console.debug("rest::getHTML");

    var port = options.port == 443 ? https : http;
    var req = port.request(options, function (res) {
        var output = '';
        console.debug(options.host + ':' + res.statusCode);
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function () {
            // var obj = HTML.parse(output);
            onResult(res.statusCode, output);
        });
    });

    req.on('error', function (err) {
        //res.send('error: ' + err.message);
    });

    req.end();
};

/**
 * getHTMLSync:  REST get request returning HTML object(s)
 * @param url: URL object
 * @return: returns the HTML content
 */
exports.getHTMLSync = function( url, myHeaders = {} ) {
    console.debug('request: ' + url.toString());
    var res = request('GET', url.toString(), {
        headers: myHeaders,
    });
    // console.log(res.getBody('utf8'));
    return { 'statusCode': res.statusCode, 'content': res.getBody('utf8') };
};