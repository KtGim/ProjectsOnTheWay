"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var path_1 = require("path");
var fs_1 = __importDefault(require("fs"));
var chalkLog_1 = __importDefault(require("./chalkLog"));
var routersRoot = path_1.resolve(__dirname, '../src/router/index.ts');
var modifyInfo = {
    created: {
        text: '创建',
        log: chalkLog_1["default"].done
    },
    modified: {
        text: '更新',
        log: chalkLog_1["default"].warn
    }
};
exports["default"] = (function (template, type) {
    if (template) {
        fs_1["default"].writeFileSync(routersRoot, template, 'utf-8');
        var action = modifyInfo[type];
        action.log("router " + action.text + "\u5B8C\u6BD5!");
    }
});
