const { existsSync } = require('fs');
const { chalkLog, colors } = require('../../helper/log/index');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const webpackCommandsFun = require("../../webpack/index");
const { webpackCommands } = require('../const/index');
const { exit } = require('process');

const action = (param, config) => {
    const compiler = webpack(config);
    switch (param) {
        case webpackCommands.BUILD:
        case webpackCommands.DLL:
        case webpackCommands.DEV:
            compiler.run();
            break;
        case webpackCommands.HOT:
            const server = new WebpackDevServer({ ...config.devServer, open: true }, compiler);
            server.start(config.devServer.port);
            break;
    }
}

const buildByEnv = (rootPath, param) => {
    const localConfigPath = `${rootPath}/bc-cli.${param}.js`;
    if(existsSync(localConfigPath)) {
        const localConfig = require(localConfigPath);
        // 合并 配置文件入口
        const config = webpackCommandsFun[param](rootPath, param, localConfig);
        action(param, config);
    } else {
        chalkLog(`bc-cli.${param}.js 文件不存在`, colors.red);
        exit(0);
    }
}

module.exports = {
    buildByEnv
}