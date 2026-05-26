import { ref } from 'vue'
import request from '@/api/axios'

export function useArticleActions() {
  // 共享的狀態
  const draftsData = ref([])
  const isActionLoading = ref(false)

  // ===撈取草稿清單===
  const fetchDrafts = async () => {
    try {
      const response = await request.get('/Users/articles/drafts')
      draftsData.value = response.data.data || []
    } catch (error) {
      console.error('Composable 撈取草稿失敗:', error)
    } finally {
      isActionLoading.value = false
    }
  }

  const fetchDraftDetail = async (id) => {
    if (!id || id === 'undefined' || id === 'null') {
      throw new Error(`無效的草稿 ID：${id}`)
    }

    const response = await request.get(`/Users/articles/drafts/${id}`)
    return response.data.data
  }

  // ===軟刪除===
  const deleteDraft = async (id) => {
    isActionLoading.value = true
    try {
      // 呼叫後端刪除 API（後端內部會把 IsExist 設為 false）
      await request.patch(`/Users/articles/${id}`)
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
        const response = await request.post('/Users/articles', payload)
        return {
          success: true,
          isNew: true,
          status: response.status,
          data: response.data?.data,
        }
      }
      const response = await request.put(`/Users/articles/${currentId}`, payload)
      return {
        success: true,
        isNew: false,
        status: response.status,
        data: currentId,
      }
    } catch (error) {
      console.error('文章處理失敗:', error)
      console.error('後端錯誤內容:', error.response?.data)
      throw error
    }
  }

  // 把外面的組件需要用到的狀態和函式吐出去
  return {
    draftsData,
    isActionLoading,
    fetchDrafts,
    deleteDraft,
    saveOrUpdateArticle,
    fetchDraftDetail,
  }
}
