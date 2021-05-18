const {log} = require('console');
const chalk = require('chalk');

const {
  black,
  red,
  green,
  yellow,
  blue,
  magenta,
  cyan,
  white,
  redBright,
  greenBright,
  yellowBright,
  blueBright,
  magentaBright,
  cyanBright,
  whiteBright,
  bold,
  bgBlack,
  bgRed,
  bgGreen,
  bgYellow,
  bgBlue,
  bgMagenta,
  bgCyan,
  bgWhite,
  bgBlackBright,
  bgRedBright,
  bgGreenBright,
  bgYellowBright,
  bgBlueBright,
  bgMagentaBright,
  bgCyanBright,
  bgWhiteBright,
} = chalk;

const format = (...args) => {
  if (args && args.length) {
    let execActions = {};
    args.forEach((action) => {
      execActions = chalk[action];
    })
    // console.log(execActions);
    return (str) => log(execActions(str))
  }
  return log;
}
module.exports = {
  format,
  red: format('red'),
  blue: format('blue'),
  yellow: format('yellow'),
  danger: format('bold', 'bgRed'),
  warn: format('bold', 'bgYellowBright'),
  done: format('bold', 'bgGreenBright'),
}