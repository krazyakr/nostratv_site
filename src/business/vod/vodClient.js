const url = require('url');
const HTTPRequest = require("../net/httprequest");

const API_BASE_URL = "http://mpapi.ml/apinew/";
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

exports.getMovies = function(token) {
    _headers = headers;
    _headers.Cookie = 'username=' + token;

    data = HTTPRequest.getHTMLSync(
        new URL(API_BASE_URL + 'filmes.php'),
        _headers);

    console.debug(data);

    return null;
}