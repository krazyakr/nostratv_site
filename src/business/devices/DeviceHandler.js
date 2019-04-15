const basePath = '/usr/local/nostratv_site/';

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
    itpv_source = readFile(device.DeviceID + "/iptv.source");

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