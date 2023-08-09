const chalk = require('chalk');
const { log } = console;

// chalk.blue
// chalk.red
// chalk.green

// chalk.bold
// chalk.rgb

const colors = {
    blue: 'blue',
    red: 'red',
    green: 'green'
}

const chalkLog = (text, type) => {
    log(chalk[type](text));
    return chalkLog;
}

module.exports = {
    chalkLog,


    colors
}