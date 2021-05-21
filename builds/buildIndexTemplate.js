"use strict";
exports.__esModule = true;
var buildIndexTemplate = function (componentNames) {
    var imports = '';
    componentNames.forEach(function (name, index) {
        if (index === 0) {
            imports += "import " + name + " from './" + name + "';\n";
        }
        else {
            imports += "import " + name + " from './" + name + "';\n";
        }
    });
    return "import { App } from 'vue'\n" + imports + "\n\nconst components = [\n  " + componentNames.map(function (name) { return name; }) + "\n]\n\nconst install = function (Vue: App) {\n  // \u5224\u65AD\u662F\u5426\u5B89\u88C5\n  // @ts-ignore\n  if (install.installed) return\n  // \u904D\u5386\u6CE8\u518C\u5168\u5C40\u7EC4\u4EF6\n  components.map(component => Vue.component(component.name, component))\n}\n// @ts-ignore\nif (typeof window !== 'undefined' && window.Vue) {\n  // @ts-ignore\n  install(window.Vue)\n}\n\nexport {\n  " + componentNames.map(function (name) { return name; }) + "\n}";
};
exports["default"] = buildIndexTemplate;
