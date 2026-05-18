<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGameAudio } from '@/composables/useGameAudio'
import { animate } from 'animejs'

const { playSFX } = useGameAudio()

const router = useRouter()

// 💡 使用者擁有的點數
const userPoints = ref(1200)
const animatedPoints = ref({ value: 1200 })
const displayPoints = computed(() => Math.round(animatedPoints.value.value))

// 💡 Modal 狀態控制
const isModalOpen = ref(false)
const pendingSkin = ref(null) // 暫存目前正準備要買的那一個造型資料

const categories = ref([
  { id: 'cats', name: '貓咪造型' },
  { id: 'accessories', name: '頭飾配件' },
  { id: 'backgrounds', name: '更衣背景' }
])
const activeTab = ref('cats')

// 💡 造型基礎資料（已換成 imgUrl 路徑結構）
const dbSkins = ref([
  { id: 1, name: '經典三花貓', imgUrl: '/images/avatar/cat_calico.png', price: 300, isOwned: true, description: '最經典的元氣三花貓！據說能帶來好運與滿滿的朝氣。' },
  { id: 2, name: '厚實英短貓', imgUrl: '/images/avatar/cat_bsh.png', price: 170, isOwned: false, description: '擁有一對肥嘟嘟的腮幫子，軟綿綿的手感讓人一揉就停不下來。' },
  { id: 3, name: '優雅布偶貓', imgUrl: '/images/avatar/cat_ragdoll.png', price: 170, isOwned: false, description: '貓界的小仙女，優雅的長毛與湛藍的雙眼，高貴氣質滿點。' },
  { id: 4, name: '神祕黑貓', imgUrl: '/images/avatar/cat_black.png', price: 250, isOwned: false, description: '像黑夜精靈一樣神祕，金黃色的眼睛彷彿看穿了你藏零食的地方。' },
  { id: 5, name: '偵探小禮帽', imgUrl: '/images/avatar/hat_detective.png', price: 120, isOwned: false, description: '戴上它，感覺自己瞬間偵探魂上身！喵爾摩斯在此。' },
  { id: 6, name: '愛心紅領結', imgUrl: '/images/avatar/tie_heart.png', price: 90, isOwned: true, description: '精緻的紅領結，中間點綴著小愛心，適合在特別的日子裡裝扮。' },
  { id: 7, name: '陽光午後客廳', imgUrl: '/images/bg_livingroom.png', price: 500, isOwned: false, description: '陽光穿透窗簾灑在木地板上，空氣中瀰漫著溫暖而慵懶的氣息。' }
])

const hoverData = ref(null) // 儲存目前懸停的造型資料，為 null 時不顯示
const tooltipPos = ref({ x: 0, y: 0 }) // 儲存提示框的 xy 座標
// 顯示提示框並即時跟隨滑鼠
const showTooltip = (event, item) => {
  hoverData.value = item
  // 加上適當的偏移量（例如滑鼠右下方各 15px），避免提示框擋住滑鼠指標
  tooltipPos.value = {
    x: event.clientX + 15,
    y: event.clientY + 15
  }
}
// 滑鼠在卡片內移動時，持續更新位置
const moveTooltip = (event) => {
  tooltipPos.value = {
    x: event.clientX + 15,
    y: event.clientY + 15
  }
}
// 滑鼠離開卡片，隱藏提示框
const hideTooltip = () => {
  hoverData.value = null
}

const currentEquippedId = ref(1)
const previewSkin = ref({ ...dbSkins.value.find(s => s.id === currentEquippedId.value) })

const filteredSkins = computed(() => {
  return dbSkins.value.filter(skin => {
    if (activeTab.value === 'cats') return skin.id >= 1 && skin.id <= 4
    if (activeTab.value === 'accessories') return skin.id >= 5 && skin.id <= 6
    if (activeTab.value === 'backgrounds') return skin.id >= 7
    return false
  })
})

const selectSkin = (skin) => {
  previewSkin.value = { ...skin }
}

// 💡 裝備造型：直接無聲換上，不顯示 alert
const equipSkin = (id) => {
  currentEquippedId.value = id
}

// 💡 點擊購買按鈕：不直接扣款，而是打開 Modal 並塞入暫存造型
const openBuyModal = (skin) => {
  pendingSkin.value = skin
  isModalOpen.value = true
}

// 💡 關閉彈窗
const closeModal = () => {
  isModalOpen.value = false
  pendingSkin.value = null
}

// 💡 使用者點擊 Modal 的「確定購買」
const confirmBuySkin = () => {
  if (!pendingSkin.value) return

  if (userPoints.value >= pendingSkin.value.price) {
    const targetPoints = userPoints.value - pendingSkin.value.price
    userPoints.value = targetPoints 
    
    // 💡 2. 核心修正：把原本的 anime 改成 animate 
    animate(animatedPoints.value, {
      value: targetPoints,
      duration: 800,              
      easing: 'easeOutQuint',
      round: 1,                   
    })

    const found = dbSkins.value.find(s => s.id === pendingSkin.value.id)
    if (found) found.isOwned = true
    
    previewSkin.value.isOwned = true
    
    closeModal()
  }
}

const goBack = () => {
  router.push({ name: 'client-mainmenu' })
}
</script>

<template>
  <div class="shop-page-container">
    <div class="shop-header">
      <div class="header-left">
        <button class="back-btn" @click="playSFX('click');goBack()">
          <span class="arrow-icon">‹</span>
        </button>
        <h1 class="shop-title">造型商店</h1>
      </div>
      
      <div class="currency-box">🪙 {{ displayPoints }}</div>
    </div>

    <div class="shop-main-content">
      
      <div class="preview-panel">
        <div class="preview-card">
          <div class="preview-title-bar">試穿更衣間</div>
          
          <div class="avatar-display-zone">
            <div class="avatar-mock">
              <img v-if="previewSkin.imgUrl" :src="previewSkin.imgUrl" alt="preview" class="avatar-img-preview" />
              <p class="skin-name-preview">{{ previewSkin.name }}</p>
              <span v-if="previewSkin.id !== currentEquippedId" class="try-on-tag">試穿中</span>
            </div>
          </div>

          <div class="action-zone">
            <button v-if="previewSkin.id === currentEquippedId" class="shop-btn is-equipped" disabled>
              已裝備
            </button>
            <button v-else-if="previewSkin.isOwned" @click="playSFX('click');equipSkin(previewSkin.id)" class="shop-btn is-actionable">
              裝備造型
            </button>
            <button v-else @click="playSFX('click');openBuyModal(previewSkin)" class="shop-btn is-buy">
              確認購買 🪙 {{ previewSkin.price }}
            </button>
          </div>
        </div>
      </div>

      <div class="catalog-panel">
        <div class="category-tabs">
          <button 
            v-for="tab in categories" 
            :key="tab.id"
            :class="['tab-item', { 'is-active': activeTab === tab.id }]"
            @click="playSFX('click'); activeTab = tab.id"
          >
            {{ tab.name }}
          </button>
        </div>

        <div class="items-scroll-grid">
          <div 
  v-for="item in filteredSkins" 
  :key="item.id"
  :class="['product-card', { 'is-selected': previewSkin.id === item.id }]"
  @click="playSFX('click'); selectSkin(item)"
  @mouseenter="showTooltip($event, item)" 
  @mousemove="moveTooltip($event)"
  @mouseleave="hideTooltip"
>
            <div class="product-title">{{ item.name }}</div>
            
            <div class="product-img-box">
              <img :src="item.imgUrl" alt="product" class="product-real-img" />
              <div v-if="item.isOwned" class="owned-ribbon">Bought</div>
            </div>

            <div class="price-tag">
              <span class="tag-heart">🪙</span>
              <span class="tag-val">{{ item.price }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div 
      v-if="hoverData" 
      class="custom-tooltip"
      :style="{ left: tooltipPos.x + 'px', top: tooltipPos.y + 'px' }"
    >
      <div class="tooltip-title">{{ hoverData.name }}</div>
      <div class="tooltip-body">{{ hoverData.description }}</div>
    </div>

    <Transition name="modal-fade">
      <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
        <div class="modal-card">
          <div class="modal-header-bar">🛒 購買確認</div>
          
          <div class="modal-body">
            <p class="modal-text">
              你確定要花費 <span class="highlight-price">🪙 {{ pendingSkin?.price }}</span> 購買
              <br>
              <strong class="highlight-name">「{{ pendingSkin?.name }}」</strong> 嗎？
            </p>
            <p v-if="userPoints < (pendingSkin?.price || 0)" class="error-text">
              ⚠️ 餘額不足！你目前只有 🪙 {{ displayPoints }}
            </p>
          </div>

          <div class="modal-actions">
            <button class="modal-btn is-cancel" @click="playSFX('click');closeModal()">取消</button>
            <button 
              class="modal-btn is-confirm" 
              :disabled="userPoints < (pendingSkin?.price || 0)"
              @click="playSFX('success');confirmBuySkin()"
            >
              確定購買
            </button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>



<style scoped>
/* ===================================================
   🎨 全局版面配置 (維持你微調過後的精緻樣式)
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

.currency-box {
  background: #ffffff; 
  color: #453a27; 
  border: 4px solid #453a27; 
  border-radius: 25px; 
  padding: 12px 30px; 
  font-size: 1.3rem; 
  font-weight: 900; 
  box-shadow: 0 6px 0 #453a27; 
  display: flex;
  align-items: center;
  gap: 8px; 
  transition: all 0.2s ease; 
}

.currency-box:hover {
  background: #fcc86d; 
  transform: translateY(-2px); 
  box-shadow: 0 8px 0 #453a27;
}

.shop-main-content {
  flex: 1;
  display: flex;
  align-items: stretch;
  gap: 40px;
  height: calc(100% - 80px);
}

/* ===================================================
   👗 左側：試穿更衣間
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
  width: 150px;
  height: 150px;
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

.action-zone {
  padding: 25px;
  border-top: 5px solid #453a27;
  background: #ffffff;
  display: flex;
  justify-content: center;
}

/* ===================================================
   🛒 右側：商品貨架與卡片圖片控制
   =================================================== */
.catalog-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.category-tabs {
  display: flex;
  gap: 5px;
  margin-bottom: -5px;
  z-index: 2;
}

.tab-item {
  background: #ffffff;
  border: 5px solid #453a27;
  border-bottom: none;
  border-radius: 15px 15px 0 0;
  padding: 10px 25px;
  font-size: 1.1rem;
  font-weight: bold;
  color: #453a27;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-item.is-active {
  background: #ecdcb9;
  padding-top: 14px;
}

.items-scroll-grid {
  flex: 1;
  background: #ffffff;
  border: 5px solid #453a27;
  border-radius: 0 30px 30px 30px;
  box-shadow: 0 8px 0 #453a27;
  padding: 35px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  grid-auto-rows: minmax(210px, max-content);
  gap: 25px;
  overflow-y: auto;
}

.product-card {
  background: #fdfbf7;
  border: 4px solid #453a27;
  border-radius: 20px;
  padding: 15px;
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
  font-size: 1rem;
  font-weight: bold;
  color: #453a27;
  text-align: center;
  margin-bottom: 8px;
}

.product-img-box {
  width: 100%;
  height: 100px;
  background: #ffffff;
  border: 3px solid #453a27;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  margin-bottom: 10px;
}

.product-real-img {
  width: 85%;
  height: 85%;
  object-fit: contain;
}

.owned-ribbon {
  position: absolute;
  background: #e4987e;
  color: #ffffff;
  border: 3px solid #453a27;
  border-radius: 8px;
  padding: 4px 12px;
  font-size: 0.9rem;
  font-weight: bold;
  transform: rotate(-10deg);
}

.price-tag {
  background: #ffffff;
  border: 3px solid #453a27;
  border-radius: 15px;
  padding: 4px 15px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: bold;
  color: #453a27;
}

/* 通用按鈕手感 */
.shop-btn {
  width: 85%;
  padding: 12px 24px;
  font-size: 1.1rem;
  font-weight: bold;
  border-radius: 20px;
  border: 4px solid #453a27;
  cursor: pointer;
  transform-origin: bottom;
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.shop-btn.is-buy {
  background-color: #e4987e;
  color: white;
  box-shadow: 0 5px 0 #453a27;
}
.shop-btn.is-buy:hover {
  transform: translateY(-3px) scaleY(1.05);
  box-shadow: 0 8px 0 #453a27;
}

.shop-btn.is-actionable {
  background-color: #ffffff;
  color: #453a27;
  box-shadow: 0 5px 0 #453a27;
}
.shop-btn.is-actionable:hover {
  background-color: #fcf4e5;
  transform: translateY(-3px) scaleY(1.05);
  box-shadow: 0 8px 0 #453a27;
}

.shop-btn.is-equipped {
  background-color: #ecdcb9;
  color: #7a6e5d;
  box-shadow: none;
  cursor: not-allowed;
  transform: none !important;
}

.shop-btn:active:not(:disabled) {
  transform: translateY(3px) scaleY(0.9) !important;
  box-shadow: 0 2px 0 #453a27 !important;
  transition: all 0.05s ease;
}

/* ===================================================
   🔔 自訂手繪風 Modal 專屬樣式
   =================================================== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(69, 58, 39, 0.4); 
  backdrop-filter: blur(4px); 
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-card {
  background: #ffffff;
  border: 5px solid #453a27;
  border-radius: 30px;
  box-shadow: 0 12px 0 #453a27;
  width: 90%;
  max-width: 420px;
  overflow: hidden;
  animation: modalPop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.modal-header-bar {
  background: #ecdcb9;
  border-bottom: 5px solid #453a27;
  padding: 12px;
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: #453a27;
}

.modal-body {
  padding: 30px 25px;
  text-align: center;
}

.modal-text {
  font-size: 1.15rem;
  color: #453a27;
  line-height: 1.6;
  margin: 0;
}

.highlight-price {
  color: #e4987e;
  font-weight: bold;
  font-size: 1.3rem;
}

.highlight-name {
  font-size: 1.3rem;
  color: #453a27;
}

.error-text {
  color: #d96666;
  font-weight: bold;
  margin-top: 15px;
  font-size: 0.95rem;
}

/* 彈窗按鈕配置 */
.modal-actions {
  padding: 0 25px 25px;
  display: flex;
  gap: 15px;
}

.modal-btn {
  flex: 1;
  padding: 12px;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 16px;
  border: 4px solid #453a27;
  cursor: pointer;
  transform-origin: bottom;
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.modal-btn.is-cancel {
  background: #ffffff;
  color: #453a27;
  box-shadow: 0 4px 0 #453a27;
}
.modal-btn.is-cancel:hover {
  background-color: #fcf4e5;
  transform: translateY(-2px) scaleY(1.05);
  box-shadow: 0 6px 0 #453a27;
}

.modal-btn.is-confirm {
  background: #e4987e;
  color: white;
  box-shadow: 0 4px 0 #453a27;
}
.modal-btn.is-confirm:hover:not(:disabled) {
  transform: translateY(-2px) scaleY(1.05);
  box-shadow: 0 6px 0 #453a27;
}

.modal-btn:disabled {
  background: #ecdcb9;
  color: #7a6e5d;
  box-shadow: none;
  cursor: not-allowed;
  transform: none !important;
}

.modal-btn:active:not(:disabled) {
  transform: translateY(3px) scaleY(0.9) !important;
  box-shadow: 0 1px 0 #453a27 !important;
  transition: all 0.05s ease;
}

/* 動畫效果 */
@keyframes modalPop {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.modal-fade-leave-to {
  opacity: 0;
  transition: opacity 0.2s ease;
}

/* 🌐 滾動條 */
.items-scroll-grid::-webkit-scrollbar { width: 10px; }
.items-scroll-grid::-webkit-scrollbar-track { background: #fdfbf7; border-radius: 10px; }
.items-scroll-grid::-webkit-scrollbar-thumb { background: #ecdcb9; border: 3px solid #ffffff; border-radius: 10px; }

/* ===================================================
   浮動提示框（Tooltip）專屬手繪風樣式
   =================================================== */
.custom-tooltip {
  position: fixed; /* 使用 fixed 固定定位，依據瀏覽器視窗座標跟隨 */
  z-index: 9999; /* 確保它高於貨架與卡片，但低於全畫面 Modal 即可 */
  max-width: 240px;
  background-color: #fffdf9; /* 溫暖的乳白色 */
  border: 4px solid #453a27; /* 經典手繪粗邊框 */
  border-radius: 16px;       /* 圓潤感圓角 */
  box-shadow: 4px 4px 0px #453a27; /* 可愛的小黑影 */
  padding: 12px 16px;
  pointer-events: none; /* 🌟 關鍵：讓提示框不干涉滑鼠穿透，避免滑鼠抖動閃爍 */
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* 提示框造型名稱 */
.tooltip-title {
  font-size: 1.05rem;
  font-weight: bold;
  color: #e4987e; /* 使用你專案中的主橘色，引人注目 */
  border-bottom: 2px dashed #ecdcb9; /* 可愛虛線分隔線 */
  padding-bottom: 4px;
}

/* 提示框詳細描述文字 */
.tooltip-body {
  font-size: 0.9rem;
  color: #7a6e5d; /* 溫柔的 Morandi 灰褐色 */
  line-height: 1.4;
  word-break: break-all;
}
</style>