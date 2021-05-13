// const path = require('path');
// const fs = require('fs');
// const root = path.resolve(__dirname, '../components');

const buildTemplate = (leadingInNames) => {
  // const leadingInNames.map(name => `import ${name} from '@/docs/${name}/index.md';\n`) = fs.readdirSync(root)
  //   .filter((f) =>
  //     fs.statSync(path.join(root, f)).isDirectory() && f !== 'style'
  //   )
  
  // (leadingInNames.indexOf(addName) === -1) && leadingInNames.push(addName);

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
    ${imports}

    const routes: Array<RouteRecordRaw> = [
      ${leadingInNames.map((name) => `{
        path: '/${name}',
        name: ${name},
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