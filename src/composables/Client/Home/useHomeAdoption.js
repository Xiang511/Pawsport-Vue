import { ref } from 'vue'
import axios from 'axios'
import { mockAdoptionPets } from '@/constants/Client/home/mockData'

export function useHomeAdoption() {
  const adoptionPets = ref([])
  const isAdoptionLoading = ref(false)

  const getAdoptionPets = async () => {
    try {
      isAdoptionLoading.value = true
      const response = await axios.get('/users/pet/adoption')
      const { success, data } = response.data
      if (success && data && data.length > 0) {
        adoptionPets.value = data.slice(0, 4).map((pet) => {
          let age = pet.age || 0
          if (pet.birthDate) {
            const birth = new Date(pet.birthDate)
            const today = new Date()
            age = today.getFullYear() - birth.getFullYear()
          }
          const weight = pet.size === 1 ? 5 : pet.size === 2 ? 15 : 30
          return {
            id: pet.petId,
            name: pet.name,
            imageUrl: pet.photo || 'https://placehold.co/400x400?text=Petmily',
            nickname: pet.note || '精選毛孩',
            gender: pet.gender === 1 ? 'male' : 'female',
            age,
            breed: pet.coatColor || '米克斯',
            weight,
          }
        })
      } else {
        adoptionPets.value = mockAdoptionPets
      }
    } catch (error) {
      console.warn('API連線失敗，自動載入 Mock 領養數據:', error)
      adoptionPets.value = mockAdoptionPets
    } finally {
      isAdoptionLoading.value = false
    }
  }

  return { adoptionPets, isAdoptionLoading, getAdoptionPets }
}
