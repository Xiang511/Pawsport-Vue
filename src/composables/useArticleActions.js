import { ref } from 'vue'
import request from '@/api/axios'
import { useAuthStore } from '@/stores/auth'

export function useArticleActions() {
  const authStore = useAuthStore()

  // 共享的狀態
  const draftsData = ref([])
  const isActionLoading = ref(false)

  // ===撈取草稿清單===
  const fetchDrafts = async () => {
    try {
      const userId = authStore.userInfo?.userId
      if (!userId) {
        console.warn('找不到使用者 ID，無法載入草稿')
        return
      }
      const response = await request.get('/Article', {
        params: {
          Status: 0,
          UserId: userId,
          IsActive: true,
        },
      })

      if (response.data && response.data.data) {
        draftsData.value = response.data.data
      }
    } catch (error) {
      console.error('Composable 撈取草稿失敗:', error)
    }
  }

  // ===實作軟刪除===
  const deleteDraft = async (id) => {
    isActionLoading.value = true
    try {
      // 呼叫後端刪除 API（後端內部會把 IsExist 設為 false）
      await request.patch(`/Article/${id}`)
      await fetchDrafts()

      return { success: true, message: '草稿已成功刪除' }
    } catch (error) {
      console.error('Composable 刪除草稿失敗:', error)
      return { success: false, message: '刪除草稿失敗' }
    } finally {
      isActionLoading.value = false
    }
  }

  // 把外面的組件需要用到的狀態和函式吐出去
  return {
    draftsData,
    isActionLoading,
    fetchDrafts,
    deleteDraft,
  }
}
