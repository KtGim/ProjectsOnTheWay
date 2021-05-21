"use strict";
exports.__esModule = true;
var buildCompIndexLessTemplate = function (componentName) {
    return "@import url('../style/var.less');\n\n.tenant {\n  &-" + componentName.toLowerCase() + " {\n    background: @primary-color;\n  }\n}";
};
exports["default"] = buildCompIndexLessTemplate;
