import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { HelloWorld, Demo} from 'tenantui';
import 'vite-plugin-vuedoc/style.css'
import 'tenantui/lib/index.css'

createApp(App).use(HelloWorld).use(Demo).use(router).mount('#app')
