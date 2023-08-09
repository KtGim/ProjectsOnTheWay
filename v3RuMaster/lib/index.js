import { defineComponent, ref, pushScopeId, popScopeId, openBlock, createBlock, Fragment, createVNode, toDisplayString, withScopeId, createTextVNode } from 'vue';

var script = defineComponent({
    name: 'HelloWorld',
    props: {
        msg: {
            type: String,
            required: true
        }
    },
    setup: () => {
        const count = ref(0);
        return { count };
    }
});

const _withId = /*#__PURE__*/withScopeId("data-v-763db97b");

pushScopeId("data-v-763db97b");
const _hoisted_1 = { class: "a" };
popScopeId();

const render = /*#__PURE__*/_withId((_ctx, _cache, $props, $setup, $data, $options) => {
  return (openBlock(), createBlock(Fragment, null, [
    createVNode("h1", _hoisted_1, toDisplayString(_ctx.msg), 1 /* TEXT */),
    createVNode("button", {
      onClick: _cache[1] || (_cache[1] = $event => (_ctx.count++))
    }, "count is: " + toDisplayString(_ctx.count), 1 /* TEXT */)
  ], 64 /* STABLE_FRAGMENT */))
});

script.render = render;
script.__scopeId = "data-v-763db97b";
script.__file = "components/HelloWorld.vue";

const Demo = defineComponent({
  name: 'Demo',

  setup() {
    return () => createVNode("div", {
      "class": "demo"
    }, [createTextVNode("Demo")]);
  }

});

// HelloWorld.install = function (Vue: any) {
//     Vue.component(HelloWorld.name, HelloWorld);
// };
//  2、遍历注册所有的组件（依赖），全局时使用

const components = [script, Demo]; // components.forEach(component => {
//   component.install = (app: App) => app.component(component.name, component);
// });

const install = function (Vue, opts = {}) {
  components.forEach(component => {
    Vue.use(component);
  }); // 这里除了注册组件，还可以做一些其他的东西
  // 你可以在Vue的原型上扩展一些方法
  // eg:element-ui
  //      Vue.prototype.$message = Message;
  //      使用：this.$message({message:"xxxxx",type:"success"});
}; //      可以根据实际情况，是否需要这段代码（CDN引入，便可使用所有组件）
// @ts-ignore


if (typeof window !== 'undefined' && window.Vue) {
  // @ts-ignore
  install(window.Vue);
} //  3、导出类库的版本、组件、Vue插件需要暴露的install方法


const version = '0.0.1';

export { Demo, script as HelloWorld, install, version };
//# sourceMappingURL=index.js.map
