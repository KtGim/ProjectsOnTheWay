"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var console_1 = require("console");
var chalk_1 = __importDefault(require("chalk"));
// const {
//   black,
//   red,
//   green,
//   yellow,
//   blue,
//   magenta,
//   cyan,
//   white,
//   redBright,
//   greenBright,
//   yellowBright,
//   blueBright,
//   magentaBright,
//   cyanBright,
//   whiteBright,
//   bold,
//   bgBlack,
//   bgRed,
//   bgGreen,
//   bgYellow,
//   bgBlue,
//   bgMagenta,
//   bgCyan,
//   bgWhite,
//   bgBlackBright,
//   bgRedBright,
//   bgGreenBright,
//   bgYellowBright,
//   bgBlueBright,
//   bgMagentaBright,
//   bgCyanBright,
//   bgWhiteBright,
// } = chalk;
var format = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (args && args.length) {
        var execActions_1 = {};
        args.forEach(function (action) {
            // @ts-ignore
            execActions_1 = chalk_1["default"][action];
        });
        // console.log(execActions);
        // @ts-ignore
        return function (str) { return console_1.log(execActions_1(str)); };
    }
    return console_1.log;
};
exports["default"] = {
    format: format,
    red: format('red'),
    blue: format('blue'),
    yellow: format('yellow'),
    danger: format('bold', 'bgRed'),
    warn: format('bold', 'bgYellowBright'),
    done: format('bold', 'bgGreenBright')
};
