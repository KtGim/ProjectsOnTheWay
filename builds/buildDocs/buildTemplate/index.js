"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var fs = require('fs');
var Diff = require('diff');
var buildContent_1 = __importDefault(require("./buildContent"));
var buildTablePropsInfo_1 = __importDefault(require("./buildTablePropsInfo"));
var buildMdTemplate = function (_a) {
    var componentName = _a.componentName, tsxPath = _a.tsxPath, docsPath = _a.docsPath, docsFiles = _a.docsFiles, tsxFiles = _a.tsxFiles, type = _a.type;
    if (type === 'CREATED') {
        var template = buildContent_1["default"]('Demo') + "\n\n        " + buildTablePropsInfo_1["default"](tsxPath);
        fs.writeFileSync(docsPath, template, 'utf-8');
    }
    else if (type === 'MODIFIED') {
        var newFile = fs.readFileSync(tsxPath, 'utf-8');
        var oldDocsFile = fs.readFileSync(docsPath, 'utf-8');
        var template = "" + oldDocsFile.split('## 组件属性')[0] + buildTablePropsInfo_1["default"](tsxPath);
        fs.writeFileSync(docsPath, template, 'utf-8');
        // @ts-ignore
        // diffFiles(tsxFiles[componentName], newFile);
    }
};
var diffFiles = function (oldFile, newFile, cb) {
    var diff = Diff.diffTrimmedLines(oldFile, newFile);
    diff.forEach(function (part) {
        console.log(part);
    });
    cb && cb();
};
var createDocs = function () {
};
exports["default"] = buildMdTemplate;
