const buildCompIndexLessTemplate = (componentName) => {

  return `@import url('../style/var.less');

.tenant {
  &-${componentName.toLowerCase()} {
    background: @primary-color;
  }
}`}

module.exports = buildCompIndexLessTemplate;