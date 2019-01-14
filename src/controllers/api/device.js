// const basePath = '/usr/local/nostratv_site/';

// function getGenericFile(fileID){
//     var fs = require('fs'),
//     path = require('path'),    
//     filePath = path.join(basePath, 'files.json');

//     result = {
//         "name": null,
//         "content": null
//     };

//     files = null;

//     fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
//         if (!err) {
//             console.log('received data: ' + data);
//             files = data;
//         } else {
//             console.log(err);
//         }
//     });

//     console.log ("files:  " + files);

//     return result;
// }

// GET /api/device/:fileID/ - get a generic device file
exports.generic_file = function (req, res) {
    console.log("started");
    var file = { "id": req.params.fileID, "name": "install.sh", "content": "#!/bin/bash\r\necho 'This is the NOStraTV client installation script.'" };
    statusCode = 200;

    // console.log("before func");
    // _file = getGenericFile(req.params.fileID);   
    // console.log("after func");

    res.statusCode = statusCode;
    res.set('Content-Disposition', 'attachment; filename="' + file.name + '"')
    res.send(file.content);
};