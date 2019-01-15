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
        res.json({"Error":errorMsg});
    }
};