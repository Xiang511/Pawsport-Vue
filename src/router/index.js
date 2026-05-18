import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

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
  const authStore = useAuthStore()

  // 設置頁面標題
  if (to.meta.title) {
    document.title = to.meta.title
  }

  // 需要認證的路由檢查
  const publicRoutes = ['/dashboard/login', '/signup', '/']
  const requiresAuth = !publicRoutes.includes(to.path) && to.path.startsWith('/dashboard')

  if (requiresAuth && !authStore.isLoggedIn) {
    // 如果需要認證但未登入，跳轉到登入頁
    next('/dashboard/login')
  } else {
    next()
  }
})

export default router
