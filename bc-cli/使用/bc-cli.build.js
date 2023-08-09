const path=require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); //生成html
const CleanWebpackPlugin=require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');//复制文件
const { resolve, optimization } = require('./cli_base_config');

const RecordWebLogPlugin = require('@best/web-log-loader');

const config = {
  entry: path.resolve(__dirname, './page/webs/src/app'),
  output: {
      publicPath: './main/dist/', //编译好的文件，在服务器的路径,域名会自动添加到前面
      path: path.resolve(__dirname, './ROOT/main/dist'), //编译到当前目录
      chunkFilename: '[name]-[id].[chunkhash:8].bundle.js',
      filename: '[name].js' //编译后的文件名字
  },
  resolve,
  optimization,
  plugins: [
        /* 每次编译生产环境代码时先将之前的文件删除掉 */
      new CleanWebpackPlugin(
        [
          'ROOT/*'
        ],
        {
          verbose: true,
          dry: false
        }
      ),
      new HtmlWebpackPlugin({  //根据模板插入css/js等生成最终HTML
        minify:{
          removeAttributeQuotes:true
        },
        filename: '../../index.html', //输出文件【注意：这里的根路径是module.exports.output.path】
        template: './page/webs/template/index.html', //html模板路径
        inject: 'body',
        title:'QWMS',
        hash: true
      }),
      new RecordWebLogPlugin({
          HtmlWebpackPlugin
      }),
      new CopyWebpackPlugin([
        {from: './page/webs/src/Media', to: './Media'}
      ])
  ]
};


module.exports = config;