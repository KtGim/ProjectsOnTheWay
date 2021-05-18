const buildCompIndexTemplate = (componentName) => {

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
    return () => <div class={createBEM('${componentName.toLowerCase()}')()}>
      ${componentName}
    </div>
  }
})

${componentName}.install = function (Vue: App) {
  Vue.component(${componentName}.name, ${componentName});
};

export default ${componentName};`
}

module.exports = buildCompIndexTemplate;