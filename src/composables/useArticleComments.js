import { ref } from 'vue'
import request from '@/api/axios'

export function useArticleComments(articleIdRef) {
  const comments = ref([])
  const commentText = ref('')

  const isCommentLoading = ref(false)
  const isCommentError = ref(false)
  const isSubmittingComment = ref(false)

  const fetchComments = async () => {
    const articleId = articleIdRef.value

    if (!articleId) return

    isCommentLoading.value = true
    isCommentError.value = false

    try {
      const response = await request.get(`/Users/articles/${articleId}/comments`)
      comments.value = response.data.data || []
    } catch (error) {
      console.error('取得留言失敗:', error)
      console.error('後端錯誤內容:', error.response?.data)
      console.error('HTTP 狀態碼:', error.response?.status)
      isCommentError.value = true
    } finally {
      isCommentLoading.value = false
    }
  }

  const submitComment = async () => {
    const articleId = articleIdRef.value
    const content = commentText.value.trim()

    if (!articleId || !content || isSubmittingComment.value) return

    isSubmittingComment.value = true

    try {
      await request.post(`/Users/articles/${articleId}/comments`, {
        parentId: null,
        content,
        imageUrl: null,
      })

      commentText.value = ''
      await fetchComments()
    } catch (error) {
      console.error('新增留言失敗:', error)
      console.error('後端錯誤內容:', error.response?.data)
      console.error('HTTP 狀態碼:', error.response?.status)

      if (error.response?.status === 401 || error.response?.status === 403) {
        alert('請先登入後再留言')
      }
    } finally {
      isSubmittingComment.value = false
    }
  }

  return {
    comments,
    commentText,
    isCommentLoading,
    isCommentError,
    isSubmittingComment,
    fetchComments,
    submitComment,
  }
}
