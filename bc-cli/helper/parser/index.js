const { commands } = require('../const/index');
const { optionFuncs } = require('../../commands/options/index');

const parseOptions = (options, currentPath) => {
  commands.forEach(command => {
    if(options[command]) {
      if(optionFuncs[command]) {
        optionFuncs[command](options[command], currentPath)
      };
    }
  })
}

module.exports = {
  parseOptions
}