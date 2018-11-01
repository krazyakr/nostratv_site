const url = require('url');
const HTTPRequest = require("../net/httprequest");
const DomParser = require('dom-parser');

const baseUrl = "http://arenavision.in";
const guidePath = "/guide";
const extraHeaders = {'cookie':'beget=begetok'};

var parser = new DomParser();

function GetAceStreamLink( link ){
    var result = '';

    var _response = HTTPRequest.getHTMLSync(new URL( link ), HTTPRequest.getHeaders( extraHeaders ) );
    var pageDOM = parser.parseFromString(_response.content);

    if (_response.statusCode == 200) {
        var holderElement = pageDOM.getElementsByClassName('auto-style1');
        holderElement.forEach( element => {
            var item = element.getElementsByTagName('a')[0];
            if(item != null) {
                result = item.getAttribute('href');
            }
        });
    }

    return result;
}

exports.GetChannels = function( callback ){
    var channels = [];

    var _response = HTTPRequest.getHTMLSync(new URL( baseUrl ), HTTPRequest.getHeaders( extraHeaders ) );
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

                    var streamLink = GetAceStreamLink(link);

                    var channel = {
                        'name': name,
                        'stream': streamLink
                    };
                    channels.push(channel);
                } catch (error) {
                    // console.debug(error);
                }
            })
        });
    }

    var result = { 'channels': channels };
    // console.debug("Result\n" + JSON.stringify(result));
    callback(_response.statusCode, result);
}