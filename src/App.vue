<template>
  <Header />
  <div class="tenant">
    <div class="tenant__side">
       <side-menu></side-menu>
    </div>
    <div class="tenant__content">
      <setction>
        <router-view/>
      </setction>
      <footer class="footer">
        <Footer />
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Header, SideMenu, Footer } from './layouts'

export default defineComponent({
  name: 'App',
  components: {
    Header,
    'side-menu': SideMenu,
    Footer,
  }
})
</script>

<style>
@import url('./assets/less/site.less');

</style>