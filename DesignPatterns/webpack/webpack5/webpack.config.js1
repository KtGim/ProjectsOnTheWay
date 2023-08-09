const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const path = require('path');

module.exports = {
  // entry: './src/index.js',
  mode: 'development',
  entry: {
    // app: './src/index.js',
    // // print: './src/print.js',
    // anthor: './src/anthor.js'
    index: { import: './src/index.js', dependOn: 'shared' },
    another: { import: './src/anthor.js', dependOn: 'shared' },
    shared: 'lodash',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    hot: true,
    hotOnly:true
  },
  module: {
    rules: [
      {
        test:/\.css/,
        use: [
          // 'style-loader',
          // 'css-loader'
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                namedExport: true,
                localIdentName: 'foo__[name]__[local]',
              },
            },
          },
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    new HtmlWebpackPlugin({
      title: 'html-webpack-plugin',
      filename: 'index.html'
    }),
    new MiniCssExtractPlugin({
      insert: '#aaa',
      chunkFilename: '[id].css',
      namedExport: true,
      localIdentName: 'foo__[name]__[local]',
    }),
  ],
  optimization: {
     splitChunks: {
       /**
        * 设置缓存组策略
        */
       cacheGroups: {
          vendor: {
            test: /node_modules/,
            chunks: 'initial',
            name: 'vendor',
            priority: 4, // 多个缓存组中存在相同的 chunks 那么权重更高的有限被缓存
            enforce: true,
            reuseExistingChunk: true,
            minChunks: 2,
          },
       },
       chunks: 'all',
      //  chunks (chunk) {
      //   // exclude `my-excluded-chunk`
      //   return chunk.name !== 'my-excluded-chunk';
      // }
     },
   },
};