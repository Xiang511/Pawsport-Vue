<script setup>
import { onMounted, ref, nextTick, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ChevronLeft, ChevronRight, Lock, Star, Home, Play, Currency } from 'lucide-vue-next'
import { animate, stagger } from 'animejs'
import { useGameAudio } from '@/composables/Client/useGameAudio'
import { usePlayerStore } from '@/stores/usePlayerStore'
import request from '@/api/axios'
import { Icon } from '@iconify/vue'

const { playSFX } = useGameAudio()

const userPoints = ref(0)
const router = useRouter()
const route = useRoute()
const isServerConnected = ref(false)
// 千位數格式化函數
const formatNumber = (num) => {
  if (num === null || num === undefined) return '0'
  return Math.round(num).toLocaleString('en-US')
}
// 【新增】Loading 狀態管理
const isLoading = ref(true)
const loadingProgress = ref(0)

// 【新增】Loading 文字計算屬性
const loadingText = computed(() => {
  return '正在繪製地圖...'.split('')
})

// 用來暫存後端撈回來的資料
const apiGameHistory = ref([])

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
    name: 'Cozy Corner',
    idRange: [1, 10],
    bgUrl: '/images/game/map-bg-1.png',
  },
  {
    name: 'Warm Haven',
    idRange: [11, 20],
    bgUrl: '/images/game/map-bg-2.png',
  },
  {
    name: 'Resting Oasis',
    idRange: [21, 30],
    bgUrl: '/images/game/map-bg-3.png',
  },
])

const currentAreaIndex = ref(0)
const levelDescriptions = {
  1: '學習如何照顧新家人！',
  2: '了解狗狗的習性與照護知識！',
  3: '貓咪的心思你猜不透？',
  4: '鳥兒的世界多采多姿！',
  5: '從倉鼠到兔子你都分得清楚嗎？',
  6: '探索水族與爬蟲的奧秘！',
};

// 計算當前應該顯示哪一段文字
const currentDescription = computed(() => {
  const levelId = selectedLevel?.value?.id;
  // 如果找到對應 ID 的敘述就顯示，找不到則顯示預設文字
  return levelDescriptions[levelId] || '準備好挑戰了嗎？點擊開始關卡吧！';
});
const levels = ref([
  { id: 1, name: '認養須知', isLocked: false },
  { id: 2, name: '狗狗百科', isLocked: true },
  { id: 3, name: '貓貓百科', isLocked: true },
  { id: 4, name: '鳥類百科', isLocked: true },
  { id: 5, name: '小動物百科', isLocked: true },
  { id: 6, name: '水族與爬蟲', isLocked: true },

])
const levelCategoryMap = {
  1: '認養須知',
  2: '狗狗百科', 
  3: '貓貓百科', 
  4: '鳥類百科',
  5: '小動物百科',
  6: '水族與爬蟲',
}
const selectedLevel = ref(null)

const generateLevelLayout = (startId) => {
  // 1. 讀取舊有本地遊戲進度（留作聯網失敗的備用防線）
  const progress = JSON.parse(localStorage.getItem('game_progress') || '{}')

  return Array.from({ length: 10 }, (_, i) => {
    const levelId = startId + i
    
    // 🎯 2. 星星數邏輯：優先讀取後端資料庫歷史，如果沒有再看本地
    let currentStars = 0
    const serverRecord = apiGameHistory.value.find(h => h.gameId === levelId)
    
    if (serverRecord) {
      // ✅ 修正：根據 receivedReward 推斷星星數
      if (serverRecord.receivedReward === true) {
        currentStars = 3  // 全對
      } else if (serverRecord.stageClear === true) {
        currentStars = 2  // 至少 6 題
      } else {
        currentStars = 0  // 未通過
      }
    } else {
      const currentLevelData = progress[`level_${levelId}`]
      currentStars = (currentLevelData && typeof currentLevelData.stars !== 'undefined') ? currentLevelData.stars : 0
    }

    // 🎯 3. 嚴格鎖定邏輯
    let isLocked = true 

    if (levelId === 1) {
      isLocked = false // 第一關永遠開放
    } else if (levelId === startId) {
      // 跨大區的第一關（如 11、21）
      const prevLevelRecord = apiGameHistory.value.find(h => h.gameId === levelId - 1)
      if (prevLevelRecord && prevLevelRecord.stageClear === true) {
        isLocked = false
      }
    } else {
      // 🎯 核心修正點：如果後端成功連線（不論有沒有資料，只要沒斷網）
      if (isServerConnected.value) {
        const prevLevelRecord = apiGameHistory.value.find(h => h.gameId === levelId - 1)
        const isPrevCleared = prevLevelRecord && prevLevelRecord.stageClear === true

        const thisLevelRecord = apiGameHistory.value.find(h => h.gameId === levelId)
        const isThisCleared = thisLevelRecord && thisLevelRecord.stageClear === true

        if (isPrevCleared || isThisCleared) {
          isLocked = false
        }
      } else {
        // 只有在完全斷網、沒連上伺服器時，才允許走這條本地離線防線
        if (levelId === 2) {
          if (progress['level_2_unlocked'] === true) isLocked = false
        } else {
          const prevLevelData = progress[`level_${levelId - 1}`]
          if (prevLevelData && progress[`level_${levelId}_unlocked`] === true) isLocked = false
        }
      }
    }

    return {
      id: levelId,
      stars: currentStars,
      locked: isLocked, 
      x: layoutCoords[i].x,
      y: layoutCoords[i].y,
      previewUrl: `/images/game/level-${levelId}.png`,
    }
  })
}

// 🎯 【關鍵修正】抽取大章節與關卡自動聚焦的決策邏輯
const determineAndFocusLevel = () => {
  // 🎯 優先讀取網址參數，如果網址沒帶（如點暫停返回漏帶），就讀取剛才點擊關卡時留下的記憶
  const lastPlayedId = parseInt(route.query.lastPlayedLevelId) || parseInt(sessionStorage.getItem('last_selected_level_id'))
  let targetLevelId = null

  if (lastPlayedId && !isNaN(lastPlayedId)) {
    // 1. 取出玩家在進入遊戲前，地圖上最新能玩的關卡 ID
    const savedLatestId = parseInt(sessionStorage.getItem('before_game_latest_level_id'))
    
    // 2. 檢查這一關在後端有沒有通關紀錄
    const currentRecord = apiGameHistory.value.find(h => h.gameId === lastPlayedId)
    const isCurrentCleared = currentRecord && currentRecord.stageClear === true

    // 🎯 核心判定
    if (savedLatestId && lastPlayedId === savedLatestId && isCurrentCleared && lastPlayedId < 30) {
      targetLevelId = lastPlayedId + 1 // 🚀 只有「打最新關」且「通關成功」才前進下一關
      console.log(`[導航決策] 成功攻克最新關卡 ${lastPlayedId}，前進至第 ${targetLevelId} 關`)
    } else {
      targetLevelId = lastPlayedId // ↩️ 玩舊關卡、中途暫停退出、未通關 -> 嚴格留在原本點擊的那一關
      console.log(`[導航決策] 判定為複習舊關卡或中途退出，精準停留在原關卡: ${targetLevelId}`)
    }

    // 清除快取記憶，保持乾淨
    sessionStorage.removeItem('before_game_latest_level_id')
    sessionStorage.removeItem('last_selected_level_id')
  }

  // 3. 計算目標關卡應該隸屬哪一個大區域章節，若不同則自動翻頁
  if (targetLevelId) {
    const targetAreaIndex = areas.value.findIndex(
      area => targetLevelId >= area.idRange[0] && targetLevelId <= area.idRange[1]
    )
    
    if (targetAreaIndex !== -1 && targetAreaIndex !== currentAreaIndex.value) {
      currentAreaIndex.value = targetAreaIndex
      const startId = areas.value[currentAreaIndex.value].idRange[0]
      levels.value = generateLevelLayout(startId)
    }
  }

  // 4. 高亮選中它
  const matchedLevel = levels.value.find(l => l.id === targetLevelId)
  if (matchedLevel) {
    selectedLevel.value = matchedLevel
  } else {
    // 降級防呆
    const latestUnlocked = levels.value.filter(l => !l.locked).pop()
    selectedLevel.value = latestUnlocked || levels.value[0]
  }
}
  const lastPlayedId = parseInt(route.query.lastPlayedLevelId)
  let targetLevelId = null

  if (lastPlayedId && !isNaN(lastPlayedId)) {
    // 1. 模擬下一關的 ID
    const nextLevelId = lastPlayedId + 1

    // 2. 先去資料庫歷史紀錄裡找，看「下一關」或「當前關」有沒有被解鎖的痕跡
    // 判斷邏輯：如果剛剛玩的關卡有通關 (stageClear == true)，或者下一關本身就有紀錄
    const currentRecord = apiGameHistory.value.find(h => h.gameId === lastPlayedId)
    const nextRecord = apiGameHistory.value.find(h => h.gameId === nextLevelId)
    const isNextUnlockedByServer = (currentRecord && currentRecord.stageClear === true) || nextRecord

    if (isNextUnlockedByServer && nextLevelId <= 30) {
      targetLevelId = nextLevelId // 🚀 通關了，解鎖新關卡 -> 預設選中新關卡！
      console.log(`[導航決策] 檢測到關卡 ${lastPlayedId} 已通關，自動聚焦新解鎖關卡: ${nextLevelId}`)
    } else {
      targetLevelId = lastPlayedId // ❌ 沒通關，或是最後一關 -> 留在原本那一關
      console.log(`[導航決策] 留在原本挑戰的關卡: ${lastPlayedId}`)
    }
  }

  // 3. 計算目標關卡應該隸屬哪一個大區域章節 (每10關一區)
  if (targetLevelId) {
    const targetAreaIndex = areas.value.findIndex(
      area => targetLevelId >= area.idRange[0] && targetLevelId <= area.idRange[1]
    )
    
    if (targetAreaIndex !== -1 && targetAreaIndex !== currentAreaIndex.value) {
      // 🚀 如果目標關卡在別的大章節，自動進行大章節翻頁切換
      currentAreaIndex.value = targetAreaIndex
      const startId = areas.value[currentAreaIndex.value].idRange[0]
      levels.value = generateLevelLayout(startId)
    }
  }

  // 4. 在當前渲染好的關卡清單中，找出對應的關卡物件並高亮選中它
  const matchedLevel = levels.value.find(l => l.id === targetLevelId)
  if (matchedLevel) {
    selectedLevel.value = matchedLevel
  } else {
    // 如果網址沒有參數、或者找不到，維持預設選中目前分頁最新解鎖的關卡
    const latestUnlocked = levels.value.filter(l => !l.locked).pop()
    selectedLevel.value = latestUnlocked || levels.value[0]
  }

// 3. 切換區域時更新關卡資料
const updateAreaContent = async () => {
  // 【新增】顯示 Loading 進度條
  isLoading.value = true
  loadingProgress.value = 0
  const playerStore = usePlayerStore()
  
  // 🚀 【修改】從 store 取得動態 PlayerId
  const playerId = playerStore.playerId
  
  console.log('🎮 LevelSelect - 取得 PlayerId:', playerId)
  
  if (!playerId) {
    console.error('❌ PlayerId 不存在')
    return
  }
  
  try {
    // A. 撲取通關歷史紀錄 - 【修改】使用動態 PlayerId
    const historyRes = await request.get(`/Player/${playerId}/game-history`)
    if (historyRes.data && historyRes.data.success) {
      apiGameHistory.value = historyRes.data.data
      isServerConnected.value = true;
      console.log('✅ 通關歷史已加載:', apiGameHistory.value.length, '筆')
    }

    // B. 精準撲取玩家資料 - 【修改】使用動態 PlayerId
    const playerRes = await request.get(`/Player/${playerId}`)
    if (playerRes.data && playerRes.data.success) {
      const playerData = playerRes.data.data
      userPoints.value = playerData.currentPoint ?? 0
      console.log('✅ [玩家資料同步成功] PlayerId:', playerId, ', 實時點數為:', userPoints.value)
    }
  } catch (error) {
    console.error('❌ 後端連線失敗，切換為本地安全模式:', error)
    // 斷網時的備用防禦點數，避免顯示 0 嚇到玩家
    if (userPoints.value === 0) userPoints.value = 1200 
    isServerConnected.value = false;
  }

  // 渲染地圖數據
  const startId = areas.value[currentAreaIndex.value].idRange[0]
  levels.value = generateLevelLayout(startId)

  // 🎯 【核心修正點】在這裡執行選關決策，它會完美處理初次進入、返回原地、通關解鎖並兼顧自動翻大分頁
  determineAndFocusLevel()

  await nextTick()
  
  console.log('🎮 LevelSelect - 渲染完成')
  
  const levelListPanel = document.querySelector('.level-list-panel')
  if (levelListPanel) {
    animate(levelListPanel, {
      opacity: [0, 1],
      scale: [0.95, 1],
      duration: 600,
      easing: 'easeOutQuad',
    })
  }
  
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

  const pathSvg = document.querySelector('.path-svg')
  if (pathSvg) {
    animate(pathSvg, {
      opacity: [0, 0.6],
      duration: 300,
      easing: 'easeInOutQuad',
    })
  }

  const infoCard = document.querySelector('.info-card')
  if (infoCard) {
    animate(infoCard, {
      opacity: [0, 1],
      scale: [0.95, 1],
      duration: 600,
      easing: 'easeOutQuad',
    })
  }
  // 【新增】動畫完成後關閉 Loading
  loadingProgress.value = 100
  setTimeout(() => {
    isLoading.value = false
  }, 300)
}

// 【新增】監聽 isLoading 狀態，當顯示時觸發文字彈跳動畫
watch(isLoading, (newVal) => {
  if (newVal) {
    // 等待 DOM 渲染完成，再執行動畫
    nextTick(() => {
      const loadingText = document.querySelector('.loading-text')
      if (loadingText) {
        animate(
          '.loading-char',
          {
            y: [
              { to: '-0.5rem', ease: 'out-expo', duration: 400 },
              { to: 0, ease: 'out-bounce', duration: 600, delay: 60 },
            ],
          },
          {
            delay: stagger(30),
          },
        )
      }
    })
  }
})


const playerStore = usePlayerStore()

const selectLevel = (lvl) => {
  if (!lvl.locked) {
    selectedLevel.value = lvl

    // 🎯【全時段鎖定】只要玩家點了這一關，我們就把當時地圖上最新解鎖的關卡 ID 記下來
    const mapLatestLevelId = Math.max(...levels.value.filter(l => !l.locked).map(l => l.id))
    sessionStorage.setItem('before_game_latest_level_id', mapLatestLevelId.toString())
    
    // 🎯 同時把玩家現在選的這關 ID 也存起來當作最強防線
    sessionStorage.setItem('last_selected_level_id', lvl.id.toString())
    
    console.log(`[地圖記憶] 玩家選中第 ${lvl.id} 關。當時地圖最新解鎖為: 第 ${mapLatestLevelId} 關`)
  }
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
    const levelId = selectedLevel.value.id
    const categoryName = levelCategoryMap[levelId] || '認養須知'

    // 🎯【新增鎖定邏輯】找出在進攻這一關之前，地圖上最新解鎖（也就是最大 ID）的關卡是哪一關
    // 這樣能百分之百防呆，不受後端回傳更新陣列的干擾
    const mapLatestLevelId = Math.max(...levels.value.filter(l => !l.locked).map(l => l.id))
    sessionStorage.setItem('before_game_latest_level_id', mapLatestLevelId.toString())

    console.log(`【PETMILY導航】準備進入第 ${levelId} 關。進遊戲前地圖最新關卡為: 第 ${mapLatestLevelId} 關`)

    router.push({
      name: 'Client-gameplay',         
      params: { category: categoryName },
      query: { currentLevelId: levelId } 
    }).catch((err) => {
      console.error('遊戲導航失敗:', err)
    })
  }
}

onMounted(async() => {
  const lastPlayedId = parseInt(route.query.lastPlayedLevelId)
  if (lastPlayedId && !isNaN(lastPlayedId)) {
    // 自動推算剛剛玩的關卡在哪個大區，避免一開畫面固定卡在第一章
    const targetAreaIndex = areas.value.findIndex(
      area => lastPlayedId >= area.idRange[0] && lastPlayedId <= area.idRange[1]
    )
    if (targetAreaIndex !== -1) {
      currentAreaIndex.value = targetAreaIndex
    }
  }
  isLoading.value = true
  if (playerStore.playerId) {
    // 已經有 ID，代表是重整後的恢復狀態
    // 這裡可以選擇不重新 fetch，直接顯示頁面，大幅提升速度
    isLoading.value = false; 
  } else {
    // 真的沒資料，才執行初始化
    await playerStore.initializePlayer();
  }
  updateAreaContent()
})
const goBack = () => router.push({ name: 'Client-mainmenu' })
</script>

<template>
  <!-- 【新增】全螢幕 Loading 進度條 -->
  <Transition name="fade">
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-container">
        <div class="loading-text">
          <span v-for="(char, index) in loadingText" :key="index + '-' + char" class="loading-char">
            {{ char }}
          </span>
        </div>
        <div class="progress-bar-wrapper">
          <div class="progress-bar" :style="{ width: loadingProgress + '%' }"></div>
        </div>
        <div class="progress-percentage">{{ Math.round(loadingProgress) }}%</div>
      </div>
    </div>
  </Transition>
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
      <div class="currency-box"><Icon icon="bi:coin" /> {{ formatNumber(userPoints) }}</div>
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
            <p class="info-description" >{{ currentDescription }}</p>
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
  cursor: url('/images/game/pointer.png') 16 16, auto;
}

.back-btn,
.circle-spot-card,
.arrow-btn,
.start-game-btn,
.menu-item,
.currency-box,
.loading-overlay {
  cursor: url('/images/game/pointer.png') 16 16, auto !important;
}
.level-select-page:active {
  cursor: url('/images/game/pointer.png') 16 16, auto;
}
.level-list-panel {
  flex: 1.6;
  background-color: #f6ebe0; 
  
  /* 🎯 點矩陣魔法：利用極小的圓形與錯位 */
  background-image: 
    radial-gradient(#e5d5c5 10%, transparent 11%),
    radial-gradient(#e5d5c5 10%, transparent 11%);
  
  /* 讓圓點變得極小（僅 3px），且彼此間距 24px，非常內斂 */
  background-size: 24px 24px;
  background-position: 0 0, 12px 12px;
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
  inset: 70px 50px 50px 80px; /* top, right, bottom, left */
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
  font-size: 7.5rem; /* 從 2.5rem 增加到 3.5rem */
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
  background-color: #f6ebe0; 
  
  /* 🎯 點矩陣魔法：利用極小的圓形與錯位 */
  background-image: 
    radial-gradient(#e5d5c5 10%, transparent 11%),
    radial-gradient(#e5d5c5 10%, transparent 11%);
  
  /* 讓圓點變得極小（僅 3px），且彼此間距 24px，非常內斂 */
  background-size: 24px 24px;
  background-position: 0 0, 12px 12px;
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
  height: 300px;
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
  font-size: 1.25rem;
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

/* 【新增】全螢幕 Loading 進度條樣式 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, rgba(69, 58, 39, 0.95), rgba(252, 200, 109, 0.1));
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
  backdrop-filter: blur(30px);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  /* background: #fcf4e5;
  border: 6px solid #453a27;
  border-radius: 40px;
  padding: 60px 80px;
  box-shadow: 0 12px 0 #453a27; */
  max-width: 1500px;
  width: 90%;
  height:40%;
  text-align: center;
  position: absolute;
}

.loading-text {
  font-size: 4rem;
  font-weight: 900;
  color: #453a27;
  letter-spacing: 2px;
  text-align: center;
  align-items: center;
  display: flex
}

.progress-bar-wrapper {
  width: 100%;
  height: 30%;
  background: #e5dfd5;
  border: 10px solid #453a27;
  border-radius: 50px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
    text-align: center;
  align-items: center;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #fcc86d, #ffd699, #fcc86d);
  width: 0%;
  transition: width 0.3s ease;
  box-shadow: 0 0 10px rgba(252, 200, 109, 0.6);
  border-radius: 12px;
    text-align: center;
  align-items: center;
}

.progress-percentage {
  font-size: 1.4rem;
  font-weight: 800;
  color: #453a27;
  min-width: 60px;
  text-align: center;
  align-items: center;
}

@keyframes loadingBlink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
