<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameAudio } from '@/composables/useGameAudio'
import { usePlayerStore } from '@/stores/usePlayerStore'
import request from '@/api/axios'


const { playSFX } = useGameAudio()
const router = useRouter()

// 玩家資料
const playerData = ref(null)
const userPoints = ref(0)
const isLoadingData = ref(true)

// 造型資料
const allSkins = ref([])
const currentEquippedId = ref(null)
const previewSkin = ref(null)

const defaultAvatar = {
  id: 2, // 預設造型改為 SkinId=2
  name: '', 
  imgUrl: '',
  isOwned: true,
  description: ''
}

// 🎯 建立一個計算屬性：如果 previewSkin 沒被選中（為 null），自動退回顯示預設頭像
const displaySkin = computed(() => {
  return previewSkin.value || defaultAvatar
})

// UI 狀態
const showUnownedSkins = ref(false)
const isLoadingUnownedSkins = ref(false)

// Hover 提示
const hoverData = ref(null)
const tooltipPos = ref({ x: 0, y: 0 })

onMounted(async () => {
  await fetchData()
})

// 獲取所有資料
const fetchData = async () => {
  try {
    isLoadingData.value = true
    
    // 【修改】從 store 取得動態 PlayerId
    const playerStore = usePlayerStore()
    const playerId = playerStore.playerId
    
    console.log('🎮 Inventory - 取得 PlayerId:', playerId)
    
    if (!playerId) {
      console.error('❌ PlayerId 不存在')
      return
    }
    
    // 1. 【修改】使用動態 PlayerId 獲取玩家資料
    const playerResponse = await request.get(`https://localhost:7048/api/Player/${playerId}`)
    if (playerResponse.data.success) {
      playerData.value = playerResponse.data.data
      
      if (playerData.value) {
        userPoints.value = playerData.value.currentPoint
        currentEquippedId.value = playerData.value.enabledSkinId || 2
      }
    }

    // 2. 獲取所有造型
    const shopResponse = await request.get('https://localhost:7048/api/Shop')
    if (shopResponse.data.success) {
      const shopSkins = shopResponse.data.data
      
      // 3. 合併資料
      allSkins.value = shopSkins.map(skin => {
  const isOwned = playerData.value?.ownedSkins?.some(s => s.skinId === skin.skinId) || false
  
  // 確保圖片路徑包含完整的後端 URL
  let imgUrl = skin.skinImage
  if (imgUrl && !imgUrl.startsWith('http' )) {
    // 如果是相對路徑，添加後端伺服器地址
    imgUrl = `https://localhost:7048${imgUrl}?t=${Date.now( )}`
  } else if (imgUrl) {
    // 如果已經是完整 URL，只添加時間戳
    imgUrl = `${imgUrl}?t=${Date.now()}`
  }
  
  return {
    id: skin.skinId,
    name: skin.skinName,
    imgUrl: imgUrl,
    price: skin.price,
    isOwned: isOwned,
    description: skin.description
  }
})

      // 4. 設置預覽造型為目前裝備的造型
      const enabledSkin = playerData.value?.ownedSkins?.find(s => s.enable === true)
      if (enabledSkin) {
        // 找到對應的造型資訊
        const matchingSkin = allSkins.value.find(s => s.id === enabledSkin.skinId)
        if (matchingSkin) {
          previewSkin.value = { ...matchingSkin }
        }
      } else {
        // 如果沒有裝備的造型，預設顯示 SkinId=2（預設造型）
        const defaultSkin = allSkins.value.find(s => s.id === 2)
        if (defaultSkin) {
          previewSkin.value = { ...defaultSkin }
        } else {
          // 如果 SkinId=2 不存在，顯示第一個已擁有的造型
          const ownedSkinsArray = allSkins.value.filter(s => s.isOwned)
          if (ownedSkinsArray.length > 0) {
            previewSkin.value = { ...ownedSkinsArray[0] }
          } else {
            // 如果沒有已擁有的造型，顯示第一個未擁有的造型
            const unownedSkinsArray = allSkins.value.filter(s => !s.isOwned)
            if (unownedSkinsArray.length > 0) {
              previewSkin.value = { ...unownedSkinsArray[0] }
            } else {
              // 🎯 加上這個保險：如果連商店陣列都是空的，直接塗預設外觀
              previewSkin.value = { ...defaultAvatar }
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('獲取資料失敗:', error)
  } finally {
    isLoadingData.value = false
  }
}

// 篩選未擁有的造型（排除 SkinId=1 的遊戲獎勵）
const unownedSkins = computed(() => {
  return allSkins.value.filter(s => !s.isOwned && s.id !== 1 )
})

// 篩選已擁有的造型（排除 SkinId=1 的遊戲獎勵）
const ownedSkins = computed(() => {
  return allSkins.value.filter(s => s.isOwned && s.id !== 1)
})

// 已擁有造型數量（排除 SkinId=1 的遊戲獎勵）
const ownedCount = computed(() => allSkins.value.filter(s => s.isOwned && s.id !== 1).length)

// 選擇造型
const selectSkin = (skin) => {
  previewSkin.value = { ...skin }
  playSFX('click')
}

// 切換未擁有造型的顯示（添加 Loading 狀態）
const toggleUnownedSkins = async () => {
  if (showUnownedSkins.value) {
    // 取消勾選，直接隱藏
    showUnownedSkins.value = false
  } else {
    // 勾選，顯示 Loading 進度
    isLoadingUnownedSkins.value = true
    playSFX('click')
    
    // 模擬異步操作（實際上只是渲染造型卡片，所以用 setTimeout 讓 UI 更新）
    await new Promise(resolve => setTimeout(resolve, 300))
    
    showUnownedSkins.value = true
    isLoadingUnownedSkins.value = false
  }
}

// 裝備造型（只有已擁有的造型才能裝備）
const equipSkin = async (id) => {
  try {
    const response = await request.put(
      `https://localhost:7048/api/Player/1/equip-skin`,
      { playerId: 1, skinId: id }
    )

    if (response.data.success) {
      // 立即更新本地狀態
      currentEquippedId.value = id
      
      // 更新預覽造型的狀態
      if (previewSkin.value) {
        previewSkin.value = { ...previewSkin.value }
      }
      
      playSFX('click')
      console.log('造型裝備成功')
    }
  } catch (error) {
    console.error('裝備失敗:', error)
    alert(error.response?.data?.message || '裝備失敗，請稍後重試')
  }
}

// 前往購買（跳轉到商店並選中該造型）
const goToBuySkin = (skin) => {
  // 使用 router.push 跳轉到商店，並透過 query 參數傳遞要選中的造型 ID
  router.push({
    name: 'Client-skinshop',
    query: { selectSkinId: skin.id }
  })
}

// Hover 提示
const showTooltip = (event, item) => {
  hoverData.value = item
  tooltipPos.value = {
    x: event.clientX + 15,
    y: event.clientY + 15
  }
}

const moveTooltip = (event) => {
  tooltipPos.value = {
    x: event.clientX + 15,
    y: event.clientY + 15
  }
}

const hideTooltip = () => {
  hoverData.value = null
}

const goBack = () => {
  router.push({ name: 'Client-mainmenu' })
}
</script>

<template>
  <div class="shop-page-container">
    <div class="shop-header">
      <div class="header-left">
        <button class="back-btn" @click="playSFX('click'); goBack()">
          <span class="arrow-icon">‹</span>
        </button>
        <h1 class="shop-title">我的收藏</h1>
      </div>
      
      <div class="header-right-group">
        <div class="currency-box">🪙 {{ userPoints }}</div>
        <div class="currency-box is-bag">共擁有 {{ ownedCount }} 個造型</div>
      </div>
    </div>

    <div v-if="isLoadingData" class="loading-state">
      <p>正在載入造型資料...</p>
    </div>

    <div v-else class="shop-main-content">
      <!-- 左側：預覽面板 -->
      <div class="preview-panel">
        <div class="preview-card">
          <div class="preview-title-bar">當前造型</div>
          
          <div class="avatar-display-zone">
            <div class="avatar-mock">
              <img v-if="displaySkin?.imgUrl" :src="displaySkin.imgUrl" alt="preview" class="avatar-img-preview" />
              <p class="skin-name-preview">{{ displaySkin?.name }}</p>
            </div>
          </div>

          <div class="action-zone">
            <!-- 已擁有且已裝備 -->
            <button 
              v-if="displaySkin?.isOwned && (displaySkin?.id === currentEquippedId || (currentEquippedId === null && displaySkin?.id === 0))"
              class="shop-btn is-equipped" 
              disabled
            >
              已裝備
            </button>
            <!-- 已擁有但未裝備 -->
            <button 
              v-else-if="displaySkin?.isOwned" 
              @click="playSFX('click'); equipSkin(displaySkin.id)" 
              class="shop-btn is-actionable"
            >
              確認裝備
            </button>
            <!-- 未擁有 -->
            <button 
              v-else 
              @click="playSFX('click'); goToBuySkin(displaySkin)" 
              class="shop-btn is-actionable"
            >
              前往購買
            </button>
          </div>
        </div>
      </div>

      <!-- 右側：造型列表面板 -->
      <div class="catalog-panel">
        <!-- 已擁有的造型區塊（預設展開） -->
        <div class="skins-section">
          <div class="section-title">已擁有的造型</div>
          
          <div class="items-grid">
            <div v-if="ownedSkins.length === 0" class="empty-state">
              <p>您還沒有擁有任何造型</p>
            </div>

            <div 
              v-for="item in ownedSkins" 
              :key="item.id"
              :class="['product-card', { 'is-selected': previewSkin?.id === item.id }]"
              @click="playSFX('click'); selectSkin(item)"
              @mouseenter="showTooltip($event, item)" 
              @mousemove="moveTooltip($event)" 
              @mouseleave="hideTooltip"
            >
              <div class="product-title">{{ item.name }}</div>
              
              <div class="product-img-box">
                <img :src="item.imgUrl" alt="product" class="product-real-img" />
              </div>
            </div>
          </div>
        </div>
        <!-- 未擁有的造型區塊-->
        <div class="skins-section">
          <div class="section-header">
            <label class="checkbox-label">
              <input 
                :checked="showUnownedSkins"
                :disabled="isLoadingUnownedSkins"
                type="checkbox" 
                class="checkbox-input"
                @change="toggleUnownedSkins"
              />
              <span class="checkbox-text">顯示未擁有的造型</span>
            </label>
          </div>

          <!-- Loading 進度條 -->
          <div v-if="isLoadingUnownedSkins" class="loading-container">
            <div class="loading-spinner"></div>
            <p class="loading-text">正在載入未擁有的造型...</p>
          </div>

          <div v-else-if="showUnownedSkins" class="items-grid">
            <div v-if="unownedSkins.length === 0" class="empty-state">
              <p>您已擁有所有造型！</p>
            </div>

            <div 
              v-for="item in unownedSkins" 
              :key="item.id"
              :class="['product-card', { 'is-selected': previewSkin?.id === item.id }]"
              @click="playSFX('click'); selectSkin(item)"
              @mouseenter="showTooltip($event, item)" 
              @mousemove="moveTooltip($event)" 
              @mouseleave="hideTooltip"
            >
              <div class="product-title">{{ item.name }}</div>
              
              <div class="product-img-box">
                <img :src="item.imgUrl" alt="product" class="product-real-img" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>

  <!-- Hover 提示 -->
  <div 
    v-if="hoverData" 
    class="custom-tooltip"
    :style="{ left: tooltipPos.x + 'px', top: tooltipPos.y + 'px' }"
  >
    <div class="tooltip-title">{{ hoverData.name }}</div>
    <div class="tooltip-body">{{ hoverData.description }}</div>
  </div>
</template>

<style scoped>
/* ===================================================
   🎨 核心樣式
   =================================================== */
.shop-page-container {
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  padding: 30px 50px;
  background-color: #fcf4e5;
  font-family: system-ui, sans-serif;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.shop-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.shop-title {
  font-size: 2.2rem;
  color: #453a27;
  margin: 0;
  font-weight: bold;
}

/* 🔙 返回按鈕 */
.back-btn {
  width: 55px;
  height: 55px;
  background-color: #ffffff;
  border: 4px solid #453a27;
  border-radius: 16px;
  box-shadow: 0 5px 0 #453a27;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transform-origin: bottom !important;
  transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.back-btn:hover {
  background-color: #fcf4e5;
  transform: translateY(-3px) scaleY(1.08) scaleX(1) !important;
  box-shadow: 0 8px 0 #453a27 !important;
}

.back-btn:active {
  transform: translateY(4px) scaleY(0.88) scaleX(1) !important;
  box-shadow: 0 1px 0 #453a27 !important;
  transition: all 0.05s ease !important;
}

.arrow-icon {
  font-size: 2.5rem;
  color: #453a27;
  font-weight: bold;
  transform: translateY(-2px);
}

/* 💡 右側組合框 */
.header-right-group {
  display: flex;
  align-items: center;
  gap: 15px;
}

.currency-box {
  background: #ffffff; 
  color: #453a27; 
  border: 4px solid #453a27; 
  border-radius: 25px; 
  padding: 12px 30px; 
  font-size: 1.2rem; 
  font-weight: 900; 
  box-shadow: 0 6px 0 #453a27; 
  display: flex;
  align-items: center;
  gap: 8px; 
}

.currency-box.is-bag {
  font-size: 1.1rem;
  font-weight: bold;
  background: #fffdf9;
}

.shop-main-content {
  flex: 1;
  display: flex;
  align-items: stretch;
  gap: 40px;
  height: calc(100% - 80px);
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 1.2rem;
  color: #453a27;
}

/* ===================================================
   👗 左側：預覽面板
   =================================================== */
.preview-panel {
  flex: 0 0 35%;
  height: 100%;
}

.preview-card {
  background: #ffffff;
  border: 5px solid #453a27;
  border-radius: 35px;
  box-shadow: 0 8px 0 #453a27;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.preview-title-bar {
  background: #ecdcb9;
  border-bottom: 5px solid #453a27;
  padding: 15px;
  text-align: center;
  font-size: 1.3rem;
  font-weight: bold;
  color: #453a27;
}

.avatar-display-zone {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fdfbf7;
  position: relative;
}

.avatar-mock {
  text-align: center;
  width: 100%;
}

.avatar-img-preview {
  width: 300px;
  height: 300px;
  object-fit: contain;
  display: block;
  margin: 0 auto 15px;
}

.skin-name-preview {
  font-size: 1.4rem;
  color: #453a27;
  font-weight: bold;
  margin: 5px 0;
}

.try-on-tag {
  background: #fcc86d;
  color: #453a27;
  padding: 3px 12px;
  border: 2px solid #453a27;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: bold;
}

.equipped-tag {
  background: #e4987e;
  color: white;
  padding: 3px 12px;
  border: 2px solid #453a27;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: bold;
}

.action-zone {
  padding: 25px;
  border-top: 5px solid #453a27;
  background: #ffffff;
  display: flex;
  justify-content: center;
}

.shop-btn {
  width: 85%;
  padding: 12px 24px;
  font-size: 1.1rem;
  font-weight: bold;
  border: 4px solid #453a27;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-origin: bottom;
}

.shop-btn.is-actionable {
  background: #453a27;
  color: #fcf4e5;
}

.shop-btn.is-actionable:hover {
  transform: translateY(-3px) scaleY(1.08);
  box-shadow: 0 8px 0 #453a27;
}

.shop-btn.is-actionable:active {
  transform: translateY(4px) scaleY(0.88);
  box-shadow: 0 2px 0 #453a27;
}

.shop-btn.is-equipped {
  background: #e4987e;
  color: white;
  cursor: not-allowed;
  opacity: 0.7;
}

/* ===================================================
   🛒 右側：造型列表面板
   =================================================== */
.catalog-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 20px;
  overflow-y: auto;
  padding-right: 10px;
}

.catalog-panel::-webkit-scrollbar {
  width: 8px;
}

.catalog-panel::-webkit-scrollbar-track {
  background: transparent;
}

.catalog-panel::-webkit-scrollbar-thumb {
  background: #453a27;
  border-radius: 4px;
}

/* ===================================================
   📦 造型區塊
   =================================================== */
.skins-section {
  background: #ffffff;
  border: 5px solid #453a27;
  border-radius: 30px;
  box-shadow: 0 8px 0 #453a27;
  padding: 25px;
  display: flex;
  flex-direction: column;
}

.section-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #453a27;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 3px solid #453a27;
}

.section-header {
  margin-bottom: 15px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
}

.checkbox-input {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #453a27;
}

.checkbox-text {
  font-size: 1.1rem;
  font-weight: bold;
  color: #453a27;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 30px;
  color: #999;
  font-size: 1rem;
}

/* ===================================================
   🎴 造型卡片
   =================================================== */
.product-card {
  background: #fdfbf7;
  border: 4px solid #453a27;
  border-radius: 20px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 0 #453a27;
  background-color: #fcf4e5;
}

.product-card.is-selected {
  border-color: #fcc86d;
  background-color: #fff9ee;
  box-shadow: 0 4px 0 #453a27;
}

.product-title {
  font-size: 0.95rem;
  font-weight: bold;
  color: #453a27;
  text-align: center;
  margin-bottom: 8px;
  line-height: 1.2;
}

.product-img-box {
  width: 100%;
  height: 80px;
  background: #ffffff;
  border: 3px solid #453a27;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  margin-bottom: 8px;
}

.product-real-img {
  width: 85%;
  height: 85%;
  object-fit: contain;
}

.equipped-ribbon {
  position: absolute;
  background: #e4987e;
  color: #ffffff;
  border: 2px solid #453a27;
  border-radius: 6px;
  padding: 3px 8px;
  font-size: 0.75rem;
  font-weight: bold;
  transform: rotate(-10deg);
}

.status-tag {
  background: #ffffff;
  border: 3px solid #453a27;
  border-radius: 12px;
  padding: 3px 10px;
  font-size: 0.85rem;
  font-weight: bold;
  width: 100%;
  text-align: center;
}

.text-active {
  color: #e4987e;
}

.text-idle {
  color: #7a6e5d;
}

.text-unavailable {
  color: #999;
}

/* ===================================================
   💬 Hover 提示
   =================================================== */
.custom-tooltip {
  position: fixed;
  background: #453a27;
  color: #fcf4e5;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 0.9rem;
  z-index: 10000;
  pointer-events: none;
  max-width: 250px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.tooltip-title {
  font-weight: bold;
  margin-bottom: 5px;
}

.tooltip-body {
  font-size: 0.85rem;
  line-height: 1.4;
}
</style>
