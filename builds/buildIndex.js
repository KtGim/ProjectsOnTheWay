"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var path_1 = require("path");
var fs_1 = __importDefault(require("fs"));
var buildCompIndexTemplate_1 = __importDefault(require("./buildCompIndexTemplate"));
var buildIndexTemplate_1 = __importDefault(require("./buildIndexTemplate"));
var buildCompIndexLessTemplate_1 = __importDefault(require("./buildCompIndexLessTemplate"));
var chalkLog_1 = __importDefault(require("./chalkLog"));
var done = chalkLog_1["default"].done;
var routersRoot = path_1.resolve(__dirname, "../components");
var buildIndex = function (componentName, componentNames, type) {
    if (type === 'created') {
        var compTemplate = buildCompIndexTemplate_1["default"](componentName);
        fs_1["default"].writeFileSync(path_1.resolve(routersRoot, componentName + "/index.tsx"), compTemplate, 'utf-8');
        done(componentName + "/index.tsx  \u521B\u5EFA\u5B8C\u6BD5!");
        var lessTemplate = buildCompIndexLessTemplate_1["default"](componentName);
        fs_1["default"].writeFileSync(path_1.resolve(routersRoot, componentName + "/index.less"), lessTemplate, 'utf-8');
        done(componentName + "/index.less  \u521B\u5EFA\u5B8C\u6BD5!");
    }
    // 修改 index.ts 文件
    var indexTemplate = buildIndexTemplate_1["default"](componentNames);
    fs_1["default"].writeFileSync(path_1.resolve(routersRoot, 'index.ts'), indexTemplate, 'utf-8');
    done("components/index.ts  \u66F4\u65B0\u5B8C\u6BD5!");
};
exports["default"] = buildIndex;
