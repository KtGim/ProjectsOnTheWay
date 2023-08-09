const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
/**
 * 新版本的 webpack 在文件没有改动的情况下 build 出来的文件 bundle hash 值会使一样的
 * 老版本会随着每次 build 发生变化
 */
module.exports = (env) => {
  // console.log(env)
  return {
    // entry: './src/Caching/index.js',
    entry: './src/index.js',
    output: {
      filename: '[name].bundle.js',
      filename: '[name].[contenthash].js',
      path: path.resolve(__dirname, 'dist'),
    },
    // caching 策略 在 webpack 4之前需要配置， webpack 5 已经内置，只要文件没有改动，打包出来的名称就不会改变，然后利用浏览器的缓存机制，加快读取文件的速度
    optimization: {
      runtimeChunk: 'single',
      // moduleIds: 'hashed',
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
          }
        }
      }
    },
    plugins: [
      // new CleanWebpackPlugin(['dist/*']) for < v2 versions of CleanWebpackPlugin
      new CleanWebpackPlugin(),
      new webpack.DllPlugin({
        path: path.join(__dirname, "dist", "[name]-manifest.json"),
        name: "[name]_[fullhash]"
      }),
      new HtmlWebpackPlugin({
      title: 'Caching',
      }),
    ],
  }
};

