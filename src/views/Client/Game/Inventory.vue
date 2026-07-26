<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameAudio } from '@/composables/useGameAudio'
import { usePlayerStore } from '@/stores/usePlayerStore'
import request from '@/api/axios'
import { Eye, EyeOff } from 'lucide-vue-next'
import { Icon } from '@iconify/vue'

const { playSFX } = useGameAudio()
const router = useRouter()

// 千位數格式化函數
const formatNumber = (num) => {
  if (num === null || num === undefined) return '0'
  return Math.round(num).toLocaleString('en-US')
}

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
  description: '',
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
    const playerResponse = await request.get(`/Player/${playerId}`)
    if (playerResponse.data.success) {
      playerData.value = playerResponse.data.data

      if (playerData.value) {
        userPoints.value = playerData.value.currentPoint
        currentEquippedId.value = playerData.value.enabledSkinId || 2
      }
    }

    // 2. 獲取所有造型
    const shopResponse = await request.get('/Shop')
    if (shopResponse.data.success) {
      const shopSkins = shopResponse.data.data

      // 3. 合併資料
      allSkins.value = shopSkins.map((skin) => {
        const isOwned = playerData.value?.ownedSkins?.some((s) => s.skinId === skin.skinId) || false

        // 確保圖片路徑包含完整的後端 URL
        let imgUrl = skin.skinImage
        if (imgUrl && !imgUrl.startsWith('http')) {
          // 如果是相對路徑，添加後端伺服器地址
          imgUrl = `${imgUrl}?t=${Date.now()}`
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
          description: skin.description,
        }
      })

      // 4. 設置預覽造型為目前裝備的造型
      const enabledSkin = playerData.value?.ownedSkins?.find((s) => s.enable === true)
      if (enabledSkin) {
        // 找到對應的造型資訊
        const matchingSkin = allSkins.value.find((s) => s.id === enabledSkin.skinId)
        if (matchingSkin) {
          previewSkin.value = { ...matchingSkin }
        }
      } else {
        // 如果沒有裝備的造型，預設顯示 SkinId=2（預設造型）
        const defaultSkin = allSkins.value.find((s) => s.id === 2)
        if (defaultSkin) {
          previewSkin.value = { ...defaultSkin }
        } else {
          // 如果 SkinId=2 不存在，顯示第一個已擁有的造型
          const ownedSkinsArray = allSkins.value.filter((s) => s.isOwned)
          if (ownedSkinsArray.length > 0) {
            previewSkin.value = { ...ownedSkinsArray[0] }
          } else {
            // 如果沒有已擁有的造型，顯示第一個未擁有的造型
            const unownedSkinsArray = allSkins.value.filter((s) => !s.isOwned)
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
  return allSkins.value.filter((s) => !s.isOwned && s.id !== 1)
})

// 篩選已擁有的造型（排除 SkinId=1 的遊戲獎勵）
const ownedSkins = computed(() => {
  return allSkins.value.filter((s) => s.isOwned && s.id !== 1)
})

// 已擁有造型數量（排除 SkinId=1 的遊戲獎勵）
const ownedCount = computed(() => allSkins.value.filter((s) => s.isOwned && s.id !== 1).length)

// 選擇造型
const selectSkin = (skin) => {
  previewSkin.value = { ...skin }
  playSFX('click');
}

// 切換未擁有造型的顯示（添加 Loading 狀態）
const toggleUnownedSkins = async () => {
  if (showUnownedSkins.value) {
    // 取消勾選，直接隱藏
    showUnownedSkins.value = false
  } else {
    // 勾選，顯示 Loading 進度
    isLoadingUnownedSkins.value = true
    playSFX('click');

    // 模擬異步操作（實際上只是渲染造型卡片，所以用 setTimeout 讓 UI 更新）
    await new Promise((resolve) => setTimeout(resolve, 300))

    showUnownedSkins.value = true
    isLoadingUnownedSkins.value = false
  }
}

// 裝備造型（只有已擁有的造型才能裝備）
const equipSkin = async (id) => {
  const playerStore = usePlayerStore()
    const playerId = playerStore.playerId
  try {
    const response = await request.put(`/Player/${playerId}/equip-skin`, {
      playerId: playerId,
      skinId: id,
    })

    if (response.data.success) {
      // 立即更新本地狀態
      currentEquippedId.value = id

      // 更新預覽造型的狀態
      if (previewSkin.value) {
        previewSkin.value = { ...previewSkin.value }
      }

      playSFX('click');
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
    query: { selectSkinId: skin.id },
  })
}

// Hover 提示
const showTooltip = (event, item) => {
  hoverData.value = item
  tooltipPos.value = {
    x: event.clientX + 15,
    y: event.clientY + 15,
  }
}

const moveTooltip = (event) => {
  tooltipPos.value = {
    x: event.clientX + 15,
    y: event.clientY + 15,
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
        <button
          class="back-btn"
          @click="
            playSFX('click');
            goBack()
          ">
          <span class="arrow-icon">‹</span>
        </button>
        <h1 class="shop-title">我的收藏</h1>
      </div>

      <div class="header-right-group">
        <button
          type="button"
          :disabled="isLoadingUnownedSkins"
          :class="['checkbox-label', { 'is-active': showUnownedSkins }]"
          @click="toggleUnownedSkins">
          <span class="icon-wrapper">
            <Eye v-if="showUnownedSkins" :size="18" stroke-width="2.5" />
            <EyeOff v-else :size="18" stroke-width="2.5" />
          </span>
          <span class="checkbox-text">
            {{ showUnownedSkins ? '隱藏未擁有造型' : '顯示未擁有造型' }}
          </span>
        </button>
        <div class="currency-box"><Icon icon="bi:coin" /> {{ formatNumber(userPoints) }}</div>
      </div>
    </div>

    <div v-if="isLoadingData" class="loading-state">
      <div class="spinner-large"></div>
      <p class="loading-text-big">整理收藏庫...</p>
    </div>

    <div v-else class="shop-main-content">
      <!-- 左側：預覽面板 -->
      <div class="preview-panel">
        <div class="preview-card">
          <div class="preview-title-bar">當前造型</div>

          <div class="avatar-display-zone">
            <div class="avatar-mock">
              <img
                v-if="displaySkin?.imgUrl"
                :src="displaySkin.imgUrl"
                alt="preview"
                class="avatar-img-preview" />
              <p class="skin-name-preview">{{ displaySkin?.name }}</p>
              <div class="preview-desc-box" v-if="previewSkin">
                <p class="preview-desc-text">
                  {{ previewSkin?.description || '這個造型還沒有詳細描述唷！' }}
                </p>
              </div>
            </div>
          </div>

          <div class="action-zone">
            <!-- 已擁有且已裝備 -->
            <button
              v-if="
                displaySkin?.isOwned &&
                (displaySkin?.id === currentEquippedId ||
                  (currentEquippedId === null && displaySkin?.id === 0))
              "
              class="shop-btn is-equipped"
              disabled>
              已裝備
            </button>
            <!-- 已擁有但未裝備 -->
            <button
              v-else-if="displaySkin?.isOwned"
              @click="
                playSFX('click');
                equipSkin(displaySkin.id)
              "
              class="shop-btn is-actionable">
              確認裝備
            </button>
            <!-- 未擁有 -->
            <button
              v-else
              @click="
                playSFX('click');
                goToBuySkin(displaySkin)
              "
              class="shop-btn is-actionable">
              前往購買
            </button>
          </div>
        </div>
      </div>

      <!-- 右側：造型列表面板 -->
      <div class="catalog-panel">
        <div class="skins-section">
          <div class="section-top-header">
            <div class="section-title">已擁有的造型</div>
          </div>

          <div class="items-grid">
            <div v-if="ownedSkins.length === 0" class="empty-state">
              <p>您還沒有擁有任何造型</p>
            </div>

            <div
              v-for="item in ownedSkins"
              :key="item.id"
              :class="['product-card', { 'is-selected': previewSkin?.id === item.id }]"
              @click="
                playSFX('click');
                selectSkin(item)
              "
              @mouseenter="showTooltip($event, item)"
              @mousemove="moveTooltip($event)"
              @mouseleave="hideTooltip">
              <div class="product-title">{{ item.name }}</div>

              <div class="product-img-box">
                <img :src="item.imgUrl" alt="product" class="product-real-img" />
              </div>
            </div>
          </div>
        </div>

        <div v-if="showUnownedSkins || isLoadingUnownedSkins" class="skins-section">
          <div class="section-top-header">
            <div class="section-title">尚未擁有的造型</div>
          </div>

          <div v-if="isLoadingUnownedSkins" class="loading-container">
            <div class="spinner-small"></div>
            <p class="loading-text">正在載入未擁有的造型...</p>
          </div>

          <div v-else class="items-grid">
            <div v-if="unownedSkins.length === 0" class="empty-state">
              <p>您已擁有所有造型！</p>
            </div>

            <div
              v-for="item in unownedSkins"
              :key="item.id"
              :class="['product-card', { 'is-selected': previewSkin?.id === item.id }]"
              @click="
                playSFX('click');
                selectSkin(item)
              "
              @mouseenter="showTooltip($event, item)"
              @mousemove="moveTooltip($event)"
              @mouseleave="hideTooltip">
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
    :style="{ left: tooltipPos.x + 'px', top: tooltipPos.y + 'px' }">
    <div class="tooltip-title">{{ hoverData.name }}</div>
    <div class="tooltip-body">{{ hoverData.description }}</div>
  </div>
</template>

<style scoped>
/* ===================================================
   🎨 核心樣式
   =================================================== */
.shop-page-container {
  min-height: 100vh;
  /* 🎯 基礎低飽和度 Morandi 溫暖底色 */
  background-color: #f7ede2;

  /* 🎯 純 CSS 網格微斜紋魔法：利用線性漸層疊加 */
  background-image:
    linear-gradient(45deg, #efe3d3 25%, transparent 25%, transparent 75%, #efe3d3 75%, #efe3d3),
    linear-gradient(45deg, #efe3d3 25%, transparent 25%, transparent 75%, #efe3d3 75%, #efe3d3);

  /* 調整格子的大小（數字越小格子越密） */
  background-size: 60px 60px;
  background-position:
    0 0,
    30px 30px;

  padding: 24px;
  box-sizing: border-box;
  cursor: url('/images/game/pointer.png') 16 16, auto !important;
}

.shop-page-container button,
.shop-page-container .item-card,
.shop-page-container .close-btn,
.shop-page-container .equip-btn,
.shop-page-container .tab-item {
  cursor: url('/images/game/pointer.png') 16 16, auto !important;
}

.spinner-large,
.spinner-small,
.loading-overlay {
  cursor: url('/images/game/pointer.png') 16 16, auto !important;
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
  background: #fcf4e5;
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
  margin-right: 50px;
  white-space: nowrap;
}

.shop-main-content {
  flex: 1;
  display: flex;
  align-items: flex-start;
  gap: 40px;
  height: calc(100vh - 160px);
  max-height: calc(100vh - 160px);
  overflow: hidden; /* 阻止父容器變形 */
  animation: popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.loading-state {
  /* 🎯 1. 核心定位：固定定位，死死鎖定整個瀏覽器視窗 */
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw; /* 撐滿整個螢幕寬度 */
  height: 100vh; /* 撐滿整個螢幕高度 */

  /* 🎯 2. 核心布局：讓內部的大圈圈與文字上下垂直排列，並精準幾何居中 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 30px; /* 圈圈與文字的間距 */

  /* 🎯 3. 層級鎖定：確保加載畫面絕對蓋在最上層（不被商店其他卡片遮擋） */
  z-index: 9999;

  /* ===================================================
     🎯 4. 完美複製：與首頁 100% 同步的森系微斜紋背景
     =================================================== */
  background-color: #f7ede2; /* Morandi 溫暖底色 */
  background-image:
    linear-gradient(45deg, #efe3d3 25%, transparent 25%, transparent 75%, #efe3d3 75%, #efe3d3),
    linear-gradient(45deg, #efe3d3 25%, transparent 25%, transparent 75%, #efe3d3 75%, #efe3d3);
  background-size: 60px 60px;
  background-position:
    0 0,
    30px 30px;

  font-size: 1.2rem;
  color: #453a27;
}

/* ===================================================
   👗 左側：預覽面板
   =================================================== */
.preview-panel {
  flex: 0 0 35%;
  height: 99%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center; /* 讓繪本卡片在左側空間中完美垂直居中 */
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

.preview-desc-box {
  margin-top: 16px;
  padding: 12px 16px;
  background-color: #faf3e8; /* 比背景再深一點點的溫暖羊皮紙色 */
  border: 3px solid #453a27; /* 符合 UI 的標誌性粗邊框 */
  border-radius: 12px;
  width: 85%; /* 寬度稍窄，收在正中央看起來比較內斂 */
  margin-left: auto;
  margin-right: auto;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05); /* 微內陰影，營造下陷手感 */
}

.preview-desc-text {
  font-size: 0.95rem;
  font-weight: 700; /* 偏粗字體，在 Morandi 色系下更清晰 */
  color: #5c4e37; /* 比主色稍微淺一點點的深咖啡，閱讀較舒適 */
  line-height: 1.5;
  margin: 0;
  text-align: center; /* 文字居中對齊 */
  word-break: break-all; /* 防止英文或特殊符號把版面撐開 */
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
  background-color: #fcc86d;
  color: #453a27;
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
  scrollbar-gutter: stable;
  padding-right: 40px !important;
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
  max-height: max-content;
}

.section-top-header {
  display: flex;
  justify-content: space-evenly; /* 讓標題在左，勾選框在右 */
  align-items: center; /* 垂直居中對齊 */
  width: 100%;
  margin-bottom: 20px; /* 與下方商品格子的間距 */
  padding: 0 10px; /* 稍微給點內縮，對齊網格 */
}

.section-top-header .section-title {
  font-size: 1.4rem;
  font-weight: 900;
  color: #453a27;
  margin-bottom: 0;
}

.checkbox-label {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;

  /* 🎯 預設狀態（熄滅）：完美同步右側點數框的溫暖米底色 */
  background: #fcf4e5;
  height: 60px;
  padding: 8px 18px;
  border: 4px solid #453a27;
  border-radius: 20px;
  box-shadow: 0 4px 0 #453a27;

  /* 讓顏色、下沉動畫過渡非常滑順 */
  transition:
    transform 0.08s cubic-bezier(0.25, 0.8, 0.25, 1),
    box-shadow 0.08s cubic-bezier(0.25, 0.8, 0.25, 1),
    background-color 0.15s ease;
  animation: popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* 📝 標籤文字（預設深色） */
.checkbox-text,
.icon-wrapper {
  color: #453a27;
  font-size: 1.5rem;
  font-weight: 900;
  line-height: 1;
  transition: color 0.15s ease; /* 讓字體顏色切換時有柔和漸變 */
}

.icon-wrapper {
  margin-right: 8px;
  display: flex;
  align-items: center;
}

/* 🎯 核心魔法：讓 SVG 圖標強制繼承父層的文字顏色 (currentColor) */
.icon-wrapper svg {
  display: block;
  color: currentColor;
}

.checkbox-label.is-active {
  background-color: #453a27;
}

.checkbox-label.is-active .checkbox-text,
.checkbox-label.is-active .icon-wrapper {
  color: #ffffff;
}

.checkbox-label:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 0 #453a27;
}

.checkbox-label:active:not(:disabled) {
  transform: translateY(4px);
  box-shadow: 0 0px 0 #453a27; /* 點擊下沉，陰影貼平 */
}

.checkbox-label:disabled {
  cursor: not-allowed;
  opacity: 0.6;
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
  background: #fcf4e5;
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
  cursor: url('/images/game/pointer.png') 16 16, auto !important;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 0 #453a27;
  animation: card-bg-flash 0.5s ease-in-out infinite alternate;
}

.product-card:active {
  /* 🎯 點下去時往下平移：相對於 hover 的 translateY(-4px)，
     我們讓它沉降到比平常更低的微幅平移，製造按下去的物理動態 */
  transform: translateY(2px);

  /* 🎯 縮小陰影：原本是 6px 的厚重立體陰影，點擊時縮小到 2px，
     這樣在視覺上卡片就會像是緊貼著底層桌面 */
  box-shadow: 0 2px 0 #453a27;

  /* 🎯 加快反應速度：點下去的瞬間要瞬間反饋（0.05秒），按鈕感覺才會「彈手」 */
  transition:
    transform 0.05s ease-out,
    box-shadow 0.05s ease-out;
}

@keyframes card-bg-flash {
  0% {
    /* 啟始點：原本設定的經典米色 */
    background-color: #fcc86d;
  }
  100% {
    /* 呼吸頂點：稍微變亮到接近純白（但帶有溫暖黃調） */
    background-color: #fffdf9;

    border-color: #fcc86d;
  }
}

.product-card.is-selected {
  border-color: #453a27;
  background-color: #fcc86d;
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
  background-color: #f7ede2;

  /* 🎯 精細雙向交織線：創造軟綿綿的微像素編織感 */
  background-image:
    linear-gradient(90deg, rgba(234, 221, 206, 0.7) 1px, transparent 1px),
    linear-gradient(0deg, rgba(234, 221, 206, 0.7) 1px, transparent 1px);

  /* ⚡ 關鍵：縮小到 20px，讓它變成低調精緻的背景底紋 */
  background-size: 10px 10px;
  border: 3px solid #453a27;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  margin-bottom: 8px;
  cursor: url('/images/game/pointer.png') 16 16, auto !important;
}
.product-img-box:active {
  cursor: url('/images/game/pointer.png') 16 16, auto !important;
}
.product-img-box * {
  cursor: url('/images/game/pointer.png') 16 16, auto !important;
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
  /* 🎯 背景換成米色，維持 Morandi 質感 */
  background: #fdf6e6;
  /* 🎯 加上核心的深色粗邊框 */
  border: 4px solid #453a27;
  /* 🎯 調整為更貼合整體的圓角 */
  border-radius: 18px;
  /* 🎯 文字顏色換回深色 */
  color: #453a27;
  /* 🎯 文字對齊左側 */
  text-align: left;
  /* 調整內邊距 */
  padding: 15px 20px;
  font-size: 0.9rem;
  z-index: 10000;
  pointer-events: none;
  max-width: 250px;
  /* 🎯 修改陰影，使其與商品卡片的懸浮陰影一致 */
  box-shadow: 0 8px 0 #453a27;
  /* ✨ 加上滑動出現的動畫特效 ( Anime.js style transition ) */
  animation: tooltip-slide-up 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.tooltip-title {
  font-weight: 900; /* 加粗字體 */
  margin-bottom: 6px;
  font-size: 1.1rem; /* 稍微放大小標 */
  border-bottom: 2px dashed #e8dcc8; /* 加一條淡淡的點點分隔線 */
  padding-bottom: 4px;
}

.tooltip-body {
  font-size: 0.9rem;
  line-height: 1.5;
  font-weight: 500;
}

@keyframes tooltip-slide-up {
  0% {
    opacity: 0;
    transform: translateY(10px) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 大型 Spinner（頁面加載用） */
.spinner-large {
  width: 500px;
  height: 500px;
  border: 50px solid #e8dcc8;
  border-top-color: #453a27;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* 小型 Spinner（區塊加載用） */
.spinner-small {
  width: 40px;
  height: 40px;
  border: 4px solid #e8dcc8;
  border-top-color: #453a27;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* 旋轉動畫 */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Loading 容器調整 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  padding: 30px;
}

.loading-text {
  font-size: 1rem;
  color: #453a27;
  font-weight: 600;
}

.loading-text-big {
  font-size: 2.8rem;
  color: #453a27;
  font-weight: 600;
  position: absolute;
}

.pop-in-enter-active {
  animation: popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.pop-in-leave-active {
  animation: popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) reverse;
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
