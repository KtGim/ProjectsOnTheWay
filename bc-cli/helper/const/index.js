const { promisify } = require('util');
const { exec } = require('shelljs');
const execSync = promisify(exec);

const commanders = {
  INIT: 'init',
  CREATE: 'create'
}

const commands = Object.values(commanders);

const webpackCommands = {
  BUILD: 'build',
  DLL: 'dll',
  DEV: 'dev',
  HOT: 'hot',
  COMMON: 'common'
}

const envTypes = {
  DEV: 'development',
  PRO: 'production',
  DLL: 'dll'
}

module.exports = {
  execSync,

  commanders,
  commands,
  webpackCommands,
  envTypes
}