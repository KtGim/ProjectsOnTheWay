"use strict";
exports.__esModule = true;
var argv = require('argvs').argv;
var buildTemplate = function (leadingInNames) {
    if (argv.env === 'pro') {
        leadingInNames = leadingInNames.filter(function (name) { return name !== 'Demo' && name !== 'HelloWorld'; });
    }
    var imports = '';
    leadingInNames.forEach(function (name, index) {
        if (index === 0) {
            imports += "import " + name + " from '@/docs/" + name + "/index.md';\n";
        }
        else {
            imports += "    import " + name + " from '@/docs/" + name + "/index.md';\n";
        }
    });
    return "\n    import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';\n    import ReadMe from '../../README.md';\n    " + imports + "\n\n    const routes: Array<RouteRecordRaw> = [\n      {\n        path: '/',\n        name: 'ReadMe',\n        component: ReadMe,\n      },\n      " + leadingInNames.map(function (name) { return "{\n        path: '/" + name + "',\n        name: '" + name + "',\n        component: " + name + ",\n      }"; }) + "\n    ]\n    \n    const router = createRouter({\n      history: createWebHistory(),\n      routes,\n      scrollBehavior: () => {\n        return {\n          left: 0,\n          top: 0,\n        }\n      },\n    });\n    \n    router.beforeEach(async (to, from, next) => {\n      /* \u8DEF\u7531\u53D1\u751F\u53D8\u5316\u4FEE\u6539\u9875\u9762title */\n      if (to.meta.title) {\n        document.title = to.meta.title as string;\n      }\n      next();\n    });\n    export {\n      routes\n    }\n    export default router;\n  ";
};
exports["default"] = buildTemplate;
