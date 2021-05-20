import argv from 'argvs';

const buildContent = (instanceName: string) => {
const stringMd = '```';

  return `# ${instanceName}

${stringMd}vue demo
<template>
  <${instanceName} />
</template>
<script>
  import { defineComponent } from 'vue'
  import { ${instanceName} } from '${argv.env === 'pro' ? 'tenantui' : '@/components'}'
  export default defineComponent({
    name: 'App',
    components: {
      ${instanceName},
    }
  })
</script>
${stringMd}`;
}

export default buildContent;