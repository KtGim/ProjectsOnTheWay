# Demo1

```vue demo
<template>
  <Demo1 />
</template>
<script>
  import { defineComponent } from 'vue'
  import { Demo1 } from '@/components'
  export default defineComponent({
    name: 'App',
    components: {
      Demo1,
    }
  })
</script>
```

## 组件属性

|名称  | 描述 | 类型 |default|
|--|--|--|--|
| a | - | M (取值为: '1' , '2' , '3') | - |
