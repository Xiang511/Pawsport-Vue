import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import request from '@/api/axios'

/**
 * 處理登出流程的 composable
 */
export function useLogout() {
  const authStore = useAuthStore()
  const router = useRouter()

  /**
   * 呼叫登出 API，清除登入狀態並重新整理頁面
   */
  const logout = async () => {
    if (!confirm('確定要登出嗎？')) return

    try {
      await request.post('/Auth/logout')
    } catch (error) {
      console.error('登出請求失敗:', error)
    }

    authStore.clearLoginInfo()
    router.replace('/').then(() => {
      window.location.reload()
    })
  }

  return { logout }
}
