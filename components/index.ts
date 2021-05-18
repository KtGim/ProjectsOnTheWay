import { App } from 'vue'
import Demo from './Demo';
import HelloWorld from './HelloWorld';
import Demo1 from './Demo1';


const components = [
  Demo,HelloWorld,Demo1
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
  Demo,HelloWorld,Demo1
}