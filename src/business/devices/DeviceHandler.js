// const basePath = '/usr/local/nostratv_site/';
var basePath = process.env.FS_PATH + '/devices/';

function readFile(filePath) {
  const fs = require('fs');

  let rawdata = fs.readFileSync(basePath + filePath, 'utf8');
  let file = rawdata.toString();
  // console.log(file);

  return file
}

function saveToFile(file, content) {
  const fs = require('fs');

  fs.writeFileSync(basePath + file, content);
}

function getDirectories(path) {
  const fs = require('fs');

  return fs.readdirSync(path).filter(function (file) {
    return fs.statSync(path + '/' + file).isDirectory();
  });
}

function getIPTVInfo(device) {
  try {
    itpv_source = readFile(device.DeviceID + "/iptv.source").toString();

    if (itpv_source != null) {
      return itpv_source;
    }
  } catch (error) {
    console.error(error);
    return '';
  }
}

function putIPTVinfo(device){
  try {
    saveToFile(device.DeviceID + "/iptv.source", device.IPTV)
  } catch (error) {
    console.error(error);
    return false;
  }
  return true;
}

exports.GetDevices = function () {
  var devicesList = getDirectories(basePath);

  return devicesList;
}

exports.GetDevice = function (deviceID) {
  var device = {
    DeviceID: deviceID,
    Name: deviceID,
    Commands: [],
    Files: [],
    IPTV: ''
  };

  device.IPTV = getIPTVInfo(device);

  return device;
}

exports.SaveDevice = function( device ){
  if(putIPTVinfo(device)) {
    return this.GetDevice(device.DeviceID);
  }

  return null;
}

exports.AuthenticateDevice = function (deviceID, secret, callback) {
  var settings = JSON.parse(readFile(deviceID + "/settings.json"));
  if (settings != null) {
    if (settings.secret != secret) {
      console.error("User " + deviceID + ": " + settings.secret + " != " + secret);
      callback({
        errorCode: 401,
        message: "Unauthorized"
      }, null);
    }
    else {
      callback(null, this.GetDevice(deviceID));
    }
  }
  else {
    callback({
      errorCode: 404,
      message: "Not found"
    }, null);
  }
}