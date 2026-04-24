import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 使用 Default Layout 的路由
    {
      path: '/',
      component: () => import('@/layouts/default.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView,
        },
        {
          path: 'about',
          name: 'about',
          component: () => import('../views/AboutView.vue'),
        },
      ],
    },
    // 使用 Basic Layout 的路由（例如：登入頁、註冊頁等不需要導航的頁面）
    {
      path: '/auth',
      component: () => import('@/layouts/basic.vue'),
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('@/components/test.vue'),
        },
        // 可以加更多不需要導航列的頁面
      ],
    },
  ],
})

export default router
