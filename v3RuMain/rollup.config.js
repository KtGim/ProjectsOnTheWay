import fs from 'fs'
import path from 'path'

const { commonConf, outputMap } = require('./rollupConfig/baseOptions');

const root = path.resolve(__dirname, './components')
const o = path.resolve(__dirname, './lib');
const components = fs
  .readdirSync(root)
    .filter((f) =>
      fs.statSync(path.join(root, f)).isDirectory()
    )

const entries = {
  index: './components/index.ts',
  ...components.reduce((obj, name) => {
    obj[name] = (root + `/${name}/index.tsx`)
    return obj
  }, {})
}

// module.exports = {
//   ...commonConf(`${root}/index.ts`),
//   input: entries,
//   output: {
//     format: 'esm',
//     dir: 'lib',
//     exports: 'named'
//   },
// }

const capitalize = s => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const mapComponent = name => {
  return [
    {
      ...commonConf(`${root}/${name}/index.tsx`, `${o}/${name}/style/index.css`),
      output: {
        format: "umd",
        name: capitalize(name),
        file: `${o}/${name}/index.js`,
        exports: "named",
        globals: {
          vue: 'Vue'
        }
      },
    }
  ];
};

const ind = [
  ...components.map(f => mapComponent(f)).reduce((r, a) => r.concat(a), [])
];

const esConfig = {
  ...commonConf(`${root}/index.ts`),
  input: entries,
  output: {
    format: "esm",
    dir: "lib/esm"
  },
};

const merged = {
  ...commonConf(`${root}/index.ts`),
  input: "components/index.ts",
  output: {
    format: "esm",
    file: "lib/index.esm.js"
  },
};

module.exports = [
  esConfig,
  merged,
  ...ind
]


// module.exports = fs.readdirSync(root)
//     .filter(item => fs.statSync(path.resolve(root, item)).isDirectory())
//     .map(item => {
//         // 获取每个包的配置文件
//         return {
//           plugins:[
//             // esPlugin,
//             vue({
//               css: true,
//               compileTemplate: true
//             }),
//             less({
//               output: output ? output : false, 
//               insert: true, // 自动 添加到 header 标签内
//             }),
//             tsPlugin,
//             babel({
//               babelHelpers: "runtime",
//               extensions,
//               exclude: 'node_modules/**', // 防止打包node_modules下的文件
//             }), // babelHelpers是bable的最佳实践方案 extensions编译的扩展文件
//             nodeResolve(),
//             commonjs({ extensions, sourceMap: true }),
//             // terser()
//           ],
//       acornInjectPlugins: [jsx()],
//       external: ['vue'],
//       preserveSymlinks: true,
//           output: {
//             ...outputMap(`${o}/${item}/index.js`)
//           },
//       }
//       }).concat({
//         ...commonConf(`${root}/index.ts`),
//         output: {
//           ...outputMap(`${o}/index.js`)
//         },
//       })