const { commanders } = require('../../helper/const/index')

const init = require('./init');
const create = require('./create');

const optionFuncs = {
  [commanders.INIT]: init,
  [commanders.CREATE]: create
}

module.exports = {
  optionFuncs
}