const { argv } = require('argvs');

const buildTemplate = (leadingInNames) => {

  if (argv.env === 'pro') {
    leadingInNames = leadingInNames.filter(name => name !== 'Demo' && name !== 'HelloWorld')
  }
  let imports = '';
  leadingInNames.forEach((name, index) => {
    if (index === 0) {
      imports += `import ${name} from '@/docs/${name}/index.md';\n`;
    } else {
      imports += `    import ${name} from '@/docs/${name}/index.md';\n`;
    }
  });
  return `
    import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
    import ReadMe from '../../README.md';
    ${imports}

    const routes: Array<RouteRecordRaw> = [
      {
        path: '/',
        name: 'ReadMe',
        component: ReadMe,
      },
      ${leadingInNames.map((name) => `{
        path: '/${name}',
        name: '${name}',
        component: ${name},
      }`)}
    ]
    
    const router = createRouter({
      history: createWebHistory(),
      routes,
      scrollBehavior: () => {
        return {
          left: 0,
          top: 0,
        }
      },
    });
    
    router.beforeEach(async (to, from, next) => {
      /* 路由发生变化修改页面title */
      if (to.meta.title) {
        document.title = to.meta.title as string;
      }
      next();
    });
    export {
      routes
    }
    export default router;
  `
}

module.exports = buildTemplate;