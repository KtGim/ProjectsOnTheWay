"use strict";
exports.__esModule = true;
exports.modifyActions = void 0;
var _a = require('./chalkLog'), done = _a.done, warn = _a.warn, danger = _a.danger;
var modifyActions = {
    INITIAL: {
        text: '初始化',
        log: done
    },
    CREATED: {
        text: '创建',
        log: done
    },
    MODIFIED: {
        text: '更新',
        log: warn
    },
    MOVED: {
        text: '移除',
        log: danger
    }
};
exports.modifyActions = modifyActions;
