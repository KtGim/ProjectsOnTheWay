
    import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
    import ReadMe from '../../README.md';
    import Demo from '@/docs/Demo/index.md';
    import HelloWorld from '@/docs/HelloWorld/index.md';
    import Demo1 from '@/docs/Demo1/index.md';


    const routes: Array<RouteRecordRaw> = [
      {
        path: '/',
        name: 'ReadMe',
        component: ReadMe,
      },
      {
        path: '/Demo',
        name: 'Demo',
        component: Demo,
      },{
        path: '/HelloWorld',
        name: 'HelloWorld',
        component: HelloWorld,
      },{
        path: '/Demo1',
        name: 'Demo1',
        component: Demo1,
      }
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
  