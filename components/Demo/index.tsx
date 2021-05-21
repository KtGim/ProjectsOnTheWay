import { App, defineComponent } from 'vue';
import { createBEM } from '../../utils/createBem';
import './index.less';

interface Props {
  a: number;
  b: string;
  c: M;
}

type M = '1' | '2' | '3' | '4'

const Demo = defineComponent({
  name: 'Demo',
  setup(props:Props) {
    return () => <div class={createBEM('demo')()}>
      Demo
    </div>
  }
})

Demo.install = function (Vue: App) {
  Vue.component(Demo.name, Demo);
};

export default Demo;