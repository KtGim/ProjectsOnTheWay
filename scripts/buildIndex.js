const {resolve} = require('path');
const fs = require('fs');
const buildCompIndexTemplate = require('./buildCompIndexTemplate');
const buildIndexTemplate = require('./buildIndexTemplate');
const buildCompIndexLessTemplate = require('./buildCompIndexLessTemplate');
const routersRoot = resolve(__dirname, `../components`);
const { done } = require('./chalkLog');


module.exports = (componentName, componentNames, type) => {
  if (type === 'created') {
    const compTemplate = buildCompIndexTemplate(componentName);
    fs.writeFileSync(resolve(routersRoot, `${componentName}/index.tsx`), compTemplate, 'utf-8');
    done(`${componentName}/index.tsx  创建完毕!`)
    const lessTemplate = buildCompIndexLessTemplate(componentName);
    fs.writeFileSync(resolve(routersRoot, `${componentName}/index.less`), lessTemplate, 'utf-8');
    done(`${componentName}/index.less  创建完毕!`)
  }

  // 修改 index.ts 文件
  const indexTemplate = buildIndexTemplate(componentName, componentNames);
  fs.writeFileSync(resolve(routersRoot, 'index.ts'), indexTemplate, 'utf-8');
  done(`components/index.ts  更新完毕!`)
}