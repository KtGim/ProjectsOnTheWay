const path = require('path');

const webpack = require('webpack');
const child_process = require('child_process');
const { spinner } = require('../helper/spinner/index');
const chalk = require('chalk');
const { envTypes, webpackCommands } = require('../helper/const/index');
const { chalkLog, colors } = require('../helper/log/index');
const { ProgressPlugin } = webpack;

const  getBasePlugins = (env) => [
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: env == envTypes.DEV ? '"develop"' : '"production"'
        },
        URL_DIST:'"'+process.env.npm_lifecycle_event+'"',
        URL_TYPE: env == envTypes.DEV ? '"DEV"' : '"PRO"',
        GWMS_GIT_VERSION:JSON.stringify(`
        Branch: ${child_process.execSync('git name-rev --name-only HEAD').toString().trim()} 
        Build Time:${new Date()})
        Builder: ${child_process.execSync('git config  user.name')}
        `),
        PUBLISH_TIMESTAMP: JSON.stringify(new Date().getTime())   // 缓存版本发布信息
    })
];

module.exports = (rootPath, param, env) => {
    const { EventEmitter } = require('events');
    EventEmitter.defaultMaxListeners = 30;
    const ROOT_PATH = path.resolve(rootPath);
    const SOURCE_PATH = path.resolve(ROOT_PATH, './page');
    let gPercentage = '';
    const basePlugins = getBasePlugins(env);
    if(param == webpackCommands.BUILD || param == webpackCommands.DEV) {
        spinner.start("构建开始");
        const startTime = new Date().getTime();
        basePlugins.unshift(new ProgressPlugin({
            // activeModules: true,         // 默认false，显示活动模块计数和一个活动模块正在进行消息。
            // entries: true,  			   // 默认true，显示正在进行的条目计数消息。
            modules: true,              // 默认true，显示正在进行的模块计数消息。
            modulesCount: 5000,          // 默认5000，开始时的最小模块数。PS:modules启用属性时生效。
            // profile: false,         	   // 默认false，告诉ProgressPlugin为进度步骤收集配置文件数据。
            // percentBy: 'modules',
            // dependenciesCount: 10000,    // 默认10000，开始时的最小依赖项计数。PS:dependencies启用属性时生效。
            handler(percentage, message, ...args) {   // 钩子函数
                if(gPercentage !== percentage) {
                    spinner.setOptions({
                        text: `${chalk.bgGreen.bold(message)}${chalk.yellow(" 进度：")}${chalk.green.bold(~~(percentage * 100) + "%")}`
                    });
                    gPercentage = percentage;
                }
                if(gPercentage == 1) {
                    spinner.stop(`构建完成: 总耗时 ${chalk.yellow((new Date().getTime() - startTime) / 1000)} ms`)
                }
            }
        }))
    } else {
        chalkLog('构建开始', colors.green);
    }
    return {
        mode: env,
        resolve: {
            extensions: ['.js', '.jsx', '.less', '.css']
        },
        module: {
            rules: [{
                test: /\.js$/,
                exclude: /node_modules/,
                include: [SOURCE_PATH],
                use: [
                    'thread-loader',
                    'babel-loader'
                ]
            }, {
                test: /\.jsx$/,
                exclude: /node_modules/,
                include: [SOURCE_PATH],
                use: [
                    'thread-loader',
                    'babel-loader'
                ]
            }, {
                test: /\.css$/,
                exclude: /node_modules/,
                include: [SOURCE_PATH],
                use: [
                    'thread-loader',
                    'style-loader',
                    'css-loader'
                ]
            }, {
                test: /\.less$/,
                exclude: /node_modules/,
                include: [SOURCE_PATH],
                use: [
                    'thread-loader',
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                    'less-loader'
                ]
            }, {
                test: /\.(png|jpg|gif)$/,
                exclude: /node_modules/,
                use: 'url-loader?limit=8192&name=images/[hash:8].[name].[ext]'
            }, {
                test: /\.(eot|woff|svg|ttf|woff2|gif|appcache)\w*/,
                loader: 'file-loader?outputPath=fonts/&name=[name][hash:8].[ext]'
            }]
        },
        plugins: basePlugins
    };
};