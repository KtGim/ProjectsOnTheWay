const path = require('path');
const parseTsFile = require('./parseTsFile');
const fs = require('fs');
const { yellow } = require('./chalkLog');

const stringMd = '```';
const buildMdTemplate = (componentName) => {
  if (!componentName) {
    return;
  }
  let pathname = path.resolve(__dirname, `../components/${componentName}/index.tsx`);
  let instanceName = componentName;
  if (!fs.existsSync(pathname)) {
    pathname = path.resolve(__dirname, `../components/Demo/index.tsx`);
    instanceName = 'Demo';
    yellow(`${componentName}/index.tsx 文件不存在, 生成 默认 Demo 文档`)
  }
  
  const {
    propAlias,
    typeAlias
  } = parseTsFile(pathname);
  // console.log(propAlias, typeAlias);

let propsCellsInfo = '';
Object.keys(propAlias).forEach(key => {
  let propsInfos = propAlias[key];
  if (typeAlias.get(propAlias[key])) {
    propsInfos = typeAlias.get(propAlias[key])
    propsCellsInfo += `| ${key} | - | ${propAlias[key]} (取值为: ${propsInfos.replace(/\|/g, ',')}) | - |\n`;
  } else {
    propsCellsInfo += `| ${key} | - | ${propsInfos} | - |\n`;
  }
})

  return `# ${instanceName}

${stringMd}vue demo
<template>
  <${instanceName} />
</template>
<script>
  import { defineComponent } from 'vue'
  import { ${instanceName} } from 'tenantui'
  export default defineComponent({
    name: 'App',
    components: {
      ${instanceName},
    }
  })
</script>
${stringMd}

## 组件属性

|名称  | 描述 | 类型 |default|
|--|--|--|--|
${propsCellsInfo}`}

module.exports = buildMdTemplate;