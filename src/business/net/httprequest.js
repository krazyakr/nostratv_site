const got = require("got");
var http = require("http");
var https = require("https");
var request = require('sync-request');

exports.getHeaders = function( extraHeaders = {} ){
    // headers = {
    //     'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
    //     'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    // }

    headers = {
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36",
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
        // "accept-encoding": "gzip, deflate, br",
        "accept-language": "en-GB,en;q=0.9,en-US;q=0.8,pt-PT;q=0.7,pt;q=0.6"
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
 * @param address {string} address
 * @param callback {function} callback to pass the results JSON object(s) back
 */
exports.getHTMLASync = function (address, onResult, onError) {
    // console.debug("rest::getHTML");
    const response = got(address)
        .then((response) => {
            // console.debug(response);
            onResult(response.statusCode, response.body);
        })
        .catch((err) => {
            // console.error(err);
            onError(err);
        });
};

/**
 * getHTMLSync:  REST get request returning HTML object(s)
 * @param url: URL object
 * @return: returns the HTML content
 */
exports.getHTMLSync = function( url, myHeaders = {} ) {
    console.debug('request: ' + url.toString());
    // console.debug(myHeaders);

    var res = request('GET', url.toString(), {
        headers: myHeaders,
    });
    
    return { 'statusCode': res.statusCode, 'content': res.getBody('utf8'), 'headers': res.headers };
};

/**
 * postJSON:  REST POST request returning the response
 * @param url: URL object
 * @param json: JSON object
 * @return: returns the response
 */
exports.postJSON = function( url, json, myHeaders = {} ) {
    console.debug('request: ' + url.toString());
    var res = request('POST', url.toString(), {
        headers: myHeaders,
        json: json
    });
    // console.log(res.getBody('utf8'));
    return { 'statusCode': res.statusCode, 'content': res.getBody('utf8') };
};

/**
 * postJSON:  REST POST request returning the response
 * @param url: URL object
 * @param data: data for POST Body
 * @return: returns the response
 */
exports.postData = function( url, data, myHeaders = {} ) {
    console.debug('request: ' + url.toString());
    // console.debug('Body: ' + data);
    var res = request('POST', url.toString(), {
        headers: myHeaders,
        body: data
    });
    // console.log(res.getBody('utf8'));
    return { 'statusCode': res.statusCode, 'content': res.getBody('utf8') };
};