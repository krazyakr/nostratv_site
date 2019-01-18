const basePath = '/usr/local/nostratv_site/';

function readFile(filePath) {
    const fs = require('fs');

    let rawdata = fs.readFileSync(basePath + filePath, 'utf8');
    let file = rawdata.toString();
    // console.log(file);

    return file
}

// GET /api/device/file/:fileID/ - get a generic device file
exports.getGenericFile = function (req, res) {
    statusCode = 404;
    errorMsg = "File not found";
    file = null;
    fileName = null;

    files = JSON.parse(readFile("files.json"));

    if (files != null) {
        files.forEach(element => {
            if (element.id == req.params.fileID) {
                statusCode = 200;
                file = readFile(element.path);
                fileName = element.name;
            }
        });
    }

    if (statusCode == 200) {
        res.statusCode = statusCode;
        res.set('Content-Disposition', 'attachment; filename="' + fileName + '"')
        res.send(file);
    }
    else {
        res.statusCode = statusCode;
        res.json({ "Error": errorMsg.toString() });
    }
};

// GET /:deviceID/:secret/commands/:version - get the commands that device must execute based on the version passed
exports.getDeviceCommands = function (req, res) {
    statusCode = 500;
    errorMsg = "Unexpected error";
    commands = [];

    // console.log("User: " + req.params.deviceID);
    // console.log("Secret: " + req.params.secret);
    // console.log("Version: " + req.params.version);

    settings = JSON.parse(readFile(req.params.deviceID + "/settings.json"));
    if(settings != null ){
        if( settings.secret != req.params.secret ){
            console.error( "User " + req.params.deviceID + ": " + settings.secret + " != " + req.params.secret );
            statusCode = 401;
            errorMsg = "Unauthorized"
        }
        else {
            _commands = JSON.parse(readFile(req.params.deviceID + "/commands.json"));
            if( _commands != null ){
                statusCode = 200;
                _commands.forEach(element => {
                    if(element.version > req.params.version) {
                        commands.push(element);
                    }
                });
            }
        }
    }

    if (statusCode == 200) {
        res.statusCode = statusCode;
        res.json(commands);
    }
    else {
        res.statusCode = statusCode;
        res.json({ "Error": errorMsg.toString() });
    }
};

// GET /:deviceID/:secret/file/:fileID - get a device file
exports.getDeviceFile = function (req, res) {
    statusCode = 404;
    errorMsg = "File not found";
    file = null;
    fileName = null;

    // console.log("User: " + req.params.deviceID);
    // console.log("Secret: " + req.params.secret);
    // console.log("Version: " + req.params.version);

    settings = JSON.parse(readFile(req.params.deviceID + "/settings.json"));
    if(settings != null ){
        if( settings.secret != req.params.secret ){
            console.error( "User " + req.params.deviceID + ": " + settings.secret + " != " + req.params.secret );
            statusCode = 401;
            errorMsg = "Unauthorized"
        }
        else {
            files = JSON.parse(readFile(req.params.deviceID + "/files.json"));

            if (files != null) {
                files.forEach(element => {
                    if (element.id == req.params.fileID) {
                        statusCode = 200;
                        file = readFile(req.params.deviceID + "/" + element.path);
                        fileName = element.name;
                    }
                });
            }
        }
    }

    if (statusCode == 200) {
        res.statusCode = statusCode;
        res.set('Content-Disposition', 'attachment; filename="' + fileName + '"')
        res.send(file);
    }
    else {
        res.statusCode = statusCode;
        res.json({ "Error": errorMsg.toString() });
    }
};