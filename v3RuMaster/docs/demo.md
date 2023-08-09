# Demo

```vue demo
<template>
  <HelloWorld msg="好像爱这个世界啊！！" />
  <Demo />
</template>
<script>
  import { defineComponent } from 'vue'
  import { HelloWorld, Demo } from 'thc'
  export default defineComponent({
    name: 'App',
    components: {
      HelloWorld,
      Demo,
    }
  })
</script>
```
