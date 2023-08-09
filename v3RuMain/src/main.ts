import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'vite-plugin-vuedoc/style.css'

createApp(App).use(router).mount('#app')
