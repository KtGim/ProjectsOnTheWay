const stringMd = '```';
const buildMdTemplate = (componentName) => {
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
  `
}

module.exports = buildMdTemplate;