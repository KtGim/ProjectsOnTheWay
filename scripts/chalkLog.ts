import {log} from 'console';
import chalk from 'chalk';

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

const format = (...args: string[]) => {
  if (args && args.length) {
    let execActions = {};
    args.forEach((action) => {
      // @ts-ignore
      execActions = chalk[action];
    })
    // console.log(execActions);
    // @ts-ignore
    return (str: string) => log(execActions(str))
  }
  return log;
}

export default {
  format,
  red: format('red'),
  blue: format('blue'),
  yellow: format('yellow'),
  danger: format('bold', 'bgRed'),
  warn: format('bold', 'bgYellowBright'),
  done: format('bold', 'bgGreenBright'),
};