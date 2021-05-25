import { App, defineComponent } from 'vue';
import { createBEM } from '../../utils/createBem';
import './index.less';

/** aaaa */
interface Props {
  a: number; // 属性 a
  b: string; // 属性 b
  c: M; // 属性 c1
}

type M = '1' | '2' | '3' | '4'

const Demo = defineComponent({
  name: 'Demo',
  setup(props:Props) {
    const baseClass = createBEM('demo')();
    return () => <div class={baseClass}>
      Demo
    </div>
  }
})

Demo.install = function (Vue: App) {
  Vue.component(Demo.name, Demo);
};

export default Demo;