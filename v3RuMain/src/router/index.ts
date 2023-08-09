import { createRouter, createWebHistory, RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
import Demo from '@/docs/demo.md';

const routes: Array<RouteRecordRaw> = [
  {
    path: `/demo`,
    name: 'Demo',
    component: Demo,
  },
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

export default router;
