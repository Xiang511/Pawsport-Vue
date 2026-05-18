<script setup>
import { onMounted, ref, nextTick, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeft, ChevronRight, Lock, Star, Home, Play, Currency } from 'lucide-vue-next'
import { animate } from 'animejs'
import { useGameAudio } from '@/composables/useGameAudio'

const { playSFX } = useGameAudio()

const userPoints = ref(1200)
const router = useRouter()
const layoutCoords = [
  // 第一排：從左上往右下斜 (1~5 關)
  { x: 0, y: 0 },
  { x: 20, y: 20 },
  { x: 40, y: 0 },
  { x: 60, y: 20 },
  { x: 80, y: 0 },
  // 第二排：從右下往左下斜回頭 (6~10 關)
  { x: 80, y: 50 },
  { x: 60, y: 70 },
  { x: 40, y: 50 },
  { x: 20, y: 70 },
  { x: 0, y: 50 },
]
const pathCoords = [
  { x: 0, y: 0 },
  { x: 20, y: 20 },
  { x: 40, y: 0 },
  { x: 60, y: 20 },
  { x: 80, y: 0 },
  { x: 80, y: 30 }, // 改成 y: 30 而不是 y: 50
  { x: 60, y: 50 },
  { x: 40, y: 30 },
  { x: 20, y: 50 },
  { x: 0, y: 30 },
]
const pathD = computed(() => {
  if (!pathCoords || pathCoords.length === 0) return ''
  return pathCoords
    .map((p, i) => {
      return `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
    })
    .join(' ')
})

const areas = ref([
  {
    name: '微風森林',
    idRange: [1, 10],
    bgUrl: '/public/images/game/map-bg-1.png',
    desc: '探索綠意盎然的森林，尋找隱藏的足跡。',
  },
  {
    name: '霓虹雨後街',
    idRange: [11, 20],
    bgUrl: '/public/images/game/map-bg-2.png',
    desc: '在城市燈火中，追尋貓咪留下的線索。',
  },
  {
    name: '恆溫冰原',
    idRange: [21, 30],
    bgUrl: '/public/images/game/map-bg-3.png',
    desc: '在寒冷的冰原上，守護溫暖的歸宿。',
  },
])

const currentAreaIndex = ref(0)
const levels = ref([])
const selectedLevel = ref(null)

const generateLevelLayout = (startId) => {
  // 1. 讀取目前的遊戲總進度
  const progress = JSON.parse(localStorage.getItem('game_progress') || '{}')

  return Array.from({ length: 10 }, (_, i) => {
    const levelId = startId + i
    
    // 🎯 2. 讀取這關的真實星星數
    const currentLevelData = progress[`level_${levelId}`]
    const currentStars = (currentLevelData && typeof currentLevelData.stars !== 'undefined') 
      ? currentLevelData.stars 
      : 0

    // 🎯 3. 核心鎖定邏輯：除了第 1 關以外，預設通通是鎖定的 (true)
    let isLocked = true 

    if (levelId === 1) {
      // 🥇 第一關永遠解鎖
      isLocked = false 
    } 
    else if (levelId === 2) {
      // 🥈 第二關解鎖條件：第一關有星星紀錄，或者有被標記 level_2_unlocked
      if (progress['level_2_unlocked'] === true) {
    isLocked = false
  } else {
    isLocked = true
  }
    } 
    else {
      // 🥉 第三關（含）以後的關卡連鎖解鎖條件：前一關必須要有過關（星星）紀錄！
      // 例如：只有當第二關有星星資料 progress['level_2'] 時，第三關才會變成 false (解鎖)
      const prevLevelData = progress[`level_${levelId - 1}`]
  if (prevLevelData && progress[`level_${levelId}_unlocked`]) {
    isLocked = false
  } else {
    isLocked = true
  }
    }

    return {
      id: levelId,
      stars: currentStars,
      locked: isLocked, // 🌟 這裡會套用上面嚴格分類後的 true/false
      x: layoutCoords[i].x,
      y: layoutCoords[i].y,
      previewUrl: `/public/images/game/level-${levelId}.png`,
    }
  })
}

// 3. 切換區域時更新關卡資料
const updateAreaContent = async () => {
  const startId = areas.value[currentAreaIndex.value].idRange[0]
  levels.value = generateLevelLayout(startId)
  selectedLevel.value = levels.value[0]

  await nextTick()
  const levelListPanel = document.querySelector('.level-list-panel')
  if (levelListPanel) {
    animate(levelListPanel, {
      opacity: [0, 1],
      scale: [0.95, 1],
      duration: 600,
      easing: 'easeOutQuad',
    })
  }
  // 加上判斷避免 DOM 還沒渲染時 animejs 報錯
  const items = document.querySelectorAll('.level-card-item')
  if (items.length > 0) {
    animate('.level-card-item', {
      scale: [0.8, 1],
      opacity: [0, 1],
      delay: (el, i) => i * 30,
      duration: 500,
      easing: 'easeOutBack',
    })
  }
  // 虛線漸入動畫
  const pathSvg = document.querySelector('.path-svg')
  if (pathSvg) {
    animate(pathSvg, {
      opacity: [0, 0.6],
      duration: 300,
      easing: 'easeInOutQuad',
    })
  }

  // 資訊卡漸入動畫
  const infoCard = document.querySelector('.info-card')
  if (infoCard) {
    animate(infoCard, {
      opacity: [0, 1],
      scale: [0.95, 1],
      duration: 600,
      easing: 'easeOutQuad',
    })
  }
}

const selectLevel = (lvl) => {
  if (!lvl.locked) selectedLevel.value = lvl
}

const changeArea = (dir) => {
  const next = currentAreaIndex.value + dir
  if (next >= 0 && next < areas.value.length) {
    currentAreaIndex.value = next
    updateAreaContent()
  }
}

const startGame = () => {
  if (selectedLevel.value && !selectedLevel.value.locked) {
    const targetRouteName = `client-levelselect-${selectedLevel.value.id}`

    // 使用 router.hasRoute 檢查路由表中是否有這個名稱
    if (router.hasRoute(targetRouteName)) {
      router.push({ name: targetRouteName }).catch((err) => {
        console.error('導航失敗:', err)
      })
    } else {
      // 如果路由表中找不到對應名稱，就跳出提示
      console.warn(`找不到路由: ${targetRouteName}`)
      alert(`關卡 ${selectedLevel.value.id} 製作中，敬請期待後續更新！`)
    }
  }
}

onMounted(() => updateAreaContent())
const goBack = () => router.push({ name: 'client-mainmenu' })
</script>

<template>
  <div
    class="level-select-page"
    :style="{ backgroundImage: `url(${areas[currentAreaIndex].bgUrl})` }">
    <header class="game-header">
      <div class="nav-menu">
        <div class="header-left">
        <button class="back-btn" @click="playSFX('click');goBack()">
          <span class="arrow-icon">‹</span>
        </button>
        <h1 class="level-title">選擇關卡</h1>
      </div>
      </div>
      <div class="area-title">
        <h2>{{ areas[currentAreaIndex].name }}</h2>
        <p class="id-range">
          Lv. {{ areas[currentAreaIndex].idRange[0] }} - {{ areas[currentAreaIndex].idRange[1] }}
        </p>
      </div>
      <div class="currency-box">🪙 {{ userPoints }}</div>
    </header>

    <div v-if="showMenu" class="menu-dropdown">
      <button class="menu-item" @click="playSFX('click'); goBack()">返回主選單</button>
      <button class="menu-item" @click="playSFX('click'); handleSettings()">設定</button>
      <button class="menu-item" @click="playSFX('click'); handleAbout()">關於</button>
    </div>

    <main class="map-view">
      <button class="arrow-btn" @click="playSFX('click');changeArea(-1)" :disabled="currentAreaIndex === 0">
        <ChevronLeft :size="100" />
      </button>

      <div class="main-container">
        <div class="level-list-panel">
          <div class="level-grid">
            <svg class="path-svg" viewBox="0 0 85 120" preserveAspectRatio="none">
              <path :d="pathD" class="level-path-dashed" />
            </svg>

            <div
              v-for="lvl in levels"
              :key="lvl.id"
              class="level-card-item"
              :class="{
                'is-active': selectedLevel?.id === lvl.id && !lvl.locked,
                'is-locked': lvl.locked,
              }"
              :style="{ left: lvl.x + '%', top: lvl.y + '%' }">
              <div class="circle-spot-card" @click="playSFX('click'); selectLevel(lvl)">
                <span v-if="!lvl.locked" class="lvl-num">{{ lvl.id }}</span>
                <Lock v-else :size="24" class="lock-icon" />
                <div v-if="!lvl.locked" class="lvl-stars">
                  <Star v-for="i in 3" :key="i" :size="12" :class="{ active: i <= lvl.stars }" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="info-side-panel">
          <div class="info-card">
            <h3 class="info-title">第 {{ selectedLevel?.id }} 關</h3>
            <div class="info-image-box">
              <img :key="selectedLevel?.id" :src="selectedLevel?.previewUrl" alt="關卡預覽" />
            </div>
            <p class="info-description">{{ areas[currentAreaIndex].desc }}</p>
            <button
              class="start-game-btn"
              @click="playSFX('click'); startGame()"
              :disabled="!selectedLevel || selectedLevel.locked">
              開始 (START)
              <Play :size="24" fill="currentColor" />
            </button>
          </div>
        </div>
      </div>

      <button
        class="arrow-btn"
        @click="playSFX('click'); changeArea(1)"
        :disabled="currentAreaIndex === areas.length - 1">
        <ChevronRight :size="100" />
      </button>
    </main>
  </div>
</template>

<style scoped>
.level-select-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-size: cover;
  background-position: center;
  background-attachment: fixed; /* 新增：防止背景滾動 */
  overflow: hidden; /* 新增：隱藏溢出內容 */
}

.level-list-panel {
  flex: 1.6;
  background: #fcf4e5;
  border: 6px solid #453a27;
  box-shadow: 0 6px 0 #453a27;
  border-radius: 50px;
  /* 保持 padding 不變 */
  padding: 50px 50px 50px 80px;
  /* 確保內部相對定位，作為 SVG 的基準 */
  position: relative;
}
.level-grid {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: visible;
}
.path-svg {
  position: absolute;
  inset: 50px 50px 50px 80px; /* top, right, bottom, left */
  pointer-events: none;
  z-index: 1;
}
.level-path-dashed {
  fill: none; /* 必備：路徑不要填滿顏色 */
  stroke: #453a27; /* 必備：虛線顏色 */
  stroke-width: 1.5; /* 線條粗細 */
  stroke-dasharray: 4 4; /* 虛線間距 */
  stroke-linecap: round;
  opacity: 0.6;
}
.level-card-item {
  position: absolute;
  transform: translate(-50%, -50%); /* 核心：讓中心點對準座標 */
  z-index: 5;
}

.level-card-item.is-active .circle-spot-card,
.level-card-item.is-active .circle-spot-card:hover {
  background: #453a27 !important; /* 強制保持咖啡色背景 */
  color: #fcf4e5 !important; /* 強制保持米色文字 */
  border-color: #fcc86d;
  animation: pulse 1.2s infinite ease-in-out;
  transform: translateY(-5px);
  z-index: 10;
}

.level-card-item.is-active .circle-spot-card,
.level-card-item:not(.is-locked) .circle-spot-card:hover {
  background: #453a27 !important; /* 切換為咖啡色背景 */
  color: #fcf4e5 !important; /* 切換為米色文字 */
  border-color: #fcc86d;
  transform: translateY(-5px); /* 懸停或選定時微浮 */
}
.level-card-item:not(.is-locked) .circle-spot-card:active {
  transform: translateY(4px) scale(0.95); /* 往下壓並稍微縮小 */
  box-shadow: 0 2px 0 #453a27; /* 陰影變短 */
  transition: all 0.05s ease;
}
.circle-spot-card {
  width: 140px;
  height: 140px;
  background: #fcf4e5;
  border-radius: 50%;
  border: 5px solid #453a27;
  color: #453a27;
  box-shadow: 0 6px 0 #453a27;
  display: flex;
  flex-direction: column; /* 讓內容上下排列 */
  align-items: center;
  justify-content: center; /* 置中排列 */
  position: relative;
  gap: 2px; /* 數字與星星之間的間距 */
  cursor: pointer;
  transition: all 0.2s ease;
}
.circle-spot-card:hover:not(.is-locked *) {
  background: #fcebd0; /* 懸停時米色稍微加深 */
  transform: translateY(-3px); /* 輕微浮起即可，不要 pulse */
}
.is-locked .circle-spot-card {
  background: #b5b5b5;
  border-color: #666;
  box-shadow: 0 6px 0 #666;
  cursor: not-allowed;
  animation: none;
  transform: none;
}

.game-header {
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 10;
}
.area-title {
  display: flex;
  flex-direction: column; /* 讓標題和小標上下排列 */
  align-items: center; /* 水平置中 */
  justify-content: center; /* 垂直置中 */
  gap: 5px; /* 標題和小標之間的間距 */
  color: #453a27; /* 淺色文字 */
  padding: 10px 30px;
  border-radius: 20px;
}
.area-title h2 {
  font-size: 5.5rem; /* 從 2.5rem 增加到 3.5rem */
  font-weight: 900;
  margin: 0; /* 移除預設 margin */
  line-height: 1.2;
  text-shadow:
    -2px -2px 0 #fcf4e5,
    2px -2px 0 #fcf4e5,
    -2px 2px 0 #fcf4e5,
    2px 2px 0 #fcf4e5;
}

.map-view {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 0 20px;
}
.main-container {
  display: flex;
  gap: 20px; /* 增加兩個大區塊之間的間距 */
  width: 92%; /* 寬度擴張到螢幕 92% */
  max-width: 1600px; /* 提高上限 */
  height: 70vh; /* 關鍵：使用視窗高度的 70%，讓方塊變高 */
  align-items: stretch; /* 確保左右兩邊一樣高 */
  z-index: 10;
}
.info-side-panel {
  flex: 1; /* 佔據大約 40% 的剩餘空間 */
  min-width: 350px; /* 關鍵：設定最小寬度，防止它縮到看不見 */
  z-index: 20;
}
.info-card {
  height: 100%;
  background: #fcf4e5;
  border: 5px solid #453a27;
  box-shadow: 0 6px 0 #453a27; /* 增加厚實感 */
  border-radius: 40px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between; /* 讓標題、圖、按鈕平均分佈 */
}
.info-title {
  font-size: 2.2rem;
  font-weight: 900;
  color: #fcf4e5; /* 淺色文字 */
  background: #453a27; /* 深色底，與邊框呼應 */
  padding: 10px 30px;
  border-radius: 20px;
  margin-top: -20px; /* 稍微往上提，打破矩形的死板 */
}
.info-image-box {
  width: 100%;
  height: 250px;
  border: 5px solid #453a27; /* 統一邊框厚度 */
  border-radius: 30px; /* 大圓角矩形 */
  overflow: hidden; /* 確保圖片不超出圓角 */
  background-color: #453a27;
}
.info-image-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease-in-out;
}
.info-description {
  font-size: 1.1rem;
  color: #453a27;
  line-height: 1.6;
  text-align: center;
  padding: 0 10px;
  margin: 15px 0;
  font-weight: 500;
}

.id-range {
  color: #453a27; /* 改成主題淺色 */
  font-weight: bold;
  opacity: 1; /* 改成完全不透明 */
  margin-top: 5px; /* 調整間距 */
  font-size: 1.3rem; /* 放大小標 */
  letter-spacing: 1px; /* 增加字距 */
  margin-bottom: 0px; /* 移除底部 margin */
  text-shadow:
    -1px -1px 0 #fcf4e5,
    1px -1px 0 #fcf4e5,
    -1px 1px 0 #fcf4e5,
    1px 1px 0 #fcf4e5;
}

.lvl-num {
  font-size: 3rem;
  font-weight: 900;
  color: inherit;
  line-height: 1.1;
  transform: translateY(-20px);
  transition: color 0.3s;
  z-index: 2;
  position: relative;
}

.level-card-item.is-active .lvl-num {
  color: #fcf4e5 !important; /* 使用 !important 確保覆蓋任何動畫中的預設顏色 */
  transform: translateY(-20px); /* 保持數字在圓圈內較上方的位置 */
}

.level-card-item.is-active .lvl-stars svg:not(.active),
.level-card-item:not(.is-locked) .circle-spot-card:hover .lvl-stars svg:not(.active) {
  color: #fcf4e5;
  opacity: 0.6;
}

/* 修改星星容器，使其與圓圈重合 */
.lvl-stars {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* 確保不會擋到點擊 */
  margin-top: 0; /* 移除之前的偏移 */
  transform: none; /* 移除之前的偏移 */
}

.lvl-stars svg {
  position: absolute;
  width: 30px;
  height: 30px;
  left: 50%;
  top: 40%;
  /* 核心公式：
     1. translate(-50%, -50%) 讓星星先回到圓心
     2. rotate 控制在圓形上的角度
     3. translateY 控制距離圓心的距離（正值向下）
  */
  color: #453a27; /* 星星的外框顏色 */
  fill: none; /* 未獲取時不填滿 */
  opacity: 1; /* 稍微降低透明度，讓它看起來像背景 */
  transition:
    color 0.3s ease,
    fill 0.3s ease;
}

/* 設定三顆星星的角度與弧度 */
.lvl-stars svg:nth-child(1) {
  transform: translate(-50%, -50%) rotate(-40deg) translateY(52px);
}

.lvl-stars svg:nth-child(2) {
  transform: translate(-50%, -50%) rotate(0deg) translateY(57px);
}

.lvl-stars svg:nth-child(3) {
  transform: translate(-50%, -50%) rotate(40deg) translateY(52px);
}

.lvl-stars .active {
  fill: #fcc86d;
  color: #fcc86d;
}

.lock-icon {
  color: #555;
}

.start-game-btn {
  width: 100%;
  padding: 18px;
  background: #fcf4e5;
  color: #453a27;
  border: 4px solid #453a27;
  border-radius: 25px; /* 圓角矩形樣式 */
  font-size: 1.5rem;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  cursor: pointer;
  box-shadow: 0 8px 0 #453a27; /* 增加底部厚度 */
  transition: all 0.2s ease;
}
/* 按鈕懸停效果 */
.start-game-btn:hover {
  background: #fcc86d;
  transform: translateY(-4px); /* 向上微浮 */
  box-shadow: 0 12px 0 #453a27;
}

/* 按鈕點擊效果 */
.start-game-btn:active {
  transform: translateY(4px); /* 往下壓 */
  box-shadow: 0 4px 0 #453a27;
}
.start-game-btn:disabled {
  background: #b5b5b5; /* 灰色背景 */
  color: #666; /* 灰色文字 */
  border-color: #666;
  box-shadow: none; /* 移除陰影，看起來像是壓扁的 */
  cursor: not-allowed; /* 滑鼠游標顯示不可點擊 */
  transform: none; /* 取消懸停位移 */
  opacity: 0.7;
}
.start-game-btn:hover:not(:disabled) {
  background: #fcc86d;
  transform: translateY(-4px);
  box-shadow: 0 12px 0 #453a27;
}
.start-game-btn:active:not(:disabled) {
  /* 往下壓的位移：原本 -4px + 下壓 8px = 4px */
  transform: translateY(4px);

  /* 陰影縮短，模擬按下的感覺 */
  box-shadow: 0 4px 0 #453a27;

  /* 縮短點擊時的過渡時間，讓反應更即時 */
  transition: all 0.05s ease;
}
.arrow-btn {
  width: 100px;
  height: 150px;
  background: #fcf4e5; /* 符合配色 */
  border: 4px solid #453a27;
  border-radius: 20px; /* 圓角矩形 */
  color: #453a27;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 0 #453a27; /* 增加厚實感 */
  transition: all 0.2s ease;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 30;
}

.arrow-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
.arrow-btn:hover:not(:disabled) {
  background: #fcc86d;
  transform: translateY(-55%) scale(1.05); /* 稍微往上跳動 */
}
.arrow-btn:active:not(:disabled) {
  transform: translateY(-45%); /* 點擊下壓感 */
  box-shadow: 0 2px 0 #453a27;
}
.arrow-btn:first-child {
  left: 30px;
}
.arrow-btn:last-child {
  right: 30px;
}

.currency-box {
  background: #fcf4e5; /* 淺色背景 */
  color: #453a27; /* 深色文字 */
  border: 4px solid #453a27; /* 邊框 */
  border-radius: 25px; /* 圓角 */
  padding: 12px 30px; /* 內邊距 */
  font-size: 1.3rem; /* 放大字體 */
  font-weight: 900; /* 加粗 */
  box-shadow: 0 6px 0 #453a27; /* 陰影效果 */
  display: flex;
  align-items: center;
  gap: 8px; /* 圖標和文字之間的間距 */
  transition: all 0.2s ease; /* 平滑過渡 */
}

.currency-box:hover {
  background: #fcc86d; /* 懸停時變色 */
  transform: translateY(-2px); /* 向上浮起 */
  box-shadow: 0 8px 0 #453a27;
}

.nav-menu {
  position: relative;
  z-index: 101;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

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

.level-title {
  font-size: 2.2rem;
  color: #453a27;
  text-shadow:
    -1px -1px 0 #fcf4e5,
    1px -1px 0 #fcf4e5,
    -1px 1px 0 #fcf4e5,
    1px 1px 0 #fcf4e5;
  margin: 0;
  font-weight: bold;
}

.menu-dropdown {
  position: fixed;
  top: 130px;
  left: 40px;
  background: #fcf4e5;
  border: 4px solid #453a27;
  border-radius: 15px;
  box-shadow: 0 6px 0 #453a27;
  min-width: 150px;
  z-index: 102;
  overflow: hidden;
}

.menu-item {
  display: block;
  width: 100%;
  padding: 12px 20px;
  background: transparent;
  border: none;
  color: #453a27;
  font-size: 1rem;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid #ddd;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:hover {
  background: #fcc86d;
  padding-left: 25px;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
  }
  100% {
    transform: scale(1);
  }
}
</style>
