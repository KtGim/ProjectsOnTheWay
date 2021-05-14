import { ref, defineComponent, watch } from "vue";
import { RouteRecordRaw } from 'vue-router';
import { routes } from '../../router';
import { useRoute } from 'vue-router';
import './index.less';

export default defineComponent({
  setup() {
    const route = useRoute();
    const path = ref<string>(location.pathname);
    watch(route, (value) => {
      path.value = value.path;
    })
    return () => <ul class="tenant__menu">
      {
        routes.map((item: RouteRecordRaw) => {
          return <li class={`tenant__menu__item ${path.value === item.path ? 'active' : undefined}`}>
            <router-link to={item.path}>{item.name}</router-link>
          </li>
        })
      }
    </ul>
  }
})