"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var chokidar_1 = __importDefault(require("chokidar"));
var fs_1 = __importDefault(require("fs"));
var path_1 = require("path");
var buildIndex_1 = __importDefault(require("./buildIndex"));
var buildRoutesTemplate_1 = __importDefault(require("./buildRoutesTemplate"));
var buildRoutes_1 = __importDefault(require("./buildRoutes"));
var buildDocs_1 = __importDefault(require("./buildDocs"));
var watcher = chokidar_1["default"].watch(path_1.resolve(__dirname, '../components'), {
    ignored: /(^|[\/\\])\../,
    persistent: true
});
var root = path_1.resolve(__dirname, '../components');
var leadingInNames = fs_1["default"].readdirSync(root)
    .filter(function (f) {
    return (fs_1["default"].statSync(path_1.join(root, f)).isDirectory()) && (f !== 'style');
});
var buildDocs = new buildDocs_1["default"](leadingInNames, 'initial');
// type ActionType = 'created' | 'moved' | 'modified';
watcher
    // .on('add', path => log(`File ${path} has been added`))
    // .on('change', path => log(`File ${path} has been changed`))
    // .on('unlink', path => log(`File ${path} has been removed`))
    // .on('addDir', path => {
    //   const dir = path.split('/').pop();
    //   if(['components', 'style'].indexOf(dir) === -1) {
    //     const leadingInNames = fs.readdirSync(root)
    //       .filter(async (f) =>
    //         await fs.statSync(join(root, f)).isDirectory() && f !== 'style'
    //       )
    //     (leadingInNames.indexOf(dir) === -1) && leadingInNames.push(dir);
    //     // const str = buildRoutesTemplate(leadingInNames);
    //     // log(str);
    //   }
    // })
    // .on('unlinkDir', path => log(`Directory ${path} has been removed`))
    // .on('error', error => log(`Watcher error: ${error}`))
    .on('ready', function () {
    if (leadingInNames.length) {
        buildDocs.init();
        buildRoutes_1["default"](buildRoutesTemplate_1["default"](leadingInNames), 'created');
    }
})
    .on('raw', function (event, path, _a) {
    var type = _a.type;
    var dir = path.split('/').pop();
    if (type === 'directory') {
        // console.log(leadingInNames, 'in', event);
        switch (event) {
            case 'created':
                leadingInNames.push(dir);
                break;
            case 'moved':
                leadingInNames = leadingInNames.filter(function (name) { return name !== dir; });
                break;
        }
        buildIndex_1["default"](dir, leadingInNames, event);
        // components/index.ts 变动时不触发
        if (dir !== 'components') {
            buildDocs.processDocs(dir, event);
        }
        buildRoutes_1["default"](buildRoutesTemplate_1["default"](leadingInNames), 'modified');
    }
    else {
        // components/index.ts 变动时不触发
        dir = path_1.resolve(path, '..').split('/').pop();
        if (dir !== 'components') {
            buildDocs.processDocs(dir, event);
        }
    }
});
