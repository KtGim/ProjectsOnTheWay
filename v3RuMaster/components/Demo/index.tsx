import { App, defineComponent } from 'vue';
import './index.less';

const Demo = defineComponent({
  name: 'Demo',
  setup() {
    return () => <div class="demo">
      Demo
    </div>
  }
})

export default Demo;