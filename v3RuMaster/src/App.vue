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
      <footer class="footer">
        <Footer />
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import DemoMD from '@/docs/demo.md'
import { Header, SideMenu, Footer } from './layouts'

export default defineComponent({
  name: 'App',
  components: {
    DemoMD,
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