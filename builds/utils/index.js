"use strict";
exports.__esModule = true;
exports.removeDir = void 0;
var fs = require('fs');
/**
 * @param path {删除文件的路径}
 */
var removeDir = function (path) {
    var files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach(function (file) {
            var curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) {
                removeDir(curPath);
            }
            else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};
exports.removeDir = removeDir;
