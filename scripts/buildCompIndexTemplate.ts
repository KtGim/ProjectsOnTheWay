const buildCompIndexTemplate: (componentName: string) => string = (componentName: string) => {

  return `import { App, defineComponent } from 'vue';
import './index.less'
import { createBEM } from '../../utils/createBem';

interface Props {
  a: M;
}

type M = '1' | '2' | '3'

const ${componentName} = defineComponent({
  name: '${componentName}',
  setup(props:Props) {
    const baseClass = createBEM('${componentName.toLowerCase()}')();
    return () => <div class={baseClass}>
      ${componentName}
    </div>
  }
})

${componentName}.install = function (Vue: App) {
  Vue.component(${componentName}.name, ${componentName});
};

export default ${componentName};`
}

export default buildCompIndexTemplate;