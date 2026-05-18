import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

// 1. 建立一個 Axios 實例
const service = axios.create({
  baseURL: '/api', // 使用相對路徑，透過 Vite 代理轉發到後端
  timeout: 5000,
  // 💡 關鍵：開啟此設定後，每次發送 API，瀏覽器都會自動把同網域的 HttpOnly Cookie 塞進請求中！
  withCredentials: true,
})

// 1. 設定請求攔截器 (可選：用於調試)
service.interceptors.request.use(
  (config) => {
    console.log('📤 發送請求:', config.method?.toUpperCase(), config.url)
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 2. 設定回應攔截器 (Response Interceptor)
service.interceptors.response.use(
  (response) => {
    // console.log('✅ 收到回應:', response.config.url, response.status)

    // 特別檢查登入請求
    if (response.config.url?.includes('login')) {
      console.log(' 登入成功')
    }
    return response
  },
  (error) => {
    console.log(' 請求失敗:', error.config?.url, error.response?.status)

    // 💡 當後端因為 Cookie 過期或無效，踢回 401 Unauthorized 時
    if (error.response && error.response.status === 401) {
      const authStore = useAuthStore()
      const currentPath = window.location.pathname

      // 避免在登入頁重複跳轉
      if (currentPath !== '/dashboard/login') {
        authStore.clearLoginInfo()

        router.push('/dashboard/login')
      }
    }
    return Promise.reject(error)
  },
)

export default service
