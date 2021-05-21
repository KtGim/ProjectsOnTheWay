"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var parseTsFile_1 = __importDefault(require("./parseTsFile"));
var buildTablePropsInfo = function (tsxPath) {
    var _a = parseTsFile_1["default"](tsxPath), propAlias = _a.propAlias, typeAlias = _a.typeAlias;
    var propsCellsInfo = '';
    Object.keys(propAlias).forEach(function (key) {
        // @ts-ignore
        var propsInfos = propAlias[key];
        // @ts-ignore
        if (typeAlias.get(propAlias[key])) {
            // @ts-ignore
            propsInfos = typeAlias.get(propAlias[key]);
            // @ts-ignore
            propsCellsInfo += "| " + key + " | - | " + propAlias[key] + " (\u53D6\u503C\u4E3A: " + propsInfos.replace(/\|/g, ',') + ") | - |\n";
        }
        else {
            propsCellsInfo += "| " + key + " | - | " + propsInfos + " | - |\n";
        }
    });
    return "## \u7EC4\u4EF6\u5C5E\u6027\n\n|\u540D\u79F0  | \u63CF\u8FF0 | \u7C7B\u578B |default|\n|--|--|--|--|\n" + propsCellsInfo;
};
exports["default"] = buildTablePropsInfo;
