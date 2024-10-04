const url = require('url');
const HTTPRequest = require("../net/httprequest");
const DomParser = require('dom-parser');
var cache = require('memory-cache');

const baseUrl = "https://www.nflfullhd.com/";
const streamsBaseUrl = "https://fishker.com/";
const sourcePath = "/api/events/nflfullhd/";

var parser = new DomParser();

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function getOptionsFromURL(url, isGet = true, isJson = false) {
    // console.log('url: ' + url.toString());

    var options = {
        host: url.hostname,
        port: url.protocol == 'https:' ? 443 : 80,
        path: url.pathname + url.search,
        method: isGet ? 'GET' : 'POST',
        headers: {
            'Content-Type': isJson ? 'application/json' : 'application/html'
        }
    };

    // console.log('options: ' + JSON.stringify(options));

    return options;
}

exports.getEvents = function (callback) {
    var events = [];

    var _response = HTTPRequest.getHTMLSync(new URL(baseUrl));
    var pageDOM = parser.parseFromString(_response.content);

    if (_response.statusCode == 200) {
        var events_container = pageDOM.getElementsByClassName('entry-content-movie big-box');
        events_container.forEach(element => {
            var node = element.getElementsByTagName('h2')[0].getElementsByTagName('a')[0];

            var link = node.getAttribute('href');
            var title = node.textContent;

            var response = {};
            response.title = title;
            response.id = (new URL(link)).pathname.replace(/\//g, '');
            response.self = sourcePath + response.id;

            events.push(response);
        });
    }

    var result = { 'events': events };
    // console.debug("Result\n" + JSON.stringify(result));
    callback(_response.statusCode, result);
}

/**
 * getEventDetails:  parse the event details from the provided uid
 * @param uid: uid of the event
 * @return: returns the event details object. NULL if an error is generated
 */
exports.getEventDetails = function (uid, callback) {
    var result = {};
    var _url = baseUrl + uid;
    _url.endsWith('/') ? _url = _url : _url = _url + '/';

    var url = new URL(_url);

    var response = HTTPRequest.getHTMLSync(url);
    if (response.statusCode == 200) {
        var pageDOM = parser.parseFromString(response.content);
        result.title = pageDOM.getElementsByClassName('entry-title')[0].textContent;
        result.date = pageDOM.getElementsByClassName('entry-date published updated')[0].getAttribute('datetime');
        result.id = url.pathname.replace(/\//g, '');
        result.self = sourcePath + result.id;

        var servers = [];
        var divElement = pageDOM.getElementsByClassName('entry-content entry content')[0];
        var childnodes = divElement.childNodes;
        childnodes.forEach(element => {
            if (element.nodeName == 'p') {
                var innerChilds = element.childNodes;
                var stream = null;
                for (let index = 0; index < innerChilds.length; index++) {
                    const innerElem = innerChilds[index];

                    switch (innerElem.nodeName) {
                        case 'strong':
                            if (stream != null) {
                                servers.push(stream);
                            }
                            stream = {};
                            stream.name = innerElem.textContent;
                            stream.links = [];
                            break;
                        case 'a':
                            if (stream != null) {
                                var lnk = {};
                                var _url = new URL(innerElem.getAttribute('href'));
                                lnk.id = _url.pathname.replace(/\//g, '');
                                lnk.self = result.self + '/' + lnk.id;
                                stream.links.push(lnk);
                            }
                        default:
                            break;
                    }
                }
                if (stream != null) {
                    servers.push(stream);
                }
            }
        });

        result.streams = servers;
    }
    else result = null;

    result = { 'event': result };
    // console.debug("Result\n" + JSON.stringify(result));
    callback(response.statusCode, result);
}

/**
 * getEventStream:  get the stream url for the event and stream requested
 * @param eventID: event uid
 * @param stream: stream uid
 * @return: returns the stream url object. NULL if an error is generated
 */
exports.getEventStream = function (eventID, stream, callback) {
    var result = {};
    var statusCode;

    externalUrl = getStreamExternalUrl(eventID, stream);
    // console.log(externalUrl);

    if(!externalUrl)
    {
        statusCode = 404;
    }
    else {
        if( cache.get(externalUrl) ){
            console.log('Found element ' + url + ' in cache');
            result = cache.get(url);
            statusCode = 200;
        }
        else {
            var response = HTTPRequest.getHTMLSync(externalUrl);
            if (response.statusCode == 200) {
                var pageDOM = parser.parseFromString(response.content);
                var iframeNode = pageDOM.getElementsByTagName('iframe')[0];
                var iframeLink = iframeNode.getAttribute('src');
                iframeLink.startsWith('//') ? iframeLink = 'http:' + iframeLink : iframeLink = iframeLink;

                var streamUrl = parseContentForStreamUrl(iframeLink);

                if (streamUrl != null) {
                    result.type = streamUrl.type;
                    result.links = streamUrl.links;
                }
                else {
                    result.type = 'embebed';
                    result.url = iframeLink;
                }
                statusCode = response.statusCode;
                
                cache.put(url, result, (12 + getRandomInt(4)) * 60 * 60 * 1000, function(key, value){
                    console.log('Removing cache for ' + key);
                });
            }
            else result = null;
        }
    }

    result = { 'stream': result };
    // console.debug("Result\n" + JSON.stringify(result));
    callback(statusCode, result);
}

function getStreamExternalUrl(eventID, stream) {
    var result = null;
    var _url = baseUrl + eventID;
    _url.endsWith('/') ? _url = _url : _url = _url + '/';

    var url = new URL(_url);
    var response = HTTPRequest.getHTMLSync(url);
    if (response.statusCode == 200) {
        var pageDOM = parser.parseFromString(response.content);
        var divElement = pageDOM.getElementsByClassName('entry-content entry content')[0];
        var childnodes = divElement.childNodes;
        childnodes.forEach(element => {
            if (element.nodeName == 'p') {
                var innerChilds = element.childNodes;
                for (let index = 0; index < innerChilds.length; index++) {
                    const innerElem = innerChilds[index];
                    switch (innerElem.nodeName) {
                        case 'a':
                            var _url = new URL(innerElem.getAttribute('href'));
                            _id = _url.pathname.replace(/\//g, '');
                            if(_id == stream){
                                result = _url;
                                return _url;
                            }
                            break;
                        default:
                            break;
                    }
                }
            }

        });
    }

    return result;
}

function parseContentForStreamUrl(url) {
    var result = null;

    url.startsWith('//') ? url = 'http:' + url : url = url;

    try {
        var response = HTTPRequest.getHTMLSync(new URL(url));
        if (response.statusCode == 200) {
            if (url.indexOf('ok.ru') > 0)
                result = parseContentFromOkRu(response.content);
        }
    } catch (error) {
        console.error(error);
    }
    
    return result;
}

function parseContentFromOkRu(content) {
    const Entities = require('html-entities').AllHtmlEntities;
    const entities = new Entities();

    var pageDOM = parser.parseFromString(content);

    var playerNode = pageDOM.getElementsByClassName('vid-card vid-card__fullscreen h-mod')[0].firstChild;
    var dataOptions = playerNode.getAttribute('data-options');

    var _node = JSON.parse(entities.decode(dataOptions));
    _node = JSON.parse(_node.flashvars.metadata);
    var _array = [];
    _node.videos.forEach(source => {
        _array.push({ 'name': source.name, 'url': source.url });
    });

    var result = { 'type': 'stream', 'links': _array };

    return result;
}