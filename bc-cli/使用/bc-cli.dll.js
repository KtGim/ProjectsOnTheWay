const path = require('path');
const CleanWebpackPlugin=require('clean-webpack-plugin');
const { defineConfig } = require('@best/bc-cli/webpack/index');

module.exports = defineConfig((webpack) => {
    const dllPath = path.join(__dirname, 'dll');
    return {
        entry: {
            dependencies3: [
                'react-router-dom',
                'redux',
                'redux-thunk',
                'moment',
                'wmstool',
                'ckeditor4-react',
                'deepmerge',
                'echarts',
                'echarts-for-react',
                'is-equal',
                'qrcode.react',
                'react',
                'react-barcode',
                'react-beautiful-dnd',
                'react-custom-scrollbars',
                'react-dnd',
                'react-dnd-html5-backend',
                'react-dom',
                'react-redux',
                'react-resizable',
                'uuid',
                'viewerjs',
                'xlsx'
            ]
        },
        plugins: [
            new CleanWebpackPlugin(
                [
                    'dll/*'
                ],
                {
                    verbose: true,
                    dry: false
                }
            ),
            new webpack.DllPlugin({
                path: path.join(dllPath, '[name]-manifest.json'),
                name: '[name]_[chunkhash:8]'
            })
            // ,
            // new AssetsPlugin({
        //   filename: 'dll-config.json',
        //   path: dllPath
        // })
        ]
    };
});