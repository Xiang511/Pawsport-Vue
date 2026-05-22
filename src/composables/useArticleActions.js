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

  // ===軟刪除===
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

  // 統一處理 POST / PUT 的請求發送
  const saveOrUpdateArticle = async (currentId, postData, statusValue) => {
    const payload = { ...postData, status: statusValue }
    const isNew = !currentId || currentId === 'undefined' || currentId === 'null'

    try {
      if (isNew) {
        // 全新文章：POST
        const response = await request.post('/Article', payload)
        // 回傳後端生成的新 ID
        return { success: true, isNew: true, status: response.status, data: response.data?.data }
      } else {
        // 現有文章更新：PUT
        const response = await request.put(`/Article/${currentId}`, payload)
        return { success: true, isNew: false, status: response.status, data: currentId }
      }
    } catch (error) {
      console.error('文章處理失敗:', error)
      throw error // 丟給組件去處理 alert 錯誤訊息
    }
  }

  // 把外面的組件需要用到的狀態和函式吐出去
  return {
    draftsData,
    isActionLoading,
    fetchDrafts,
    deleteDraft,
    saveOrUpdateArticle,
  }
}
