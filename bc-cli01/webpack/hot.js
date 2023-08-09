const { envTypes, webpackCommands } = require('../helper/const/index');
const { merge } = require('webpack-merge');
const common = require('./common');

module.exports = (rootPath, param, localConfig) => {
    return merge(common(rootPath, param || webpackCommands.HOT, envTypes.DEV), localConfig);
}