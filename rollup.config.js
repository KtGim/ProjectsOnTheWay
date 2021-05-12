import fs from 'fs'
import path from 'path'

const { commonConf, outputMap } = require('./config/rollupOptions');

const root = path.resolve(__dirname, './components')
const o = path.resolve(__dirname, './lib');

module.exports = fs.readdirSync(root)
    .filter(item => fs.statSync(path.resolve(root, item)).isDirectory())
    .map(item => {
      // 获取每个包的配置文件
      return {
        ...commonConf(`${root}/index.ts`, `${o}/${item}/style/index.css`),
        output: {
          ...outputMap(`${o}/${item}/index.js`)
        }
      }
    }).concat({
      ...commonConf(`${root}/index.ts`, `${o}/index.css`),
      output: {
        ...outputMap(`${o}/index.esm.js`)
      },
    })