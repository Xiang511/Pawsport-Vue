import { ref } from 'vue'
import { mockArticles } from '@/constants/Client/Home/mockData'

export function useHomeCommunity() {
  const communityArticles = ref([])

  const getCommunityArticles = async () => {
    try {
      // TODO: 串接社群文章 API
      // const response = await axios.get('/articles?limit=3&sort=popular')
      // communityArticles.value = response.data
      communityArticles.value = mockArticles
    } catch (error) {
      console.warn('API連線失敗，自動載入 Mock 社群文章數據:', error)
      communityArticles.value = mockArticles
    }
  }

  return { communityArticles, getCommunityArticles }
}
