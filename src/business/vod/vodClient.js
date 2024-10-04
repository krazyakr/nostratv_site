// const URL = require('url');
const HTTPRequest = require("../net/httprequest");
const streamangoHandler = require("./sources/streamango");
const Mapper = require("./vodMapper");

const API_BASE_URL = "http://mrapi.xyz/apinew/";
const API_SUBS_BASE_URL = "http://mrpiracy.gq/"

var headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:43.0) Gecko/20100101 Firefox/43.0',
    'Accept-Charset': 'utf-8;q=0.7,*;q=0.7',
    'Content-Type': 'application/json'
};

exports.doLogin = function (username, password) {
    _headers = headers;
    _headers['Content-Type'] = 'application/x-www-form-urlencoded';

    data = 'username=' + username + '&password=' + password;

    jsonResponse = HTTPRequest.postData(
        new URL(API_BASE_URL + 'login.php'),
        encodeURI(data),
        headers);

    var response = {
        "code": "0",
        "message": "",
        "username": "",
        "token": "",
        "refresh": ""
    };

    if (jsonResponse.statusCode != 200) {
        response.code = 5;
        response.message = "Unknown error (" + jsonResponse.statuscode + ")";
    }
    else {
        var content = JSON.parse(jsonResponse.content);

        if (content.codigo != null && content.codigo == 204) {
            response.code = 1;
            response.message = "Authentication error"
        }
        else {
            response.code = 0;
            response.username = content.username;
            response.token = content.cookie;
            response.refresh = content.expira;
        }
    }

    return response;
}

exports.getMovies = function (token, page=1) {
    _headers = headers;
    _headers.Cookie = 'username=' + token;

    data = HTTPRequest.getHTMLSync(
        new URL(API_BASE_URL + 'filmes.php?page=' + page),
        _headers
    );

    var response = {
        "code": "0",
        "message": ""
    };

    if (data.statusCode != 200) {
        response.code = 5;
        response.message = "Unknown error (" + data.statuscode + ")";
    }
    else {
        var content = JSON.parse(data.content);
        // console.log(content.meta.paginacao);

        if (content.codigo != null && content.codigo == 204) {
            response.code = 1;
            response.message = "Authentication error"
        }
        else {
            response = Mapper.mapMovies(content);
            response.code = 0;
            response.message = 'Success';
            response.pagination = {
                "current": content.meta.current,
                "total": content.meta.total
            }
        }
    }

    return response;
}

exports.searchMovies = function (token, searchTerm, page=1) {
    _headers = headers;
    _headers.Cookie = 'username=' + token;

    requestUrl = API_BASE_URL + 'filmes.php?action=pesquisa&page=' + page;
    requestData = "qualidade=2&texto="+searchTerm;
    
    data = HTTPRequest.postData( 
        requestUrl,
        encodeURI(requestData),
        _headers
    );

    var response = {
        "code": "0",
        "message": ""
    };

    if (data.statusCode != 200) {
        response.code = 5;
        response.message = "Unknown error (" + data.statuscode + ")";
    }
    else {
        var content = JSON.parse(data.content);
        // console.log(content.meta.paginacao);

        if (content.codigo != null && content.codigo == 204) {
            response.code = 1;
            response.message = "Authentication error"
        }
        else {
            response = Mapper.mapMovies(content);
            response.code = 0;
            response.message = 'Success';
            response.pagination = {
                "current": content.meta.current,
                "total": content.meta.total
            }
        }
    }

    return response;
}

exports.getMovie = function (token, itemId) {
    _headers = headers;
    _headers.Cookie = 'username=' + token;

    data = HTTPRequest.getHTMLSync(
        new URL(API_BASE_URL + 'filmes.php?action=links&idFilme=' + itemId),
        _headers);

    var response = {
        "code": "0",
        "message": ""
    };

    if (data.statusCode != 200) {
        response.code = 5;
        response.message = "Unknown error (" + data.statuscode + ")";
    }
    else {
        var content = JSON.parse(data.content);

        if (content.codigo != null && content.codigo == 204) {
            response.code = 1;
            response.message = "Authentication error"
        }
        else {
            response = Mapper.mapMovie(content);
            response.links = null;

            response.code = 0;
            response.message = 'Success';
        }
    }

    return response;
}

exports.getVideo = function (token, itemId, type) {
    var response = {
        "code": "4",
        "message": "Type not supported"
    };

    switch(type){
        case 'movie':
            response = getMovieStream(token, itemId);
    }

    return response;
}

function getMovieStream(token, itemId){
    _headers = headers;
    _headers.Cookie = 'username=' + token;

    data = HTTPRequest.getHTMLSync(
        new URL(API_BASE_URL + 'filmes.php?action=links&idFilme=' + itemId),
        _headers);

    var response = {
        "code": "0",
        "message": ""
    };

    if (data.statusCode != 200) {
        response.code = 5;
        response.message = "Unknown error (" + data.statuscode + ")";
    }
    else {
        var content = JSON.parse(data.content);

        if (content.codigo != null && content.codigo == 204) {
            response.code = 1;
            response.message = "Authentication error"
        }
        else {
            movie = Mapper.mapMovie(content);

            linkData = getStream(movie.links);
            if(linkData == null) {
                response.code = 2;
                response.message = 'Supported format not found';
            }
            else {
                handler = null;
                switch(linkData.source){
                    case 'streamango':
                        handler = streamangoHandler;
                        break;
                    default:
                        handler = streamangoHandler;
                }
                stream = handler.decode(linkData.url);
                response.video = stream.stream;
                response.subtitle = (stream.subtitle != null) ? stream.subtitle : getSubtitle(movie);
                response.code = 0;
                response.message = 'Success';
            }
        }
    }

    return response;
}

function getStream(links) {
    var result = null;

    links.forEach(element => {
        if (element.link.indexOf('streamango') > 0) result = { 'source': 'streamango', 'url': element.link };
    });

    return result;
}

function getSubtitle(movie){
    var result = null;

    if( movie.subtitle.indexOf('://')>0 || movie.subtitle == '' ){
        result = API_SUBS_BASE_URL + "subs/" + movie.IMDB;
    }
    else if(movie.subtitle != '' && movie.subtitle != 'semLegenda') {
        movie.subtitle = ( movie.subtitle.indexOf('.srt') > 0 ) ? movie.subtitle : movie.subtitle + '.srt';
        result = API_SUBS_BASE_URL + "subs/" + movie.subtitle;
    }

    return result;
}