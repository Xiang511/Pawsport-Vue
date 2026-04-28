import { createRouter, createWebHistory } from 'vue-router'

import adminRoutes from './Tailadmin'
import clientRoutes from './client'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...clientRoutes,
    ...adminRoutes,
    // 全局 404
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      redirect: '/dashboard/error-404',
    },
  ],
})

router.beforeEach((to, from, next) => {
  // 設置頁面標題
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router
