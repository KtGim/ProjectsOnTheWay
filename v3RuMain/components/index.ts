import { App } from 'vue'
import Demo from './Demo'
import HW from './HW'

const components = [
  Demo,
  HW,
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
  Demo,
  HW
}