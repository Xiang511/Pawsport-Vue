<script setup>
import { ref, computed, onMounted } from 'vue'
import { LucideCat, Save, Edit2, X } from 'lucide-vue-next'
import 'animate.css'
import { useGameAudio } from '@/composables/useGameAudio'
import { usePlayerStore } from '@/stores/usePlayerStore'
import request from '@/api/axios'

const { playSFX } = useGameAudio()
const playerStore = usePlayerStore()
const emit = defineEmits(['close'])
const isVisible = ref(false)

// 計算屬性：從 store 取得玩家資料
const playerData = ref(null)
const isLoading = ref(true)
const errorMessage = ref('')

const currentUserId = computed(() => playerStore.userId || localStorage.getItem('userId') || 1)

// 計算屬性：玩家的遊戲進度
const playerProgress = computed(() => {
  if (!playerData.value) return 0
  return playerData.value.maxGameId || 0
})
// 計算屬性：玩家的造型數量
const skinCountDisplay = computed(() => {
  // 1. 取得擁有的造型陣列 (同時相容後端回傳的 ownedSkins 或 OwnedSkins)
  const ownedSkins = playerData.value?.ownedSkins || playerData.value?.OwnedSkins

  if (!ownedSkins || !Array.isArray(ownedSkins)) return 0

  // 2. 過濾掉 skinId 為 1 的造型 (使用 ?? 同時防呆大寫 SkinId)
  const filteredSkins = ownedSkins.filter((skin) => {
    const id = skin.skinId ?? skin.SkinId
    return id !== 1
  })

  // 3. 回傳過濾後的實際造型數量
  return filteredSkins.length
})

// 計算屬性：目前裝備的造型資訊
const currentEquippedSkin = computed(() => {
  if (!playerData.value || !playerData.value.ownedSkins) return null

  const enabledSkinId = playerData.value.enabledSkinId
  if (!enabledSkinId) {
    return {
      skinId: 2,
      skinName: '預設造型',
      skinImage: 'default-skin.png',
    }
  }

  return playerData.value.ownedSkins.find((skin) => skin.skinId === enabledSkinId) || null
})

// 編輯狀態
const isEditingName = ref(false)
const editedName = ref('')
const isSavingName = ref(false)
const nameSaveError = ref('')

// 關卡名稱對應表
const levelCategoryMap = {
  0: '尚未開始',
  1: '認養須知',
  2: '狗狗百科',
  3: '貓貓百科',
  4: '鳥類百科',
  5: '小動物百科',
  6: '水族與爬蟲',
}

onMounted(async () => {
  isVisible.value = true
  await fetchPlayerData()
})

// 獲取玩家資料
const fetchPlayerData = async () => {
  try {
    isLoading.value = true
    errorMessage.value = ''
    
    const userId = currentUserId.value
    console.log(`【前端發送請求】正在獲取 UserId: ${userId} 的玩家資料庫記錄...`)

    // 使用你提供的新 API 端點
    const response = await request.get(`https://localhost:7048/api/Users/${userId}/player-profile`)
    
    console.log('【後端回傳的原始資料】:', response.data)

    if (response.data && response.data.success) {
      // 成功獲取，直接塞給本地響應式變數
      playerData.value = response.data.data
      
      // 同步回填給全域狀態機 Store 讓大廳點數即時更新
      if (playerStore && playerStore.$patch) {
        playerStore.$patch({ playerData: response.data.data })
      }
    } else {
      errorMessage.value = response.data?.message || '獲取玩家資料失敗'
    }
  } catch (error) {
    console.error('API 請求錯誤:', error)
    errorMessage.value = '無法連接到伺服器，請確認後端 API 是否開啟'
  } finally {
    isLoading.value = false
  }
}

// 開始編輯玩家名字
const startEditName = () => {
  editedName.value = playerData.value.userName
  isEditingName.value = true
  nameSaveError.value = ''
}

// 取消編輯
const cancelEditName = () => {
  isEditingName.value = false
  editedName.value = ''
  nameSaveError.value = ''
}

// 儲存玩家名字
const savePlayerName = async () => {
  // 驗證名字不為空
  if (!editedName.value.trim()) {
    nameSaveError.value = '玩家名字不能為空'
    return
  }

  // 驗證名字長度
  if (editedName.value.trim().length > 50) {
    nameSaveError.value = '玩家名字不能超過 50 個字'
    return
  }

  try {
    isSavingName.value = true
    nameSaveError.value = ''

    // 暫時使用現有的 API，但需要確認後端是否支援 UserName 更新
    const updateData = {
      playerId: playerData.value.playerId,
      point: playerData.value.currentPoint,
      skinId: playerData.value.enabledSkinId || 1,
      enable: true,
      userName: editedName.value.trim(), // 新增此欄位，但需要後端支援
    }

    const response = await request.put(
      `https://localhost:7048/api/Player/${playerData.value.playerId}`,
      updateData,
    )

    if (response.data && response.data.success) {
      // 更新本地資料
      playerData.value.userName = editedName.value.trim()
      isEditingName.value = false
      editedName.value = ''

      // 播放成功音效
      playSFX('success')

      console.log('玩家名字更新成功')
    } else {
      nameSaveError.value = '更新失敗，請稍後重試'
    }
  } catch (error) {
    console.error('更新玩家名字錯誤:', error)
    nameSaveError.value = error.response?.data?.message || '無法連接到伺服器'
  } finally {
    isSavingName.value = false
  }
}

// 格式化日期 (YYYY/MM/DD)
const formatDate = (dateString) => {
  if (!dateString) return '未知'
  const date = new Date(dateString)
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`
}

// 格式化日期時間 (YYYY/MM/DD HH:mm)
const formatDateTime = (dateString) => {
  if (!dateString) return '尚未遊玩'
  const date = new Date(dateString)
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

// 格式化點數 (加上千位數逗號)
const formatPoints = (points) => {
  if (points === undefined || points === null) return '0'
  return points.toLocaleString('en-US')
}

// 獲取最新遊玩進度文字
const getProgressText = (maxGameId) => {
  if (!maxGameId) return '尚未開始'

  // 假設每 10 關為一個大區，這裡簡化處理，您可以根據實際邏輯調整
  const areaId = Math.floor((maxGameId - 1) / 10) + 1
  const categoryName = levelCategoryMap[areaId] || `第 ${areaId} 章`

  return `${categoryName} (第 ${maxGameId} 關)`
}

// 獲取啟用的造型圖片
const getEnabledSkinImage = () => {
  if (!playerData.value || !playerData.value.ownedSkins) {
    return null
  }

  // 先尋找 enable = true 的造型
  const enabledSkin = playerData.value.ownedSkins.find((skin) => skin.enable === true)
  if (enabledSkin?.skinImage) {
    return `https://localhost:7048${enabledSkin.skinImage}`
  }

  // 如果沒有裝備的造型，預設顯示 SkinId=2 的造型
  const defaultSkin = playerData.value.ownedSkins.find((skin) => skin.skinId === 2)
  return defaultSkin?.skinImage ? `https://localhost:7048${defaultSkin.skinImage}` : null
}

// 獲取啟用的造型名稱
const getEnabledSkinName = () => {
  if (!playerData.value || !playerData.value.ownedSkins) {
    return '未設定'
  }

  // 先尋找 enable = true 的造型
  const enabledSkin = playerData.value.ownedSkins.find((skin) => skin.enable === true)
  if (enabledSkin?.skinName) {
    return enabledSkin.skinName
  }

  // 如果沒有裝備的造型，預設顯示 SkinId=2 的造型名稱
  const defaultSkin = playerData.value.ownedSkins.find((skin) => skin.skinId === 2)
  return defaultSkin?.skinName || '未設定'
}

// JavaScript 離開動畫
const onLeave = (el, done) => {
  const animation = el.animate(
    [
      { transform: 'scale(1) translateY(0)', opacity: 1, filter: 'blur(0px)' },
      { transform: 'scale(1.05) translateY(-70px)', opacity: 1, offset: 0.35 },
      { transform: 'scale(0.4) translateY(400px)', opacity: 0, filter: 'blur(10px)', offset: 1 },
    ],
    {
      duration: 800,
      easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      fill: 'forwards',
    },
  )

  animation.onfinish = done
}

// 內部控制
const startClose = (type) => {
  // 發送事件讓父組件知道現在是什麼類型的退出
  emit('close', type)

  if (type === 'save') {
    // 儲存：延遲一下再讓卡片彈走，給大圖示留表演時間
    setTimeout(() => {
      isVisible.value = false
    }, 1200)
  } else {
    // 普通退出：立刻讓卡片彈走
    isVisible.value = false
  }
}
</script>

<template>
  <div class="modal-overlay" @click.self="startClose('default')">
    <Transition
      appear
      enter-active-class="animate__animated animate__bounceIn"
      @leave="onLeave"
      :css="true">
      <div v-if="isVisible" class="profile-card">
        <div class="card-decorations">
          <div class="line horizontal top"></div>
          <div class="line horizontal bottom"></div>
          <div class="circle top-left"></div>
          <div class="circle top-right"></div>
          <div class="circle bottom-left"></div>
          <div class="circle bottom-right"></div>
        </div>

        <div class="card-header-internal">
          <div class="top-tag-internal">
            <span class="tag-decorator"><LucideCat /></span>
            <span class="tag-title">玩家檔案</span>
            <span class="tag-decorator"><LucideCat /></span>
          </div>
        </div>

        <!-- 載入中狀態 -->
        <div v-if="isLoading" class="loading-state">
      <div class="spinner-small"></div>
      <p class="loading-text">正在翻閱玩家檔案...</p>
    </div>

        <!-- 錯誤狀態 -->
        <div v-else-if="errorMessage" class="error-state">
          <p>{{ errorMessage }}</p>
        </div>

        <!-- 資料顯示區 -->
        <template v-else-if="playerData">
          <div class="header-meta">
            <p>玩家ID: P7328643539300{{ playerData.playerId || playerData.PlayerId }}</p>
          </div>

          <div class="card-content">
            <!-- 左側：頭像和點數 -->
            <div class="photo-section">
              <div class="photo-frame">
                <!-- 目前裝備的造型顯示區 -->
                <div class="equipped-skin-container">
                  <!-- 如果有圖片，顯示圖片；否則顯示方塊 -->
                  <div v-if="getEnabledSkinImage()" class="avatar-placeholder with-image">
                    <img :src="getEnabledSkinImage()" alt="Equipped Skin" />
                  </div>
                  <div v-else class="avatar-placeholder without-image">
                    <div class="placeholder-box"></div>
                  </div>

                  <!-- 造型名稱 -->
                  <div class="skin-name-display">
                    <p class="skin-label">目前裝備：{{ currentEquippedSkin.skinName }}</p>
                  </div>
                </div>

                <div class="corner-tape top-left"></div>
                <div class="corner-tape bottom-right"></div>
              </div>
              <div class="rank-badge">現有點數：{{ formatPoints(playerData.currentPoint ?? playerData.CurrentPoint) }} 點</div>
            </div>

            <!-- 右側：玩家資訊 -->
            <div class="info-section">
              <!-- 玩家名字編輯區 -->
              <div class="player-name-container">
                <div v-if="!isEditingName" class="player-name-display">
                  <h2 class="player-name">{{ playerData.userName || playerData.UserName || '未設定名稱' }}</h2>
                  <button
                    class="edit-name-btn"
                    @click="
                      playSFX('click');
                      startEditName()
                    "
                    title="編輯玩家名字">
                    <Edit2 :size="30" />
                  </button>
                </div>

                <div v-else class="player-name-edit">
                  <div v-if="nameSaveError" class="error-message">{{ nameSaveError }}</div>
                  <input
                    v-model="editedName"
                    type="text"
                    class="name-input"
                    placeholder="輸入新的玩家名字"
                    maxlength="50"
                    @keyup.enter="savePlayerName" />
                  <div class="edit-buttons">
                    <button class="sticky-save-btn" @click="savePlayerName" :disabled="isSavingName">
                      <Save :size="16" />
                      {{ isSavingName ? '儲存中...' : '確認' }}
                    </button>
                    <button class="cancel-btn" @click="cancelEditName" :disabled="isSavingName">
                      <X :size="16" />
                      取消
                    </button>
                  </div>
                </div>
              </div>

              <!-- 統計資訊 -->
              <div class="stats-container">
                <div class="stat-row">
                  <span class="label">最新遊玩進度：</span>
                  <span class="value">{{ getProgressText(playerProgress) }}</span>
                </div>
                <div class="stat-row">
                  <span class="label">最後遊玩時間：</span>
                  <span class="value">{{ formatDateTime(playerData.lastPlayedDate || playerData.LastPlayedDate) }}</span>
                </div>
                <div class="stat-row">
                  <span class="label">擁有造型數量：</span>
                  <span class="value">
                    {{ skinCountDisplay }} 個
                  </span>
                </div>
              </div>

              <div class="decoration-dots">
                <span v-for="i in 12" :key="i" class="dot">✦</span>
              </div>
            </div>
          </div>
        </template>

        <!-- <button
          class="sticky-save-btn"
          @click="
            playSFX('click');
            startClose('save')
          ">
          <Save />
          儲存並返回
        </button> -->
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* modal相關 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(45, 38, 27, 0.4);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

/* 玩家檔案主體：圓角與背景 */
.profile-card {
  --animate-duration: 0.8s;
  background-color: #fcf4e5;
  width: 1050px;
  min-height: 620px;
  padding: 80px 60px;
  border: 1px solid rgba(69, 58, 39, 0.3);
  border-radius: 25px; /* 圓角頁面 */
  position: relative;
  color: #453a27;
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.4);
  
}

/* 半透明線條裝飾層 */
.card-decorations .line {
  position: absolute;
  left: 30px;
  right: 30px;
  height: 1px;
  background: rgba(69, 58, 39, 0.15); /* 半透明橫線 */
}
.line.top {
  top: 40px;
}
.line.bottom {
  bottom: 40px;
}

.card-decorations .circle {
  position: absolute;
  width: 12px;
  height: 12px;
  border: 2px solid rgba(69, 58, 39, 0.2);
  border-radius: 50%;
}
.top-left {
  top: 34px;
  left: 24px;
}
.top-right {
  top: 34px;
  right: 24px;
}
.bottom-left {
  bottom: 34px;
  left: 24px;
}
.bottom-right {
  bottom: 34px;
  right: 24px;
}

/* 內部標籤 */
.card-header-internal {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.top-tag-internal {
  background-color: #453a27;
  color: #fcf4e5;
  padding: 10px 80px;
  border-radius: 0 0 30px 30px; /* 下圓角 */
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: -85px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  justify-content: center;
}

.tag-title {
  font-size: 2rem;
  letter-spacing: 4px;
  font-weight: bold;
}

.tag-decorator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0 5px;
}

.tag-decorator :deep(svg) {
  width: 32px;
  height: 32px;
  stroke: #fcf4e5;
  stroke-width: 2.5px;

  /* 應用動畫：持續 3 秒，平滑循環 */
  animation: cat-breath 3s ease-in-out infinite;
  animation: cat-wiggle 3s ease-in-out infinite;

  /* 為了讓縮放從中心開始，設定基準點 */
  transform-origin: center;
}

/* 右上角半透明資訊 */
.header-meta {
  position: absolute;
  top: 50px;
  right: 60px;
  text-align: right;
  font-size: 0.85rem;
  color: rgba(69, 58, 39, 0.5); /* 半透明文字 */
  line-height: 1.6;
}

.card-content {
  display: flex;
  margin-top: 40px;
  gap: 60px;
  position: relative;
  z-index: 2;
}

/* 照片區塊 */
.photo-frame {
  width: 280px;
  height: 320px;
  border: 1px solid #e0e0e0;
  padding: 12px;
  position: relative;
  box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.05);
  background-color: #f5eae0; 
  
  /* 🎯 純 CSS 人字波浪拼貼 */
  background-image: 
    linear-gradient(135deg, #e9dacb 25%, transparent 25%), 
    linear-gradient(225deg, #e9dacb 25%, transparent 25%), 
    linear-gradient(45deg, #e9dacb 25%, transparent 25%), 
    linear-gradient(315deg, #e9dacb 25%, transparent 25%);
  
  /* 鎖定波浪的尺寸 */
  background-size: 40px 40px;
  background-position: 0 0, 0 20px, 20px -20px, -20px 0px;
}

.avatar-placeholder img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.skin-name-display {
  text-align: center;
  font-size: 1.2rem;
  margin: 10px;
  font-weight: 900;
}
/* 照片角落膠帶感裝飾 */
.corner-tape {
  position: absolute;
  width: 40px;
  height: 15px;
  background: rgba(252, 200, 109, 0.4);
}
.corner-tape.top-left {
  top: -5px;
  left: -15px;
  transform: rotate(-45deg);
}
.corner-tape.bottom-right {
  bottom: -5px;
  right: -15px;
  transform: rotate(-45deg);
}

.rank-badge {
  margin-top: 25px;
  background: #453a27;
  color: white;
  padding: 6px 0;
  border-radius: 20px;
  font-size: 0.9rem;
  text-align: center;
}

/* 右側文字資訊 */
.player-name-container {
  margin-bottom: 35px;
}

.player-name-display {
  display: flex;
  align-items: center;
  gap: 15px;
}

.player-name {
  font-size: 3.2rem;
  margin: 0;
  font-weight: 900;
}

.edit-name-btn {
  background: #453a27;
  cursor: pointer;
  color: #fcf4e5;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 30px;
  transition: all 0.3s ease;
}

.edit-name-btn:hover {
  background-color: #fcc86d;
  transform: scale(1.1);
}

.edit-name-btn :deep(svg) {
  stroke-width: 2.5px;
}

/* 編輯模式 */
.player-name-edit {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.name-input {
  font-size: 2rem;
  font-weight: 900;
  padding: 12px 16px;
  border: 2px solid #453a27;
  border-radius: 8px;
  background-color: #fff;
  color: #453a27;
  transition: all 0.3s ease;
}

.name-input:focus {
  outline: none;
  border-color: #fcc86d;
  box-shadow: 0 0 0 3px rgba(252, 200, 109, 0.2);
}

.edit-buttons {
  display: flex;
  gap: 10px;
}

.error-message {
  color: #d32f2f;
  font-size: 0.9rem;
  padding: 8px 12px;
  background-color: rgba(211, 47, 47, 0.1);
  border-radius: 6px;
  border-left: 3px solid #d32f2f;
}

.stats-container {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.stat-row {
  font-size: 1.4rem;
  border-bottom: 1px dashed rgba(69, 58, 39, 0.1);
  padding-bottom: 10px;
}

.label {
  color: rgba(69, 58, 39, 0.6);
  margin-right: 15px;
}

.decoration-dots {
  margin-top: 30px;
  color: #fcc86d;
  letter-spacing: 8px;
}

/* 儲存按鈕：圓角、一半在外 */
.sticky-save-btn {
  position: absolute;
  bottom: -50px;
  right: 160px;
  background-color: #fcf4e5;
  color: #453a27;
  border: 4px solid #453a27; /* 增加粗邊框與背景切齊 */
  padding: 12px 40px;
  font-size: 1.1rem;
  font-weight: bold;
  border-radius: 50px; /* 橢圓長條圓角 */
  cursor: pointer;
  box-shadow: 0 5px 0px #453a27;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  display: flex;
  align-items: center; /* 垂直置中 */
  justify-content: center; /* 水平置中 */
  gap: 10px; /* 圖示與文字間的距離 */
  z-index: 5;
}
.cancel-btn {
  position: absolute;
  bottom: -50px;
  right: 0px;
  background-color: #fcf4e5;
  color: #453a27;
  border: 4px solid #453a27; /* 增加粗邊框與背景切齊 */
  padding: 12px 40px;
  font-size: 1.1rem;
  font-weight: bold;
  border-radius: 50px; /* 橢圓長條圓角 */
  cursor: pointer;
  box-shadow: 0 5px 0px #453a27;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  display: flex;
  align-items: center; /* 垂直置中 */
  justify-content: center; /* 水平置中 */
  gap: 10px; /* 圖示與文字間的距離 */
  z-index: 5;
}

.sticky-save-btn :deep(svg) {
  display: block;
  stroke-width: 2.5px; /* 讓 Lucide 圖示線條跟文字粗細更接近 */
  /* 新增：圖示本身的放大與動畫 transition */
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-origin: center;
}
.cancel-btn :deep(svg) {
  display: block;
  stroke-width: 2.5px; /* 讓 Lucide 圖示線條跟文字粗細更接近 */
  /* 新增：圖示本身的放大與動畫 transition */
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-origin: center;
}
.sticky-save-btn:hover {
  background-color: #445944;
  color: #fcf4e5;
  transform: translateY(-3px);
  box-shadow: 0 5px 0px #453a27;
}
.cancel-btn:hover {
  background-color: #f57e6c;
  color: #fcf4e5;
  transform: translateY(-3px);
  box-shadow: 0 5px 0px #453a27;
}
.sticky-save-btn:hover :deep(svg) {
  /* 1. 圖示放大一些，比貓咪更明顯，更有強調感 */
  transform: scale(1.8);

  /* 2. 套用持續晃動動畫，比貓咪的搖晃速度稍快，增加張力 */
  animation: save-wiggle 1.5s ease-in-out infinite;
  animation-delay: 0.1s; /* 在放大完成後稍稍延遲一點點開始，更有層次 */
}
.cancel-btn:hover :deep(svg) {
  /* 1. 圖示放大一些，比貓咪更明顯，更有強調感 */
  transform: scale(1.8);

  /* 2. 套用持續晃動動畫，比貓咪的搖晃速度稍快，增加張力 */
  animation: save-wiggle 1.5s ease-in-out infinite;
  animation-delay: 0.1s; /* 在放大完成後稍稍延遲一點點開始，更有層次 */
}
/* 載入與錯誤狀態樣式 */
.loading-state,
.error-state {
  position: absolute;
  top: 25px;
  left: 0;
  width: 100%;    /* 完美佔滿玩家檔案卡片的寬度 */
  height: 100%;   /* 完美佔滿玩家檔案卡片的高度 */
  
  /* 內部排版：讓圈圈與文字上下左右精準幾何居中 */
  display: flex;
  justify-content: center;
  align-items: center;
  
  /* 確保蓋在卡片內容的最上層，且底色使用與卡片一致的溫暖 Morandi 色 */
  z-index: 50;
  border-radius: 24px;   /* 完美佔滿玩家檔案卡片的高度 */
}

.error-state {
  color: #d32f2f;
}

.spinner-small {
  width: 400px;
  height: 400px;
  box-sizing: border-box;   /* 確保邊框算在 120px 內，圓形才不會變形 */
  border: 40px solid #e8dcc8;  /* 溫暖的底圈 */
  border-top-color: #453a27;  /* 主題深咖啡色旋轉頭 */
  border-radius: 50%;
  animation: spin 1.2s linear infinite; /* 稍微放慢一點點點，轉起來更沉穩優雅 */
}

/* 🎯 提示文字微調，消除預設邊距 */
.loading-text {
  font-size: 1.75rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* ⚡ 究極定位：往回推自身寬高的 50%，達成絕對字面幾何居中 */
  
  margin: 0;      /* 稍微縮小字體，確保文字能完美收納在 120px 的圓圈圈內部 */
  font-weight: 900;         /* 特粗體，讓小字在圓圈裡依舊清晰好讀 */
  color: #453a27;           /* 主題深咖啡色 */
  white-space: nowrap;      /* 強制不換行，防止字體折疊 */
  letter-spacing: 0.5px;
}

/* 🎯 旋轉動畫定義（如果你的 CSS 最底下本來就有 @keyframes spin 就可以不用重複貼） */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes cat-breath {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.9;
  }
  50% {
    transform: scale(1.15); /* 稍微放大 */
    opacity: 1;
  }
}

@keyframes cat-wiggle {
  0%,
  100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-10deg);
  }
  75% {
    transform: rotate(10deg);
  }
}

@keyframes save-wiggle {
  0%,
  100% {
    transform: scale(1.8) rotate(0deg);
  } /* 維持在放大狀態 */
  25% {
    transform: scale(1.8) rotate(-15deg);
  } /* 搖晃幅度稍大 */
  75% {
    transform: scale(1.8) rotate(15deg);
  }
}

</style>
