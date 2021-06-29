const autoprefixer = require('autoprefixer')
const postcss = require('postcss')
import pxToRem from 'postcss-plugin-px2rem';
const fs = require('fs')
const {promisify} = require('util');

export default function px2rem () {
  return {
      name: 'px2rem', // 这个名字将会出现在在警告和报错中
      resolveId ( importee ) {
        // if (importee === 'virtual-module') {
        //     return importee; // 这个告诉rollup不应该通过其他的插件或者检查文件系统去寻找这个id
        // }
        return null; // 其他的id不受影响
      },
      load ( id ) {
        if (id.indexOf('.less') > -1 && id.indexOf('/components/') > -1) {
          console.log(id);
          const data = fs.readFileSync(id, 'utf-8');
          const result = postcss([autoprefixer, pxToRem({
            rootValue: 37.5,
            unitPrecision: 3,
            propBlackList: ['font-size', 'border'],
            exclude: /(node_module)/,
            mediaQuery: false,
            minPixelValue: 5
          })]).process(data)
          return result.css
        }
        return null; // 其他的id还是通过正常的方式解析
      }
  };
}