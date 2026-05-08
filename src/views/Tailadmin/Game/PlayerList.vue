<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Modal from '@/components/Tailadmin/ui/Modal.vue'
import SearchBar from '@/components/Pawsport/SearchBar.vue'
import { EditIcon, Trash2, FileText } from 'lucide-vue-next'

// 初始化
const players = ref([])
const isLoading = ref(false)
const isModalOpen = ref(false)
const isSubmitting = ref(false)

// 編輯玩家的暫存資料
const editingPlayer = ref({
  playerId: 0,
  currentPoint: 0,
  ownedSkins: [],
})

// 儲存變更的函式
const saveChanges = async () => {
  isSubmitting.value = true
  try {
    // 取得當前被勾選的造型 (Enable 為 true 的那一個)
    const activeSkin = editingPlayer.value.ownedSkins.find((s) => s.enable)

    // 必須完全對齊你的 C# PlayerEditDTO 屬性名稱
    const payload = {
      PlayerId: editingPlayer.value.playerId,
      Point: editingPlayer.value.currentPoint, // 這裡要改叫 Point，不是 CurrentPoint
      SkinId: activeSkin ? activeSkin.skinId : 0, // 這裡要改叫 SkinId，不是 EnabledSkinId
      Enable: activeSkin ? true : false, // 這裡要改叫 Enable
    }

    console.log('修正後的發送資料:', payload)

    const response = await axios.put(
      `https://localhost:7048/api/Player/${payload.PlayerId}`,
      payload,
    )

    if (response.data.success) {
      alert('更新成功')
      closeModal()
      await fetchPlayers()
    } else {
      alert('更新失敗：' + response.data.message)
    }
  } catch (error) {
    console.error('API 呼叫失敗:', error.response?.data || error.message)
    alert('儲存發生錯誤')
  } finally {
    isSubmitting.value = false
  }
}

// 處理 Checkbox 只能單選（一個玩家同時只能穿一件造型）
const handleSkinEnable = (targetSkinId) => {
  editingPlayer.value.ownedSkins.forEach((skin) => {
    skin.enable = skin.skinId === targetSkinId
  })
}

// 輔助函式：處理日期顯示格式
const formatDate = (dateStr) => {
  if (!dateStr) return '無紀錄'
  const date = new Date(dateStr)
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// 取得玩家資料的函式
const fetchPlayers = async () => {
  isLoading.value = true
  try {
    const response = await axios.get('https://localhost:7048/api/Player')
    console.log('API 回傳原始內容：', response.data)
    // response.data 是後端的 ApiResult
    // response.data.data 是你 Controller 裡 return Success 丟出來的匿名物件 { Data, CurrentPage, TotalCount }
    // 所以真正的清單是在 response.data.data.data
    if (response.data && response.data.success && response.data.data) {
      players.value = response.data.data.data
    } else {
      // 備援機制：如果格式不如預期，嘗試取 response.data
      players.value = response.data || []
    }
  } catch (error) {
    console.error('抓取玩家資料失敗:', error)
  } finally {
    isLoading.value = false
  }
}

// 刪除玩家資料的函式
const deletePlayer = async (playerId, userName) => {
  const displayName = userName || `ID: ${playerId}`
  if (
    !confirm(`確定要刪除玩家 ${displayName} 嗎？\n這將會連同造型庫存與遊玩紀錄一併刪除且無法復原！`)
  ) {
    return
  }

  try {
    const response = await axios.delete(`https://localhost:7048/api/Player/${playerId}`)

    if (response.data.success) {
      alert(`玩家 ${displayName} 已成功刪除`)
      await fetchPlayers()
    } else {
      alert('刪除失敗：' + response.data.message)
    }
  } catch (error) {
    console.error('刪除玩家失敗:', error)
    alert('伺服器錯誤，無法刪除玩家')
  }
}

onMounted(() => {
  fetchPlayers()
})

// 新增一個變數紀錄搜尋關鍵字
const searchKeyword = ref('')

const searchPlayers = async (keyword) => {
  searchKeyword.value = keyword

  if (!keyword || keyword.trim() === '') {
    await fetchPlayers()
    return
  }

  isLoading.value = true
  try {
    const response = await axios.get('https://localhost:7048/api/Player/search', {
      params: {
        query: keyword,
        page: 1,
      },
    })

    console.log('API 回傳完整結構：', response.data)

    if (response.data && response.data.success && response.data.data) {
      const result = response.data.data
      players.value = result.data || result.Data || (Array.isArray(result) ? result : [])

      console.log('最終賦值給 players 的內容：', players.value)
    } else {
      players.value = []
    }
  } catch (error) {
    console.error('搜尋失敗:', error)
    players.value = []
    alert('搜尋發生錯誤: ' + (error.response?.data?.message || error.message))
  } finally {
    isLoading.value = false // 務必確保這行會執行
  }
}

// 控制紀錄 Modal 的狀態
const isRecordModalOpen = ref(false)
const recordLoading = ref(false)
// 玩家紀錄資料
const playerRecords = ref({
  playerName: '',
  consumptionLogs: [],
  pointLogs: [],
})
// 開啟紀錄 Modal
const openRecordModal = async (player) => {
  // 先把名字存起來，方便 Modal 標題顯示
  isRecordModalOpen.value = true
  recordLoading.value = true
  playerRecords.value.playerName = player.userName
  playerRecords.value.consumptionLogs = []
  playerRecords.value.pointLogs = []

  try {
    const response = await axios.get(`https://localhost:7048/api/Player/${player.playerId}/logs`)
    if (response.data.success) {
      playerRecords.value = {
        playerName: player.userName,
        consumptionLogs: response.data.data.consumptionLogs || [],
        pointLogs: response.data.data.pointLogs || [],
      }
    }
  } catch (error) {
    console.error('載入紀錄失敗:', error)
    alert('無法取得該玩家紀錄')
    isRecordModalOpen.value = false
  } finally {
    recordLoading.value = false
  }
}

const currentPage = ref(1)

// 開關Modal的函式
const openEditModal = (player) => {
  editingPlayer.value = JSON.parse(JSON.stringify(player))
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}
</script>

<template>
  <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div class="flex items-center gap-6">
      <h2 class="text-title-md text-gray-800 dark:text-white/90">玩家管理</h2>
    </div>
    <SearchBar @search="searchPlayers" />
  </div>
  <div
    class="shadow-theme-xs rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
    <div class="max-w-full overflow-x-auto">
      <table class="w-full table-auto">
        <thead>
          <tr class="border-b border-gray-100 text-center dark:border-gray-800">
            <th
              class="text-theme-xl px-4 py-4 tracking-wider text-gray-500 uppercase dark:text-white/90">
              會員檔案
            </th>
            <th
              class="text-theme-xl px-4 py-4 tracking-wider text-gray-500 uppercase dark:text-white/90">
              玩家帳號
            </th>
            <th
              class="text-theme-xl px-4 py-4 tracking-wider text-gray-500 uppercase dark:text-white/90">
              玩家資料建立時間
            </th>
            <th
              class="text-theme-xl px-4 py-4 tracking-wider text-gray-500 uppercase dark:text-white/90">
              現有點數
            </th>
            <th
              class="text-theme-xl px-4 py-4 tracking-wider text-gray-500 uppercase dark:text-white/90">
              持有造型數量
            </th>
            <th
              class="text-theme-xl px-4 py-4 tracking-wider text-gray-500 uppercase dark:text-white/90">
              遊玩進度
            </th>
            <th
              class="text-theme-xl px-4 py-4 tracking-wider text-gray-500 uppercase dark:text-white/90">
              最後遊玩時間
            </th>
            <th
              class="text-theme-xl px-4 py-4 tracking-wider text-gray-500 uppercase dark:text-white/90">
              動作
            </th>
          </tr>
        </thead>

        <tbody v-if="isLoading">
          <tr><td colspan="8" class="py-10 text-center text-gray-500">玩家資料載入中...</td></tr>
        </tbody>

        <tbody v-else class="divide-y divide-gray-50 dark:divide-gray-800">
          <tr
            v-for="player in players"
            :key="player.playerId"
            class="text-center transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.02]">
            <td class="px-4 py-4">
              <button
                class="bg-brand-info-500 text-theme-sm hover:bg-brand-info-600 shadow-theme-sm inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-white transition-all active:scale-95">
                查看玩家檔案
              </button>
            </td>

            <td class="text-theme-sm px-4 py-4 text-gray-500 dark:text-white/90">
              {{ player.userName || '未提供' }}
            </td>

            <td class="text-theme-sm px-4 py-4 text-gray-500 dark:text-white/90">
              {{ formatDate(player.createTime) }}
            </td>

            <td class="text-theme-sm px-4 py-4 font-medium text-gray-500 dark:text-white/90">
              {{ (player.currentPoint || 0).toLocaleString() }}
            </td>

            <td class="text-theme-sm px-4 py-4 text-gray-500 dark:text-white/90">
              {{ player.skinCount }} 個
            </td>

            <td class="text-theme-sm px-4 py-4 text-gray-500 dark:text-white/90">
              第 {{ player.maxGameId || 0 }} 關
            </td>

            <td class="text-theme-sm px-4 py-4 text-gray-500 dark:text-white/90">
              {{ formatDate(player.lastPlayedDate) }}
            </td>

            <td class="px-4 py-4">
              <div class="flex items-center justify-center gap-2">
                <button
                  @click="openEditModal(player)"
                  class="bg-brand-success-500 text-theme-xl hover:bg-brand-success-600 shadow-theme-sm inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-white transition-all active:scale-95">
                  <EditIcon />
                </button>
                <button
                  @click="deletePlayer(player.playerId, player.userName)"
                  class="bg-brand-error-500 text-theme-xl hover:bg-brand-error-600 shadow-theme-sm inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-white transition-all active:scale-95">
                  <Trash2 />
                </button>
                <button
                  @click="openRecordModal(player)"
                  class="bg-brand-info-500 text-theme-xl hover:bg-brand-info-600 shadow-theme-sm inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-white transition-all active:scale-95">
                  <FileText />
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="players.length === 0 && !isLoading">
            <td colspan="8" class="py-10 text-center text-gray-500">目前沒有玩家資料</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <Modal v-if="isModalOpen" @close="closeModal">
    <template #body>
      <div class="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" @click="closeModal"></div>

      <div
        class="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-gray-900">
        <div
          class="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <h3 class="text-xl text-gray-800 dark:text-white">
            編輯玩家：{{ editingPlayer.userName }}
          </h3>
          <button
            @click="closeModal"
            class="text-2xl text-gray-400 transition-colors hover:text-gray-600">
            &times;
          </button>
        </div>

        <div class="custom-scrollbar max-h-[70vh] space-y-5 overflow-y-auto p-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-theme-sm mb-1 block font-medium text-gray-800 dark:text-white">玩家 ID</label>
              <input
                :value="editingPlayer.playerId"
                disabled
                class="w-full rounded-lg border border-gray-300 bg-gray-200 px-4 py-2 outline-none dark:bg-gray-800 dark:text-gray-400" />
            </div>
            <div>
              <label class="text-theme-sm mb-1 block font-medium text-gray-800 dark:text-white">建立時間</label>
              <input
                :value="formatDate(editingPlayer.createTime)"
                disabled
                class="w-full rounded-lg border border-gray-300 bg-gray-200 px-4 py-2 outline-none dark:bg-gray-800 dark:text-gray-400" />
            </div>
          </div>

          <div>
            <label class="text-theme-sm mb-1 block font-medium text-gray-800 dark:text-white">
              現有點數
            </label>
            <input
              v-model.number="editingPlayer.currentPoint"
              type="number"
              class="focus:border-brand-info-500 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none dark:bg-gray-900 dark:text-white" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-theme-sm mb-1 block font-medium text-gray-800 dark:text-white">目前進度</label>
              <div
                class="rounded-lg border border-gray-300 bg-gray-200 px-4 py-2 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                第 {{ editingPlayer.maxGameId }} 關
              </div>
            </div>
            <div>
              <label class="text-theme-sm mb-1 block font-medium text-gray-800 dark:text-white">最後遊玩時間</label>
              <div
                class="rounded-lg border border-gray-300 bg-gray-200 px-4 py-2 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                {{ formatDate(editingPlayer.lastPlayedDate) }}
              </div>
            </div>
          </div>

          <div>
            <label class="text-theme-sm mb-2 block font-medium text-gray-700 dark:text-gray-300">
              持有造型列表 (勾選以啟用)
            </label>
            <div class="space-y-2 rounded-xl border border-gray-100 p-2 dark:border-gray-800">
              <div
                v-for="skin in editingPlayer.ownedSkins"
                :key="skin.skinId"
                class="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                <div class="flex items-center gap-4">
                  <img
                    v-if="skin.skinImage && !skin.hasError"
                    :src="'https://localhost:7048' + skin.skinImage"
                    class="h-12 w-12 rounded-lg object-cover shadow-sm"
                    @error="skin.hasError = true" />
                  <div
                    v-else
                    class="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-200 bg-gray-200 text-[10px] text-gray-500 dark:border-white/20 dark:bg-white/10 dark:text-gray-400">
                    無圖片
                  </div>
                  <div>
                    <p class="text-sm text-gray-800 dark:text-white/90">
                      {{ skin.skinName }}
                    </p>
                    <p class="font-mono text-xs text-gray-400">ID: {{ skin.skinId }}</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  :checked="skin.enable"
                  @change="handleSkinEnable(skin.skinId)"
                  class="text-brand-info-500 focus:ring-brand-info-500 h-5 w-5 rounded border-gray-300" />
              </div>

              <div
                v-if="!editingPlayer.ownedSkins || editingPlayer.ownedSkins.length === 0"
                class="py-6 text-center text-sm text-gray-800 dark:text-white italic">
                此玩家尚未擁有任何造型
              </div>
            </div>
          </div>
        </div>

        <div
          class="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50/50 px-6 py-4 dark:border-gray-800 dark:bg-gray-900/50">
          <button
            @click="saveChanges"
            :disabled="isSubmitting"
            class="bg-brand-success-500 text-white dark:text-white flex items-center gap-2 rounded-lg px-6 py-2.5 transition-all active:scale-95 disabled:opacity-50">
            <span v-if="isSubmitting" class="animate-spin text-lg">⏳</span>
            {{ isSubmitting ? '儲存中...' : '確認修改' }}
          </button>
          <button
            @click="closeModal"
            class="rounded-lg border border-gray-300 bg-white px-6 py-2.5 font-semibold text-gray-700 transition-all hover:bg-gray-50 active:scale-95">
            取消
          </button>
        </div>
      </div>
    </template>
  </Modal>

  <Modal v-if="isRecordModalOpen" @close="isRecordModalOpen = false">
    <template #body>
      <div
        class="fixed inset-0 bg-gray-900/40 backdrop-blur-sm"
        @click="isRecordModalOpen = false"></div>

      <div
        class="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-gray-900">
        <div
          class="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <h3 class="text-xl text-gray-800 dark:text-white">
            玩家紀錄：{{ playerRecords.playerName }}
          </h3>
          <button
            @click="isRecordModalOpen = false"
            class="text-2xl text-gray-400 transition-colors hover:text-gray-600">
            &times;
          </button>
        </div>

        <div class="custom-scrollbar max-h-[70vh] space-y-6 overflow-y-auto p-6">
          <div v-if="recordLoading" class="py-10 text-center">
            <div
              class="border-brand-success-500 inline-block h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"></div>
            <p class="mt-2 text-sm text-gray-400">紀錄載入中...</p>
          </div>

          <template v-else>
            <section>
              <div class="mb-3 flex items-center gap-2">
                <div class="bg-brand-error-500 h-5 w-1.5 rounded-full"></div>
                <h4 class="text-xl text-gray-800 dark:text-white">造型消費紀錄</h4>
              </div>
              <div class="overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800">
                <table class="w-full table-fixed text-left text-sm">
                  <thead class="bg-gray-50/50 text-gray-500 dark:bg-gray-800/50">
                    <tr>
                      <th class="w-[30%] px-4 py-3 font-medium dark:text-white">造型名稱</th>
                      <th class="w-[40%] px-4 py-3 text-center font-medium dark:text-white">時間</th>
                      <th class="w-[30%] px-4 py-3 text-right font-medium dark:text-white">點數</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                    <tr
                      v-for="log in playerRecords.consumptionLogs"
                      :key="log.transactionDate"
                      class="transition-colors hover:bg-gray-50/50 dark:hover:bg-white/[0.02]">
                      <td class="px-4 py-3 text-gray-800 dark:text-gray-200">
                        {{ log.description }}
                      </td>
                      <td class="px-4 py-3 text-center font-mono text-gray-400">
                        {{ formatDate(log.transactionDate) }}
                      </td>
                      <td class="px-4 py-3 text-right font-mono text-red-500">
                        {{ log.amount }}
                      </td>
                    </tr>
                    <tr v-if="playerRecords.consumptionLogs.length === 0">
                      <td colspan="3" class="py-6 text-center text-gray-400 italic">
                        <div class="flex flex-col items-center justify-center gap-2">
                          尚無消費紀錄
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <div class="mb-3 flex items-center gap-2">
                <div class="bg-brand-success-500 h-5 w-1.5 rounded-full"></div>
                <h4 class="text-xl text-gray-800 dark:text-white">點數獲取紀錄</h4>
              </div>
              <div class="overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800">
                <table class="w-full table-fixed text-left text-sm">
                  <thead class="bg-gray-50/50 text-gray-500 dark:bg-gray-800/50">
                    <tr>
                      <th class="w-[30%] px-4 py-3 font-medium dark:text-white">獲取來源</th>
                      <th class="w-[40%] px-4 py-3 text-center font-medium dark:text-white">時間</th>
                      <th class="w-[30%] px-4 py-3 text-right font-medium dark:text-white">點數</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                    <tr
                      v-for="log in playerRecords.pointLogs"
                      :key="log.transactionDate"
                      class="transition-colors hover:bg-gray-50/50 dark:hover:bg-white/[0.02]">
                      <td class="px-4 py-3  text-gray-800 dark:text-gray-200">
                        {{ log.description }}
                      </td>
                      <td class="px-4 py-3 text-center font-mono text-gray-400">
                        {{ formatDate(log.transactionDate) }}
                      </td>
                      <td class="px-4 py-3 text-right font-mono text-green-500">
                        +{{ log.amount }}
                      </td>
                    </tr>
                    <tr v-if="playerRecords.pointLogs.length === 0">
                      <td colspan="3" class="py-6 text-center text-gray-400 italic">
                        <div class="flex flex-col items-center justify-center gap-2">
                          尚無點數獲取紀錄
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </template>
        </div>

        <div
          class="flex items-center justify-end border-t border-gray-100 bg-gray-50/50 px-6 py-4 dark:border-gray-800 dark:bg-gray-900/50">
          <button
            @click="isRecordModalOpen = false"
            class="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-gray-700 transition-all hover:bg-gray-50 active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
            關閉
          </button>
        </div>
      </div>
    </template>
  </Modal>
</template>
