const buildIndexTemplate: (componentNames: string[]) => string = (componentNames) => {

  let imports = '';
  componentNames.forEach((name, index) => {
    if (index === 0) {
      imports += `import ${name} from './${name}';\n`;
    } else {
      imports += `import ${name} from './${name}';\n`;
    }
  });

  return `import { App } from 'vue'
${imports}

const components = [
  ${
    componentNames.map(name => name)
  }
]

const install = function (Vue: App) {
  // 判断是否安装
  // @ts-ignore
  if (install.installed) return
  // 遍历注册全局组件
  components.map(component => Vue.component(component.name, component))
}
// @ts-ignore
if (typeof window !== 'undefined' && window.Vue) {
  // @ts-ignore
  install(window.Vue)
}

export {
  ${
    componentNames.map(name => name)
  }
}`}

export default buildIndexTemplate;