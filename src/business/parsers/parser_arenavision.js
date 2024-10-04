const url = require('url');
const HTTPRequest = require("../net/httprequest");
const DomParser = require('dom-parser');
var cache = require('memory-cache');

const baseUrl = "https://arenavision.in";
const guidePath = "/guide";
const extraHeaders = {'cookie':'beget=begetok'};

var parser = new DomParser();


function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function GetAceStreamLink( link ){
    var result = '';

    if (cache.get(link) != null) {
        console.log('Found element ' + link + ' in cache');
        result = cache.get(link);
    }
    else {
        var _response = HTTPRequest.getHTMLSync(new URL(link), HTTPRequest.getHeaders(extraHeaders));
        var pageDOM = parser.parseFromString(_response.content);

        if (_response.statusCode == 200) {
            var holderElement = pageDOM.getElementsByClassName('auto-style1');
            holderElement.forEach(element => {
                var item = element.getElementsByTagName('a')[1];
                if (item != null) {
                    result = item.getAttribute('href').replace("acestream://","");
                    cache.put(link, result, (12 + getRandomInt(4)) * 60 * 60 * 1000, function(key, value){
                        console.log('Removing cache for ' + key);
                    });
                }
            });
        }
    }

    return result;
}

exports.GetChannels = function( callback ){
    var channels = [];

    var _response = HTTPRequest.getHTMLSync(new URL( baseUrl ), HTTPRequest.getHeaders( /*extraHeaders*/ ) );
    var pageDOM = parser.parseFromString(_response.content);

    if (_response.statusCode == 200) {
        var channelsFromMenu = pageDOM.getElementsByClassName('expanded');
        channelsFromMenu.forEach(element => {
            var channelsFromExpanded = element.getElementsByClassName('leaf');
            channelsFromExpanded.forEach(innerElement => {
                try {
                    var item = innerElement.firstChild;

                    var name = item.textContent;
                    var link = item.getAttribute('href');

                    var streamID = GetAceStreamLink(baseUrl + link);

                    if(!channels[streamID])
                    {
                        var channel = {
                            'name': name,
                            'streamID': streamID
                        };
                        channels[streamID] = channel;
                    }
                } catch (error) {
                    console.debug(error);
                }
            })
        });
    }

    var result = { 'channels': channels };
    // console.debug("Result\n" + JSON.stringify(result));
    callback(_response.statusCode, result);
}