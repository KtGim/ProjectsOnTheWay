"use strict";
exports.__esModule = true;
var buildCompIndexTemplate = function (componentName) {
    return "import { App, defineComponent } from 'vue';\nimport './index.less'\nimport { createBEM } from '../../utils/createBem';\n\ninterface Props {\n  a: M;\n}\n\ntype M = '1' | '2' | '3'\n\nconst " + componentName + " = defineComponent({\n  name: '" + componentName + "',\n  setup(props:Props) {\n    const baseClass = createBEM('" + componentName.toLowerCase() + "')();\n    return () => <div class={baseClass}>\n      " + componentName + "\n    </div>\n  }\n})\n\n" + componentName + ".install = function (Vue: App) {\n  Vue.component(" + componentName + ".name, " + componentName + ");\n};\n\nexport default " + componentName + ";";
};
exports["default"] = buildCompIndexTemplate;
