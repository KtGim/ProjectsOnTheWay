import babel from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import image from '@rollup/plugin-image';
import postcss from 'rollup-plugin-postcss';
import ts from 'rollup-plugin-typescript2';
import jsx from 'acorn-jsx';
import json from '@rollup/plugin-json';
import clear from 'rollup-plugin-clear';

const fileExtensions = ['.js', '.jsx', '.tsx'];
const cssExtensions = ['.css', '.less'];

const tsPlugin = ts({
    tsconfig: require.resolve('../tsconfig.json'), // 导入本地ts配置
    extensions: fileExtensions,
    tsconfigOverride: { compilerOptions : { module: "es2015" } }
});

const initCommonConfig = (options = {}) => {
    return {
        input: './components/index.tsx',
        external: ['react', 'antd', 'react-dom'],
        plugins: [
            clear({
                targets: ['lib/']
            }),
            json(),
            image(),
            postcss({
                // Minimize CSS, boolean or options for cssnano.
                minimize: true,
                // Enable sourceMap.
                // sourceMap: true,
                extensions: cssExtensions,
                // extract: true,
                use: [
                    ['less', {
                    javascriptEnabled: true
                    }]
                ],
                ...options.postcss
            }),
            nodeResolve({
                extensions: fileExtensions
            }),
            tsPlugin,
            babel({
                presets: ["@babel/preset-react"],
                babelHelpers: "bundled",
                extensions: fileExtensions,
                exclude: 'node_modules/**',
                plugins: [
                    [
                        "import",
                        {
                            "libraryName": "antd",
                            "libraryDirectory": "es",
                            "style": true
                        }
                    ]
                ]
            }),
            commonjs()
        ],
        acornInjectPlugins: [jsx()],
    }
};

export default initCommonConfig;

// export default {
//     input: './components/index.tsx',
//     external: ['react', 'antd', 'react-dom'],
//     plugins: [
//         clear({
//             targets: ['lib/']
//         }),
//         json(),
//         image(),
//         postcss({
//             // Minimize CSS, boolean or options for cssnano.
//             minimize: true,
//             // Enable sourceMap.
//             sourceMap: true,
//             extensions: cssExtensions,
//             // extract: true,
//             use: [
//                 ['less', {
//                   javascriptEnabled: true
//                 }]
//             ],
//         }),
//         nodeResolve({
//             extensions: fileExtensions
//         }),
//         tsPlugin,
//         babel({
//             presets: ["@babel/preset-react"],
//             babelHelpers: "bundled",
//             extensions: fileExtensions,
//             exclude: 'node_modules/**',
//             plugins: [
//                 [
//                     "import",
//                     {
//                         "libraryName": "antd",
//                         "libraryDirectory": "es",
//                         "style": true
//                     }
//                 ]
//             ]
//         }),
//         commonjs()
//     ],
//     acornInjectPlugins: [jsx()],
// }