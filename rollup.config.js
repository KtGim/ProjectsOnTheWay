import fs from 'fs'
import path from 'path'

const { commonConf, outputMap } = require('./config/rollupOptions');

const root = path.resolve(__dirname, './components')
const o = path.resolve(__dirname, './lib');
const components = fs
  .readdirSync(root)
    .filter((f) =>
      fs.statSync(path.join(root, f)).isDirectory() && f !== 'style'
    )

const entries = {
  index: './components/index.ts',
  ...components.reduce((obj, name) => {
    obj[name] = (root + `/${name}/index.tsx`)
    return obj
  }, {})
}

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
  ...commonConf(`${root}/index.ts`, `${o}/index.css`),
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