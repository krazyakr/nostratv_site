const url = require('url');
const HTTPRequest = require("../net/httprequest");
// const DomParser = require('dom-parser');
// var cache = require('memory-cache');

const API_BASE_URL = "http://mpapi.ml/apinew/"

exports.doLogin = function(username, password){
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:43.0) Gecko/20100101 Firefox/43.0', 
        'Accept-Charset': 'utf-8;q=0.7,*;q=0.7', 
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    data = 'username='+username+'&password='+password;

    console.debug(encodeURI(data));
    jsonResponse = HTTPRequest.postData(new URL( API_BASE_URL + 'login.php' ), encodeURI(data), headers );
    console.debug(jsonResponse);

    return null;
}