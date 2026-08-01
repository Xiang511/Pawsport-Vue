import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import request from '@/api/axios'

/**
 * 管理會員文章清單的 composable
 */
export function useMemberPosts() {
  const authStore = useAuthStore()
  const user = computed(() => authStore.userInfo || {})

  const myPosts = ref([])
  const postsLoading = ref(false)

  /**
   * 從 API 取得會員的文章清單
   */
  const fetchPosts = async () => {
    const userId = parseInt(user.value?.userId ?? user.value?.id)
    if (!userId || isNaN(userId)) return

    postsLoading.value = true
    try {
      const res = await request.get(`/users/articles`, {
        params: { UserId: userId, IsActive: true },
      })
      if (!res.data?.success || !Array.isArray(res.data?.data)) return

      myPosts.value = res.data.data.map((a) => ({
        id: a.articleId,
        title: a.title,
        summary: a.summary,
        tag: a.categoryName || '未分類',
        tags: a.tagNames || [],
        date: a.createAt,
        viewCount: a.viewCount ?? 0,
        // 0 = 草稿，1 = 公開
        status: a.status,
        mainImage: a.mainImageUrl || null,
      }))
    } catch (e) {
      console.error('[fetchPosts]', e)
    } finally {
      postsLoading.value = false
    }
  }

  /**
   * @param {number} status - 文章狀態代碼
   * @returns {string} 狀態中文標籤
   */
  const postStatusLabel = (status) => (status === 1 ? '公開' : '草稿')

  /**
   * @param {number} status
   * @returns {string} 對應的 Tailwind CSS class 字串
   */
  const postStatusClass = (status) =>
    status === 1
      ? 'border-[#445944] bg-[#D4E6D0] text-[#445944]'
      : 'border-gray-300 bg-gray-100 text-gray-500'

  return {
    myPosts,
    postsLoading,
    fetchPosts,
    postStatusLabel,
    postStatusClass,
  }
}
