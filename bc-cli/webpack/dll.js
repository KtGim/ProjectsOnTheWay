const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const { envTypes } = require('../helper/const/index');

const dependencies3 = [
    'react-router-dom',
    'wmstool',
    'react',
    'react-dom',
];

const dllConfig = (rootPath) => {
    const dllPath = path.join(rootPath, envTypes.DLL);
    return {
        mode: 'production',
        resolve: {
            extensions: ['.js', '.jsx']
        },
        entry: {},
        output: {
            path: dllPath,
            filename: '[name].js',
            library: '[name]_[chunkhash:8]'
        },  
        plugins: [
            new webpack.DllPlugin({
                path: path.join(dllPath, '[name]-manifest.json'),
                name: '[name]_[chunkhash:8]'
            })
        ]
    }
};

module.exports = function(rootPath, param, localConfig) {
    const deps = localConfig.entry.dependencies3 || [];
    localConfig.entry.dependencies3 = Array.from(new Set([...dependencies3, ...deps]));
    return merge(dllConfig(rootPath), localConfig)
}