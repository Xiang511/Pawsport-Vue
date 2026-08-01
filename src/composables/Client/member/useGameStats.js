import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import request from '@/api/axios'

/**
 * 管理會員遊戲統計資料的 composable
 */
export function useGameStats() {
  const authStore = useAuthStore()
  const user = computed(() => authStore.userInfo || {})

  const gameStats = ref({
    points: 0,
    level: 0,
    skins: 0,
    progress: '尚未開始',
    lastPlayed: null,
  })

  /**
   * 根據最高關卡 ID 轉換為可讀的進度文字
   * @param {number|null} maxGameId - 玩家通過的最高關卡編號
   * @returns {string} 進度描述字串
   */
  const getProgressText = (maxGameId) => {
    if (!maxGameId) return '尚未開始'

    const levelCategoryMap = {
      1: '認養須知',
      2: '狗狗百科',
      3: '貓貓百科',
      4: '鳥類百科',
      5: '小動物百科',
      6: '水族與爬蟲',
    }

    const areaId = Math.floor((maxGameId - 1) / 10) + 1
    return `${levelCategoryMap[areaId] || `第 ${areaId} 章`} (第 ${maxGameId} 關)`
  }

  /**
   * 從 API 取得玩家遊戲統計資料
   */
  const fetchGameStats = async () => {
    try {
      const userId = user.value?.userId || user.value?.id || localStorage.getItem('userId')
      if (!userId) return

      const res = await request.get(`/Users/${userId}/player-profile`)
      if (!res.data?.success || !res.data?.data) return

      const d = res.data.data
      const ownedSkins = d.ownedSkins || d.OwnedSkins || []
      // skinId 為 1 的是預設造型，不計入擁有數量
      const filteredSkins = ownedSkins.filter((s) => (s.skinId ?? s.SkinId) !== 1)

      gameStats.value = {
        points: d.currentPoint ?? d.CurrentPoint ?? 0,
        level: d.maxGameId ?? 0,
        skins: filteredSkins.length,
        progress: getProgressText(d.maxGameId ?? 0),
        lastPlayed: d.lastPlayedDate ?? d.LastPlayedDate ?? null,
      }
    } catch (e) {
      // 遊戲伺服器可能離線，靜默失敗
      console.log('遊戲資料載入失敗', e)
    }
  }

  return { gameStats, fetchGameStats }
}
