const path = require('path');
const parseTsFile = require('./parseTsFile');

const stringMd = '```';
const buildMdTemplate = (componentName) => {
  if (!componentName) {
    return;
  }
  const {
    propAlias,
    typeAlias
  } = parseTsFile(path.resolve(__dirname, `../components/${componentName}/index.tsx`));
  // console.log(propAlias, typeAlias);

let propsCellsInfo = '';
Object.keys(propAlias).forEach(key => {
  propsCellsInfo += `| ${key} | ${propAlias[key]} | - |\n`;
})

  return `# ${componentName}

${stringMd}vue demo
<template>
  <${componentName} />
</template>
<script>
  import { defineComponent } from 'vue'
  import { ${componentName} } from 'tenantui'
  export default defineComponent({
    name: 'App',
    components: {
      ${componentName},
    }
  })
</script>
${stringMd}

## 组件属性
|名称  | 类型 |default|
|--|--|--|
${propsCellsInfo}`}

module.exports = buildMdTemplate;