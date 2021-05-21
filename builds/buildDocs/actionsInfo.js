"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.modifyActions = void 0;
var chalkLog_1 = __importDefault(require("../chalkLog"));
var done = chalkLog_1["default"].done, warn = chalkLog_1["default"].warn, danger = chalkLog_1["default"].danger;
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
