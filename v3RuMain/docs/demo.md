# Demo

```vue demo
<template>
  <HelloWorld msg="好像爱这个世界啊！！" />
  <Demo />
</template>
<script>
  import { defineComponent } from 'vue'
  import { HW, Demo } from '../components/index.ts'
  export default defineComponent({
    name: 'App',
    components: {
      HelloWorld: HW,
      Demo,
    }
  })
</script>
```
