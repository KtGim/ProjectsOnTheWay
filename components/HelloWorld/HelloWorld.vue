<template>
  <h1 class="a">{{ msg }}</h1>
    <button @click="count++">count is: {{ count }}</button>
    <a href="#">link</a>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'
export default defineComponent({
  name: 'HelloWorld',
  props: {
    msg: {
      type: String,
      required: true
    }
  },
  setup: () => {
    const count = ref(0)
    return { count }
  }
})
</script>

<style scoped lang="less">
@import url('../style/var.less');

a {
  color: @link-color;
  &:hover {
    color: @highlight-text-color
  }
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: @primary-text-color;
}
</style>
