import { App, defineComponent } from 'vue';
import './index.less';

interface Props {
  a: number;
  b: string;
}

type M = '1' | '2' | '3'

const Demo = defineComponent({
  name: 'Demo',
  setup(props:Props) {
    console.log(props.a);
    return () => <div class="demo">
      Demo
    </div>
  }
})

Demo.install = function (Vue: App) {
  Vue.component(Demo.name, Demo);
};

export default Demo;