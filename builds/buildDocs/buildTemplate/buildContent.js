"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var argvs_1 = __importDefault(require("argvs"));
var buildContent = function (instanceName) {
    var stringMd = '```';
    return "# " + instanceName + "\n\n" + stringMd + "vue demo\n<template>\n  <" + instanceName + " />\n</template>\n<script>\n  import { defineComponent } from 'vue'\n  import { " + instanceName + " } from '" + (argvs_1["default"].env === 'pro' ? 'tenantui' : '@/components') + "'\n  export default defineComponent({\n    name: 'App',\n    components: {\n      " + instanceName + ",\n    }\n  })\n</script>\n" + stringMd;
};
exports["default"] = buildContent;
