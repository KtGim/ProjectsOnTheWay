//  1、这里导入需要导出的组件，统一处理
import { App, DefineComponent } from 'vue';

import HelloWorld from './HelloWorld.vue';
import Demo from './Demo';
//      1.1、书写Vue插件（保证只引入某一个组件时可用），https://cn.vuejs.org/v2/guide/plugins.html
// HelloWorld.install = function (Vue: any) {
//     Vue.component(HelloWorld.name, HelloWorld);
// };

//  2、遍历注册所有的组件（依赖），全局时使用
const components: Array<DefineComponent | any> = [
  HelloWorld,
  Demo
];

// components.forEach(component => {
//   component.install = (app: App) => app.component(component.name, component);
// });

const install = function (Vue: App, opts = {}) {
    components.forEach(component => {
      Vue.use(component);
    });
    // 这里除了注册组件，还可以做一些其他的东西
    // 你可以在Vue的原型上扩展一些方法
    // eg:element-ui
    //      Vue.prototype.$message = Message;
    //      使用：this.$message({message:"xxxxx",type:"success"});
};

//      可以根据实际情况，是否需要这段代码（CDN引入，便可使用所有组件）
// @ts-ignore
if (typeof window !== 'undefined' && window.Vue) {
  // @ts-ignore
  install(window.Vue);
}
//  3、导出类库的版本、组件、Vue插件需要暴露的install方法
const version = '0.0.1';
export {
  version,
  install,
  HelloWorld,
  Demo
}