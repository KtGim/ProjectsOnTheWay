const buildCompIndexLessTemplate: (componentName: string) => string = (componentName) => {

  return `@import url('../style/var.less');

.tenant {
  &-${componentName.toLowerCase()} {
    background: @primary-color;
  }
}`}

export default buildCompIndexLessTemplate;