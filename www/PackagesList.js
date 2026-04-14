var exec = require('cordova/exec');

exports.listUser = function (success, error) {
    exec(success, error, 'PackagesList', 'listUser', []);
};

exports.listAll = function (success, error) {
    exec(success, error, 'PackagesList', 'listAll', []);
};