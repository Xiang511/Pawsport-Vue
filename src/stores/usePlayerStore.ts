import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

/**
 * 玩家全域狀態 Store
 * 用於管理登入使用者的 UserId 和對應的 PlayerId、玩家資料
 */
export const usePlayerStore = defineStore('player', () => {
  // ============ 狀態 ============
  const userId = ref<number | null>(null)
  const playerId = ref<number | null>(null)
  const playerData = ref<any>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // ============ 計算屬性 ============
  const isPlayerLoaded = computed(() => playerData.value !== null && playerId.value !== null)
  const playerName = computed(() => playerData.value?.userName || '玩家')
  const playerPoints = computed(() => playerData.value?.currentPoint || 0)
  const enabledSkinId = computed(() => playerData.value?.enabledSkinId || 2)

  // ============ 方法 ============

  /**
   * 根據 UserId 初始化玩家資料
   * @param newUserId - 登入的使用者 ID
   */
  const initializePlayer = async (newUserId: number) => {
    try {
      isLoading.value = true
      error.value = null
      userId.value = newUserId

      console.log(`🔄 正在初始化玩家資料... UserId: ${newUserId}`)

      // 呼叫後端 API：GET /api/users/{userId}/player-profile
      const response = await axios.get(
        `https://localhost:7048/api/users/${newUserId}/player-profile`
      )

      if (response.data && response.data.success) {
        const data = response.data.data
        playerId.value = data.playerId
        playerData.value = data

        console.log(`✅ 玩家初始化成功 - UserId: ${newUserId}, PlayerId: ${data.playerId}, 玩家名稱: ${data.userName}`)
        return true
      } else {
        throw new Error('無法取得玩家資料')
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '初始化玩家資料失敗'
      error.value = errorMsg
      console.error('❌ 玩家初始化失敗:', err)
      playerId.value = null
      playerData.value = null
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 更新玩家名稱
   */
  const updatePlayerName = async (newName: string) => {
    if (!playerId.value) {
      error.value = '玩家 ID 不存在'
      return false
    }

    try {
      isLoading.value = true
      error.value = null

      const response = await axios.put(
        `https://localhost:7048/api/Player/${playerId.value}`,
        {
          playerId: playerId.value,
          userName: newName
        }
      )

      if (response.data && response.data.success) {
        if (playerData.value) {
          playerData.value.userName = newName
        }
        console.log('✅ 玩家名稱更新成功')
        return true
      } else {
        throw new Error('更新失敗')
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '更新玩家名稱失敗'
      error.value = errorMsg
      console.error('❌ 更新玩家名稱失敗:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 更新玩家點數（本地狀態）
   * 【修正】移除 async，改為同步方法
   */
  const updatePlayerPoints = (points: number) => {
    if (playerData.value) {
      playerData.value.currentPoint = points
      console.log(`💰 玩家點數已更新: ${points}`)
    }
  }

  /**
   * 更新裝備的造型 ID
   * 【修正】移除 async，改為同步方法
   */
  const updateEnabledSkinId = (skinId: number) => {
    if (playerData.value) {
      playerData.value.enabledSkinId = skinId
      console.log(`🎨 裝備造型已更新: ${skinId}`)
    }
  }

  /**
   * 重新整理玩家資料
   */
  const refreshPlayerData = async () => {
    if (!userId.value) {
      error.value = '使用者 ID 不存在'
      return false
    }
    return await initializePlayer(userId.value)
  }

  /**
   * 清除玩家資料（登出時使用）
   */
  const clearPlayer = () => {
    userId.value = null
    playerId.value = null
    playerData.value = null
    error.value = null
    console.log('🚪 玩家資料已清除')
  }

  return {
    // 狀態
    userId,
    playerId,
    playerData,
    isLoading,
    error,

    // 計算屬性
    isPlayerLoaded,
    playerName,
    playerPoints,
    enabledSkinId,

    // 方法
    initializePlayer,
    updatePlayerName,
    updatePlayerPoints,
    updateEnabledSkinId,
    refreshPlayerData,
    clearPlayer
  }
})
