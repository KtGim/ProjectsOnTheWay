const path = require('path');
const os = require('os');
const { targetList } = require('./page/webs/src/Tool/devTarget');
const { defineConfig } = require('@best/bc-cli/webpack/index');
const { resolve } = require('./cli_base_config');
const HtmlWebpackPlugin = require('html-webpack-plugin'); //生成html

const getIPAdress = () => {
    let interfaces = os.networkInterfaces();
    for (let devName in interfaces) {
        let iface = interfaces[devName];
        for (let i = 0; i < iface.length; i++) {
            let alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
};

const localIp = getIPAdress();

const getProxy = () => {
    return targetList.reduce((res, cur) => {
        const {
            url,
            target,
            proxyTargetList
        } = cur;
        res[`${url}/*`] = {
            target,
            changeOrigin: true,
            pathRewrite: { [`^${url}`]: '' }
        };
        proxyTargetList && proxyTargetList.forEach(({target, partten, changePartten}) => {
            res[`${partten}/*`] = {
                target,
                changeOrigin: true,
                pathRewrite: { [`^${partten}`]: changePartten }
            };
        });
        return res;
    }, {});
};

const config = defineConfig((webpack) => {
  return {
    entry: path.resolve(__dirname, './page/webs/src/app.js'),
    output: {
        publicPath: '/main/dist/', //编译好的文件，在服务器的路径,域名会自动添加到前面
        path: path.resolve(__dirname, './dev/main/dist'), //编译到当前目录
        filename: '[name].js', //编译后的文件名字
        chunkFilename: '[name].[chunkhash:5].min.js'
    },
    resolve,
    devServer: {
        allowedHosts:'all',
        client: {
            progress: true
        },
        // liveReload: true,  // 直接刷新浏览器更新
        static: {
            directory: path.join(__dirname, 'dev')
            // publicPath: '/main/dist/',
            // watch: true
        },
        port: 3002, // 本地服务器端口号
        host: localIp,
        hot: true, // 热重载， 当 HMR 失败后，回退到 live reload 操作，也就是进行浏览器刷新来获取最新打包代码
        proxy: {
            ...getProxy(),
            '/log-service': {
                target: 'http://10.13.45.64:9081',
                changeOrigin: true,
                pathRewrite: { '/log-service': '' }
            },
            '/log-next-service': {
                target: 'http://10.13.45.64:9081',
                changeOrigin: true,
                pathRewrite: { '/log-next-service': '' }
            }
        }
    },
    plugins: [
        new webpack.DllReferencePlugin({
            scope: 'dependencies3',
            manifest: require('./dll/dependencies3-manifest.json'), // eslint-disable-line
            extensions: ['.js', '.jsx']
        }),
        new HtmlWebpackPlugin({  //根据模板插入css/js等生成最终HTML
            filename: '../../index.html', //输出文件【注意：这里的根路径是module.exports.output.path】
            template: './page/webs/template/index.html', //html模板路径
            inject: 'body',
            title:'QWMS',
            hash: true
            // ,
            // dllJSName
        }),
        new webpack.NamedModulesPlugin()
    ]
  };
});

module.exports = config;
