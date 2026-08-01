import { ref } from 'vue'
import { mockMissingPets } from '@/constants/Client/home/mockData'

export function useHomeMissing() {
  const missingPets = ref([])

  const getMissingPets = async () => {
    try {
      // TODO: 串接遺失協尋 API
      // const response = await axios.get('/missing-reports')
      // missingPets.value = response.data
      missingPets.value = mockMissingPets
    } catch (error) {
      console.warn('API連線失敗，自動載入 Mock 遺失數據:', error)
      missingPets.value = mockMissingPets
    }
  }

  return { missingPets, getMissingPets }
}
