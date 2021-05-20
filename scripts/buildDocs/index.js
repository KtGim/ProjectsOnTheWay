"use strict";
exports.__esModule = true;
var resolve = require('path').resolve;
var fs = require('fs');
var type_1 = require("./type");
var utils_1 = require("../utils");
var buildTemplate_1 = require("./buildTemplate");
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
            var isTsxExist = fs.existsSync(tsxPath);
            var isMdExist = fs.existsSync(docsPath);
            if (!tsxFiles[componentName] && isTsxExist) {
                _this.collectTsxFiles(componentName, tsxPath);
            }
            if (!docsFiles[componentName] && isMdExist) {
                _this.collectDocsFiles(componentName, docsPath);
            }
        });
    };
    BuildDocs.prototype.getTsxPath = function (componentName) {
        return resolve(__dirname, '../../components', componentName + "/index.tsx");
    };
    BuildDocs.prototype.getDocsPath = function (componentName) {
        return resolve(__dirname, '../../docs', componentName + "/index.md");
    };
    BuildDocs.prototype.collectTsxFiles = function (componentName, path) {
        this.tsxFiles[componentName] = fs.readFileSync(path, 'utf-8');
    };
    BuildDocs.prototype.collectDocsFiles = function (componentName, path) {
        this.docsFiles[componentName] = fs.readFileSync(path, 'utf-8');
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
            utils_1.removeDir(resolve(docsPath, '..'));
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
