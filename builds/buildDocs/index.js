"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var path_1 = require("path");
var fs_1 = __importDefault(require("fs"));
var type_1 = require("./type");
var actionsInfo_1 = require("./actionsInfo");
var utils_1 = require("../utils");
var buildTemplate_1 = __importDefault(require("./buildTemplate"));
var BuildDocs = /** @class */ (function () {
    function BuildDocs(components, type) {
        this.type = type_1.transformModifyType[type];
        this.components = (typeof components === 'string' && components) ? [components] : components;
        this.tsxFiles = {};
        this.docsFiles = {};
        this.init();
    }
    BuildDocs.prototype.init = function () {
        var _this = this;
        this.components.forEach(function (componentName) {
            if (!componentName) {
                return;
            }
            var _a = _this, tsxFiles = _a.tsxFiles, docsFiles = _a.docsFiles;
            var tsxPath = _this.getTsxPath(componentName);
            var docsPath = _this.getDocsPath(componentName);
            var isTsxExist = fs_1["default"].existsSync(tsxPath);
            var isMdExist = fs_1["default"].existsSync(docsPath);
            if (!tsxFiles[componentName] && isTsxExist) {
                _this.collectTsxFiles(componentName, tsxPath);
            }
            if (!docsFiles[componentName] && isMdExist) {
                _this.collectDocsFiles(componentName, docsPath);
            }
        });
    };
    BuildDocs.prototype.getTsxPath = function (componentName) {
        return path_1.resolve(__dirname, '../../components', componentName + "/index.tsx");
    };
    BuildDocs.prototype.getDocsPath = function (componentName) {
        return path_1.resolve(__dirname, '../../docs', componentName + "/index.md");
    };
    BuildDocs.prototype.collectTsxFiles = function (componentName, path) {
        this.tsxFiles[componentName] = fs_1["default"].readFileSync(path, 'utf-8');
    };
    BuildDocs.prototype.collectDocsFiles = function (componentName, path) {
        this.docsFiles[componentName] = fs_1["default"].readFileSync(path, 'utf-8');
    };
    BuildDocs.prototype.processDocs = function (componentName, type) {
        var components = this.components;
        this.type = type_1.transformModifyType[type];
        var docsPath = this.getDocsPath(componentName);
        var tsxPath = this.getTsxPath(componentName);
        if (this.type === 'CREATED') {
            // if (!components.includes(componentName)) {
            components.push(componentName);
            this.collectTsxFiles(componentName, tsxPath);
            this.collectDocsFiles(componentName, docsPath);
            buildTemplate_1["default"]({
                componentName: componentName,
                tsxPath: tsxPath,
                docsPath: docsPath,
                docsFiles: this.docsFiles,
                tsxFiles: this.tsxFiles,
                type: this.type
            });
            // }
        }
        else if (this.type === 'MOVED') {
            components = components.filter(function (comp) { return comp !== componentName; });
            utils_1.removeDir(path_1.resolve(docsPath, '..'));
        }
        else if (this.type === 'MODIFIED') {
            buildTemplate_1["default"]({
                componentName: componentName,
                tsxPath: tsxPath,
                docsPath: docsPath,
                docsFiles: this.docsFiles,
                tsxFiles: this.tsxFiles,
                type: this.type
            });
            this.collectTsxFiles(componentName, tsxPath);
            this.collectDocsFiles(componentName, docsPath);
        }
        var action = actionsInfo_1.modifyActions[this.type];
        action.log(componentName + "\u76F8\u5173\u6587\u6863 " + action.text + " \u5B8C\u6210\uFF01");
        // let newFile = null;
        // const isMdExist = fs.existsSync(resolve(docsRoot, `${componentName}/index.md`));
        // const isTsxExist = fs.existsSync(resolve(docsRoot, `${componentName}/index.md`));
        // this.components.forEach((componentName) => {
        //   const template = buildMdTemplate(componentName)
        //   if (type === 'INITIAL' && !isMdExist) {
        //     // 初始化
        //     this.initDocs(componentName)
        //     // collectFiles(componentName, isTsxExist, isMdExist);
        //   }
        // else if (type === 'created') {
        // 创建
        //   initDocs(componentName, template, type)
        //   collectFiles(componentName, isTsxExist, isMdExist);
        // } else if (isMdExist && type !== 'created' && type !== 'initial') {
        // 更新
        //   if (tsxFiles[componentName]) {
        //     newFile = fs.readFileSync(resolve(tsxRoot, `${componentName}/index.tsx`), 'utf-8');
        //     diffFiles(tsxFiles[componentName], newFile, initDocs(componentName, template, type));
        //     tsxFiles[componentName] = newFile;
        //   }
        // }
        // })
    };
    return BuildDocs;
}());
exports["default"] = BuildDocs;
