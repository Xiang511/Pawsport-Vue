import { ref } from 'vue'
import { mockSuccessStories } from '@/constants/Client/home/mockData'

export function useHomeSuccessStories() {
  const successStories = ref([])

  const getSuccessStories = async () => {
    try {
      // TODO: 串接幸福見證 API
      // const response = await axios.get('/success-stories')
      // successStories.value = response.data
      successStories.value = mockSuccessStories
    } catch (error) {
      console.warn('API連線失敗，自動載入 Mock 幸福見證數據:', error)
      successStories.value = mockSuccessStories
    }
  }

  return { successStories, getSuccessStories }
}
