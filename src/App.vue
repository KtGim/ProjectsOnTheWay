<template>
  <div>
    <header class="header">
      <Header />
    </header>
  </div>
  <div>
    <div class="side__menu">
      <side-menu></side-menu>
    </div>
    <div class="content">
      <setction>
        <router-view/>
      </setction>
      <DemoMD />
      <HelloWorldMD />
      <footer class="footer">
        <Footer />
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import DemoMD from '@/docs/Demo/index.md'
import HelloWorldMD from '@/docs/HelloWorld/index.md'
import { Header, SideMenu, Footer } from './layouts'

export default defineComponent({
  name: 'App',
  components: {
    DemoMD,
    HelloWorldMD,
    Header,
    'side-menu': SideMenu,
    Footer,
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.side__menu {
  width: 10%;
}

.content {
  width: 90%;
}

</style>