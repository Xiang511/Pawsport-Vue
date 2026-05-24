import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import adminRoutes from './Tailadmin'
import ClientRoutes from './Client'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...ClientRoutes,
    ...adminRoutes,
    // 全局 404
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      redirect: (to) => {
        // 如果是後台路徑，跳轉到後台 404
        if (to.path.startsWith('/dashboard')) {
          return '/dashboard/error-404'
        }
        // 前台路徑跳轉到首頁
        return '/error-404'
      },
    },
  ],
})

router.beforeEach((to, from) => {
  const authStore = useAuthStore()

  // 設置頁面標題
  if (to.meta.title) {
    document.title = to.meta.title
  }

  // 防止直接訪問錯誤頁面（403, 404）
  const errorPages = ['/dashboard/error-403', '/dashboard/error-404', '/error-404']
  if (errorPages.includes(to.path)) {
    // 如果是直接訪問（from.path 為空或是起始頁）
    if (!from.name || from.path === '/') {
      console.log('禁止直接訪問錯誤頁面:', to.path)
      if (to.path.startsWith('/dashboard')) {
        return '/dashboard'
      } else {
        return '/'
      }
    }
  }

  // 公開路由（不需要認證）
  const publicRoutes = ['/dashboard/login', '/login', '/signup', '/', '/error-404']

  // 後台路由檢查 - 所有 /dashboard 開頭的都需要登入
  if (to.path.startsWith('/dashboard')) {
    const isDashboardPublic =
      publicRoutes.includes(to.path) || to.path.startsWith('/dashboard/error')
    if (!isDashboardPublic && !authStore.isLoggedIn) {
      // 後台需要認證但未登入，跳轉到後台登入頁
      console.log('未登入，從', to.path, '跳轉到 /dashboard/login')
      return '/dashboard/login'
    }
  }

  // 前台需要認證的路由檢查 - 所有 /user 開頭的都需要登入
  if (to.path.startsWith('/user') || to.path.startsWith('/game')) {
    if (!authStore.isLoggedIn) {
      // 前台需要認證但未登入，跳轉到前台登入頁
      console.log('未登入，從', to.path, '跳轉到 /login')
      return '/login'
    }
  }

  // 允許繼續導航
  return true
})

export default router
