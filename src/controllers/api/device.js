// const basePath = '/usr/local/nostratv_site/';
var basePath = process.env.FS_PATH + '/devices/';
const HTTPRequest = require("../../business/net/httprequest");
const DeviceHandler = require("../../business/devices/DeviceHandler");
var cache = require('memory-cache');

function readFile(filePath) {
    const fs = require('fs');

    let rawdata = fs.readFileSync(basePath + filePath);
    let file = rawdata;
    // console.log(file);

    return file
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function getIptvPlaylist(sourceAddress, callback) {
    var hash = require('crypto').createHash('md5').update(sourceAddress).digest('hex');
    console.debug(hash); // 9b74c9897bac770ffc029102a200c5de
    console.debug('cache keys', cache.keys());
    
    const cache_key = `iptv_${hash}`;
    if (cache.get(cache_key)) {
        console.log('Found element ' + cache_key + ' in cache');
        content = cache.get(cache_key);
        statusCode = 200;

        callback(null, {
            statusCode: statusCode,
            content: content
        });
    } else {
        fetchAndCache(sourceAddress, cache_key, callback);
    }
}

function fetchAndCache(sourceAddress, cache_key, callback) {
    HTTPRequest.getHTMLASync(sourceAddress, function (statusCode, content) {
        // Put result on cache with expiration
        const cacheDuration = (12 + getRandomInt(4)) * 60 * 60 * 1000;
        cache.put(cache_key, content, cacheDuration, function (key, value) {
            console.log('Refreshing cache for ' + key);
            // Refresh the cache after expiration
            fetchAndCache(sourceAddress, cache_key, function() {
                console.log('Cache refreshed for ' + key);
            });
        });

        callback(null, {
            statusCode: statusCode,
            content: content
        });
    }, function (error) {
        callback(error, null);
    });
}

function parsePlaylist(playlist) {
    var lines = playlist.match(/^.*((\r\n|\n|\r)|$)/gm);
    var output = {};

    for (let index = 0; index < lines.length; index++) {
        var line = lines[index];
        
        if (line.startsWith('#EXTM3U')) {
            output['header'] = line;
        }
        else if (line.startsWith('#EXTINF:')) {
            var index1 = line.indexOf('group-title="') + 13;
            var index2 = line.indexOf('"', index1);
    
            var group = line.substring(index1, index2).toLowerCase().replace(' ', '_');

            index = index + 1;
            line = line + lines[index];
    
            output[group] = output[group] == null ? line : output[group] + line;
        }
    }
    
    return output;
}

// function parseGroupFromPlaylist(group, playlist) {
//     group = group.toLowerCase();
//     var output = parsePlaylist(playlist);

//     let result = [];
//     let hasElement = false;
//     var keys = Object.keys(output);
//     console.debug(keys);

//     for (let index = 0; index < keys.length; index++) {
//         const element = keys[index];
//         if( element.startsWith(group) )
//         {
//             hasElement = true;
//             result += output[element];
//         }
//     }

//     if(hasElement){
//         return output['header'] + result;
//     }

//     return null;
// }

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
    if (settings != null) {
        if (settings.secret != req.params.secret) {
            console.error("User " + req.params.deviceID + ": " + settings.secret + " != " + req.params.secret);
            statusCode = 401;
            errorMsg = "Unauthorized"
        }
        else {
            _commands = JSON.parse(readFile(req.params.deviceID + "/commands.json"));
            if (_commands != null) {
                statusCode = 200;
                _commands.forEach(element => {
                    if (element.version > req.params.version) {
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
    if (settings != null) {
        if (settings.secret != req.params.secret) {
            console.error("User " + req.params.deviceID + ": " + settings.secret + " != " + req.params.secret);
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

exports.getDeviceIPTV = function (req, res) {
    DeviceHandler.AuthenticateDevice(req.params.deviceID, req.params.secret, function (error, device) {
        if (error != null) {
            res.statusCode = error.errorCode;
            res.json({ "Error": error.message });
        }
        else {
            if (device.IPTV != null && device.IPTV != '') {
                getIptvPlaylist(device.IPTV, function (error, response) {
                    if (error != null) {
                        res.statusCode = 500;
                        res.json({ "Error": error.message.toString() });
                    }
                    else {
                        fileName = "iptv_channels.m3u";
                        res.statusCode = response.statusCode;
                        res.set('Content-Disposition', 'attachment; filename="' + fileName + '"')
                        res.send(response.content);
                    }
                });
            }
            else {
                res.statusCode = 404;
                res.json({ "Error": "IPTV Source not found" });
            }
        }
    });
};

// exports.getDeviceIPTVGroup = function (req, res) {
//     DeviceHandler.AuthenticateDevice(req.params.deviceID, req.params.secret, function (error, device) {
//         if (error != null) {
//             res.statusCode = error.errorCode;
//             res.json({ "Error": error.message });
//         }
//         else {
//             if (device.IPTV != null && device.IPTV != '') {
//                 getIptvPlaylist(device.IPTV, function (error, response) {
//                     if (error != null) {
//                         res.statusCode = 500;
//                         res.json({ "Error": error.message.toString() });
//                     }
//                     else {
//                         if (response.statusCode != 200) {
//                             res.statusCode = response.statusCode;
//                             res.send(response.content);
//                         }
//                         else {
//                             console.log(req.params.group);
//                             var groupPlaylist = parseGroupFromPlaylist(req.params.group, response.content);
//                             if (groupPlaylist == null) {
//                                 res.statusCode = 404;
//                                 res.json({ "Error": "IPTV Group not found" });
//                             }
//                             else {
//                                 fileName = `iptv_channels_${req.params.group}.m3u`;
//                                 res.statusCode = response.statusCode;
//                                 res.set('Content-Disposition', 'attachment; filename="' + fileName + '"')
//                                 res.send(groupPlaylist);
//                             }
//                         }
//                     }
//                 });
//             }
//             else {
//                 res.statusCode = 404;
//                 res.json({ "Error": "IPTV Source not found" });
//             }
//         }
//     });
// };

exports.getDeviceIPTVGroup = function (req, res) {
    DeviceHandler.AuthenticateDevice(req.params.deviceID, req.params.secret, function (error, device) {
        if (error != null) {
            res.statusCode = error.errorCode;
            res.json({ "Error": error.message });
        } else {
            if (device.IPTV != null && device.IPTV !== '') {
                getIptvPlaylist(device.IPTV, function (error, response) {
                    if (error != null) {
                        res.statusCode = 500;
                        res.json({ "Error": error.message.toString() });
                    } else {
                        if (response.statusCode !== 200) {
                            res.statusCode = response.statusCode;
                            res.send(response.content);
                        } else {
                            var group = req.params.group; // Group filter passed in the request
                            var groupPlaylist = parseGroupFromPlaylist(group, response.content);
                            
                            if (groupPlaylist == null) {
                                res.statusCode = 404;
                                res.json({ "Error": "IPTV Group not found" });
                            } else {
                                const fileName = `iptv_channels_${group}.m3u`;
                                res.statusCode = 200;
                                res.set('Content-Disposition', 'attachment; filename="' + fileName + '"');
                                res.send(groupPlaylist);
                            }
                        }
                    }
                });
            } else {
                res.statusCode = 404;
                res.json({ "Error": "IPTV Source not found" });
            }
        }
    });
};

// Function to parse the playlist and extract entries matching the group-title
function parseGroupFromPlaylist(group, playlistContent) {
    const entries = playlistContent.split('\n');
    let filteredPlaylist = '';
    
    let currentEntry = ''; // To store each complete entry (metadata + URL)

    // Loop through the entries and filter based on group-title
    entries.forEach(line => {
        if (line.startsWith('#EXTINF')) {
            currentEntry = line + '\n';  // Start building a new entry
        } else if (line.startsWith('http')) {
            currentEntry += line + '\n'; // Add the URL to the current entry

            // Check if the current entry matches the group-title
            const groupMatch = currentEntry.match(/group-title="([^"]+)"/);
            if (groupMatch && groupMatch[1].toLowerCase().includes(group.toLowerCase())) {
                filteredPlaylist += currentEntry; // Add the entry to the filtered playlist if it matches
            }

            currentEntry = ''; // Reset for the next entry
        }
    });

    return filteredPlaylist.length > 0 ? filteredPlaylist : null;
}
