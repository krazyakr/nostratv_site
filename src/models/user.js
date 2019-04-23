const fs = require('fs');
var bcrypt = require('bcrypt-nodejs');

var localPath = process.env.FS_PATH + '/users/';

function saveToFile(file, content) {
    fs.writeFileSync(localPath + file, content);
}

function readFile(file) {
    let rawdata = fs.readFileSync(localPath + file, 'utf8');
    let content = rawdata.toString();

    return content
}

function getUserObject(){
    var user = {
        username: {
            type: String,
        },
        password: {
            type: String
        }
    };

    user.generatePassword = function (password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    }

    user.comparePassword = function (password, hash) {
        return bcrypt.compareSync(password, hash);
    }

    user.save = function (callback) {
        try {
            var record = { username: this.username, password: this.password };
            saveToFile(user.username + '.data', JSON.stringify(record));
            callback(null, record);
        } catch (error) {
            callback(error);
        }

    }

    return user;
}

module.exports = function (username) {
    var user = getUserObject();
    user.username = username;
    return user;    
}

module.exports.findByUsername = function (username, callback) {
    try {
        if (fs.existsSync(localPath + username + '.data')) {
            content = JSON.parse(readFile(username + '.data'));
            doc = getUserObject();
            doc.username = content.username;
            doc.password = content.password;
            callback(null, doc);
        }
        else {
            callback(null, false);
        }
    } catch (error) {
        callback(error);
    }
}

module.exports.connect = function (fileSystemPath) {
    this.localPath = fileSystemPath;
}