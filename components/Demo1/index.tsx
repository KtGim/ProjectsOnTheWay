import { App, defineComponent } from 'vue';
import './index.less'
import { createBEM } from '../../utils/createBem';

interface Props {
  a: M;
}

type M = '1' | '2' | '3'

const Demo1 = defineComponent({
  name: 'Demo1',
  setup(props:Props) {
    return () => <div class={createBEM('demo1')()}>
      Demo1
    </div>
  }
})

Demo1.install = function (Vue: App) {
  Vue.component(Demo1.name, Demo1);
};

export default Demo1;