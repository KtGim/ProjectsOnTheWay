const fs = require('fs');
const { resolve, join } = require('path');
const { commonConf, outputMap } = require('./baseOptions');
const rollup = require('rollup');

const p = resolve(__dirname, '../components');
const o = resolve(__dirname, '../lib');

const dirs = fs
  .readdirSync(p)
    .filter((f) =>
      fs.statSync(join(p, f)).isDirectory()
    )

dirs.forEach(async (dir) => {
  try {
    const bundle = await rollup.rollup(commonConf(`${p}/${dir}/index.tsx`, `${o}/${dir}/index.css`));
    await bundle.write(outputMap(`${o}/${dir}/index.js`)); 
  } catch(err) {
    console.log(`${dir}打包失败 err: ${err}`)
  }
})

// 打包 index.tsx
const formatIndex = async() => {
  try {
    const bundle = await rollup.rollup(commonConf(`${p}/index.ts`, `${o}/index.css`));
    await bundle.write(outputMap(`${o}/index.js`));
  } catch(err) {
    console.log(`index.ts 打包失败: ${err}`)
  }
}

formatIndex();
