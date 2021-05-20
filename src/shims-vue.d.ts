declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module "*.md" {
  const value: any;
  export default value;
}

declare module 'tenantui'

declare module 'argvs'