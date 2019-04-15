var DeviceHandler = require('../../business/devices/DeviceHandler');

exports.Devices = function(request, response){
    var devicesList = DeviceHandler.GetDevices();

    response.render('devices/index', { title: 'NOStraTV Extras - Devices', list: devicesList });
}

exports.Device = function(request, response){
    var device = DeviceHandler.GetDevice(request.params.deviceID);

    console.log('Device: ' + JSON.stringify(device));

    response.render('devices/device', { title: 'NOStraTV Extras - Device', device: device });
}

exports.SaveDevice = function(request, response){
    var device = DeviceHandler.GetDevice(request.params.deviceID);
    device.IPTV = request.body.IPTV;

    console.log('Device: ' + JSON.stringify(device));
    
    updatedDevice = DeviceHandler.SaveDevice(device);
    
    if( updatedDevice != null ){
        device = updatedDevice;
    }

    response.render('devices/device', { title: 'NOStraTV Extras - Device', device: device });
}