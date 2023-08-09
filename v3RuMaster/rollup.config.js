import path from 'path'
import nodeResolve from '@rollup/plugin-node-resolve' // 依赖引用插件
import commonjs from '@rollup/plugin-commonjs' // commonjs模块转换插件
// import { eslint } from 'rollup-plugin-eslint' // eslint插件
import ts from 'rollup-plugin-typescript2'
import vue from 'rollup-plugin-vue';
import babel from "@rollup/plugin-babel";
// import postcss from "rollup-plugin-postcss";
// import { terser } from 'rollup-plugin-terser';
// import cssnano from "cssnano";
import less from 'rollup-plugin-less';
import jsx from "acorn-jsx";

const external = ['vue'];
const globals = { vue: 'Vue' };

const getPath = _path => path.resolve(__dirname, _path)
import packageJSON from './package.json'

// 处理所有文件
// const componentsFolder = 'components/'

// const components = fs
//   .readdirSync(componentsFolder)
//   .filter((f) =>
//     fs.statSync(path.join(componentsFolder, f)).isDirectory()
//   )

// const entriesPath = {
//     index: './components/index.js',
//     ...components.reduce((obj, name) => {
//       obj[name] = (componentsFolder + name + '/index.tsx')
//       return obj
//     }, {})
//   }

// const capitalize = (s) => {
//     if (typeof s !== 'string') return ''
//     return s.charAt(0).toUpperCase() + s.slice(1)
//   }

const extensions = [
  '.js',
  '.ts',
  '.tsx'
]

// ts
const tsPlugin = ts({
  tsconfig: getPath('./tsconfig.json'), // 导入本地ts配置
  extensions
})


// eslint
// const esPlugin = eslint({
//   throwOnError: true,
//   include: ['components/**/*.ts'],
//   exclude: ['node_modules/**', 'lib/**']
// })


// 基础配置
const commonConf = {
  input: getPath('./components/index.ts'),
  plugins:[
    // esPlugin,
    vue(),
    tsPlugin,
    nodeResolve({ mainFields: ["module", "main", "browser"] }),
    commonjs({ extensions, sourceMap: true }),
    babel({ babelHelpers: "bundled", extensions }), // babelHelpers是bable的最佳实践方案 extensions编译的扩展文件
    // postcss({
    //   plugins: [cssnano],
    //   extract: "css/style.css", //css 输出路径
    // }),
    less(),
    // terser()
  ],
  acornInjectPlugins: [jsx()],
  external: ['vue'],
}
// 需要导出的模块类型
const outputMap = [
  // {
  //   file: packageJSON.umd, // 通用模块
  //   format: 'umd',
  //   sourcemap: true,
  // },
  {
    file: packageJSON.main, // es6模块
    format: 'es',
    sourcemap: true,
  },
  // {
  //   file: packageJSON.cjs, // es6模块
  //   format: 'cjs',
  //   sourcemap: true,
  // }
]

const buildConf = options => Object.assign({}, commonConf, options)

export default outputMap.map(output => buildConf({output: {
  name: packageJSON.name,
  ...output,
}}))