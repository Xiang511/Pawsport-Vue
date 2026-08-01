import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import request from '@/api/axios'

/**
 * 管理會員寵物資料與健康狀態輔助函式的 composable
 */
export function useMemberPets() {
  const authStore = useAuthStore()
  const user = computed(() => authStore.userInfo || {})

  const myPets = ref([])
  const petsLoading = ref(false)

  /**
   * 從 API 取得會員的寵物護照清單，並推算健康狀態
   */
  const fetchPets = async () => {
    const userId = parseInt(user.value?.userId ?? user.value?.id)
    if (!userId || isNaN(userId)) return

    petsLoading.value = true
    try {
      const res = await request.get(`/users/pet/passports?userId=${userId}`)
      if (!res.data?.success || !Array.isArray(res.data?.data)) return

      const today = new Date()

      myPets.value = res.data.data.map((p) => {
        const upcomingDates = []
        let hasOverdue = false

        ;(p.vaccinations || []).forEach((v) => {
          if (!v.forecast) return
          const d = new Date(v.forecast)
          if (d < today) {
            hasOverdue = true
          } else {
            upcomingDates.push(d)
          }
        })

        upcomingDates.sort((a, b) => a - b)

        const daysToNext =
          upcomingDates.length > 0
            ? (upcomingDates[0] - today) / (1000 * 60 * 60 * 24)
            : Infinity

        // 有逾期疫苗為 bad，30 天內到期為 warning，其餘為 good
        const health = hasOverdue ? 'bad' : daysToNext <= 30 ? 'warning' : 'good'
        const nextVaccine =
          upcomingDates.length > 0 ? upcomingDates[0].toISOString().split('T')[0] : null

        return {
          id: p.id,
          name: p.name,
          avatar: p.photo,
          gender: p.gender === 1 ? 'male' : p.gender === 2 ? 'female' : null,
          health,
          age: p.age,
          weight: p.weight,
          nextVaccine,
          isDesex: p.isDesex,
        }
      })
    } catch (e) {
      console.error('[fetchPets]', e)
    } finally {
      petsLoading.value = false
    }
  }

  /**
   * @param {'good'|'warning'|'bad'} health - 健康狀態代碼
   * @returns {string} 對應的文字色碼
   */
  const getHealthColor = (health) =>
    health === 'good' ? '#445944' : health === 'warning' ? '#A07A3C' : '#9C6D6D'

  /**
   * @param {'good'|'warning'|'bad'} health
   * @returns {string} 健康狀態中文標籤
   */
  const getHealthLabel = (health) =>
    health === 'good' ? '健康良好' : health === 'warning' ? '需注意' : '需就醫'

  /**
   * @param {'good'|'warning'|'bad'} health
   * @returns {string} 對應的背景色碼
   */
  const getHealthBg = (health) =>
    health === 'good' ? '#D4E6D0' : health === 'warning' ? '#FAE4AE' : '#F0D9D9'

  return {
    myPets,
    petsLoading,
    fetchPets,
    getHealthColor,
    getHealthLabel,
    getHealthBg,
  }
}
