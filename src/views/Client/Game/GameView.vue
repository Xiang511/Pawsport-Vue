<script setup>
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Home } from 'lucide-vue-next'
import { animate, stagger } from 'animejs'
import { useGameAudio } from '@/composables/Client/useGameAudio'
import { usePlayerStore } from '@/stores/usePlayerStore'

const { playSFX, forcePlayBGM, updateBGMVolume, updateSFXVolume, hasPromptedAudio } = useGameAudio()
const playerStore = usePlayerStore()
const router = useRouter()

// 控制彈窗是否顯示
const showAudioModal = ref(!hasPromptedAudio.value)

// 初始化狀態
const isInitializing = ref(true)
const initError = ref('')

// 計算屬性：檢查玩家是否已初始化
const isPlayerReady = computed(() => playerStore.isPlayerLoaded)

// 當玩家點擊「開啟音效」
const enableAudio = () => {
  showAudioModal.value = false
  // 不管第幾次點擊同意，都直接把音量調回預設值
  updateBGMVolume(30) // 背景音樂恢復 30%
  updateSFXVolume(50) // 遊戲音效恢復 50%
  forcePlayBGM() // 100% 成功播放音樂！
  playSFX('click') // 順便播一個點擊反饋
}

// 當玩家點擊「靜音開始」
const disableAudio = () => {
  showAudioModal.value = false
  updateBGMVolume(0) // 直接把背景音樂拉到 0%
  updateSFXVolume(0)
  forcePlayBGM()
  // playSFX('click')
}

// 初始化玩家資料
const initializePlayerFromAuth = async () => {
  try {
    isInitializing.value = true
    initError.value = ''

    const success = await playerStore.initializePlayer()

    if (success) {
      console.log('✅ 玩家資料初始化成功')
      showAudioModal.value = !hasPromptedAudio.value
      return true
    } else {
      initError.value = playerStore.error || '無法初始化玩家資料'
      console.error('❌ 玩家初始化失敗:', initError.value)
      return false
    }
  } catch (error) {
    console.error('❌ 初始化過程出錯:', error)
    initError.value = '初始化過程出錯，請重試'
    return false
  } finally {
    isInitializing.value = false
  }
}

const router_instance = useRouter()
const titleText = 'PETMILY'

onMounted(async() => {
  // 頁面加載時自動初始化玩家資料
  await initializePlayerFromAuth()

  const playTitleAnimation = () => {
    animate(
      '.letter',
      {
        y: [
          { to: '-8rem', ease: 'out-expo', duration: 600 },
          { to: '4rem', ease: 'out-bounce', duration: 800, delay: 500 },
        ],
        rotate: { from: '0turn', to: '1turn' },
      },
      {
        delay: stagger(50),
      },
    )
  }

  // 1. 進入時立刻跑一次
  playTitleAnimation()

  // 2. 每 5 秒觸發一次（動畫 2秒 + 閒置 3秒 = 5000ms）
  const timer = setInterval(playTitleAnimation, 5000)

  // 3. 重要：離開頁面時要清掉計時器，避免記憶體洩漏
  onUnmounted(() => {
    clearInterval(timer)
  })
})

const proceedToMenu = () => {
  if (isPlayerReady.value) {
    router_instance.push({ name: 'Client-mainmenu' })
  } else if (isInitializing.value) {
    alert('正在初始化玩家資料，請稍候...')
  } else if (initError.value) {
    alert(initError.value)
  } else {
    alert('請先登入')
  }
}

// 返回 Petmily 官方首頁
const backToWebHome = (event) => {
  // 使用 stopPropagation 防止點擊按鈕時觸發父層的 proceedToMenu
  event.stopPropagation()
  router.push({ name: 'home' })
}
</script>

<template>
  <!-- 初始化錯誤提示 -->
  <Transition name="fade">
    <div v-if="initError && !isInitializing" class="audio-auth-mask">
      <div class="audio-auth-card">
        <h3 class="auth-title">⚠️ 初始化失敗</h3>
        <p class="auth-desc">{{ initError }}</p>

        <div class="auth-btn-group">
          <button class="auth-btn btn-cancel" @click="backToWebHome">返回首頁</button>
        </div>
      </div>
    </div>
  </Transition>

  <Transition name="fade">
    <div v-if="showAudioModal" class="audio-auth-mask">
      <div class="audio-auth-card">
        <h3 class="auth-title">PETMILY 知識問答</h3>
        <div class="auth-desc">
          <p>為了提供最好的遊戲體驗，建議按下F11全螢幕遊玩。</p>
          </div>
        <div class="auth-desc-2">
          <p>本遊戲包含背景音樂與療癒音效。<br>是否開啓音效？</p>
        </div>

        <div class="auth-btn-group">
          <button class="auth-btn btn-confirm" @click="enableAudio">🔊 開啓音效</button>
          <button class="auth-btn btn-cancel" @click="disableAudio">🔇 靜音遊玩</button>
        </div>
      </div>
    </div>
  </Transition>
  <div class="game-start-screen" @click="proceedToMenu">
    <div class="back-home-btn" @click="backToWebHome">
      <Home :size="18" />
      <span>返回首頁</span>
    </div>

    <div class="logo-container">
      <h1 class="game-logo">
        <span v-for="(char, index) in titleText" :key="index" class="letter">
          {{ char }}
        </span>
      </h1>
      <div class="logo-accent"></div>
    </div>

    <!-- 根據初始化狀態顯示不同提示 -->
    <div class="press-hint">
      <p v-if="isInitializing">正在初始化遊戲資料...</p>
      <p v-else-if="isPlayerReady">點 選 任 意 位 置 進 入 遊 戲</p>
      <p v-else>無法載入遊戲資料，請嘗試重新登入</p>
    </div>

    <div class="footer-info">
      <p>© 2026 Petmily. All rights reserved.</p>
    </div>
  </div>
</template>

<style scoped>
.game-start-screen {
  height: 100vh;
  background-color: #f7ede2; 
  
  /* 🎯 純 CSS 網格微斜紋魔法：利用線性漸層疊加 */
  background-image: url("/images/game/GameViewBG.png");
  /* 調整格子的大小（數字越小格子越密） */
  background-position:center;
  background-size: 150%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: url('/images/game/pointer.png') 16 16, auto;
  position: relative;
  overflow: hidden;
  user-select: none;
  transition: cursor 0.1s ease;
}

.game-start-screen:active {
  cursor: url('/images/game/pointer.png') 16 16, pointer;
}

/* 確保按鈕或特殊元件不會覆蓋掉這個游標 (選用) */
.game-start-screen button, 
.game-start-screen .back-home-btn {
  cursor: url('/images/game/pointer.png') 16 16, auto;
}

.back-home-btn {
  position: absolute;
  top: 30px;
  left: 30px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: rgba(69, 58, 39, 0.1); /* 淡淡的咖啡色透明底 */
  color: #453a27;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: bold;
  transition: all 0.3s ease;
  border: 1px solid rgba(69, 58, 39, 0.2);
  z-index: 10;
}

.back-home-btn:hover {
  background-color: #453a27;
  color: #fcf4e5;
  transform: translateX(5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.game-logo {
  font-size: 250px;
  font-weight: 900;
  color: #fcf4e5;                  /* 最內層核心：粉嫩鵝黃肉體 */
  letter-spacing: 15px;
  display: flex;
  justify-content: center;
  user-select: none;
  
  /* 🎯 2. 核心第一層框：最貼近文字的深咖啡色粗邊 (10px) */
  -webkit-text-stroke: 15px #453a27;
  paint-order: stroke fill;        /* 確保粗邊乖乖往外生長，絕不吃進文字內裏 */
  
  /* ===================================================
     🎯 3. 終極魔法：用兩組 filter 分開影印出 鵝黃邊 與 純白邊
     =================================================== */
  /* filter 的渲染順序是「由上往下」像蓋章一樣疊上去：
     第一組 4 顆：抓取目前的「字+深色框」，朝四周推 6px，印出你期待的明亮鵝黃色。
     第二組 4 顆：抓取前一步「字+深色框+鵝黃色」的總外輪廓，再朝四周推 6px，印出最外圈的白色！ */
  filter: 
    drop-shadow(0px 6px 0px #ffe2af)
    
    /* 🤍 第二步：在鵝黃色外再包上最後一圈 6px 的乾淨純白外邊 */
    drop-shadow(6px 0px 0px #ffffff)
    drop-shadow(-6px 0px 0px #ffffff)
    drop-shadow(0px 6px 0px #ffffff)
    drop-shadow(0px -6px 0px #ffffff);
}

.letter {
  display: inline-block; /* 極度重要：否則 transform 不會生效 */
  padding: 0 5px;
  opacity: 1;
}

.press-hint {
  margin-top: 100px;
  font-weight: 500;
  color: #453a27;
  font-size: 1.5rem;
  letter-spacing: 5px;
  animation: blink 2s infinite;
}

.footer-info {
  position: absolute;
  bottom: 30px;
  color: #453a27;
  font-size: 10px;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.2;
  }
}

/* 滿版遮罩 */
.audio-auth-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(69, 58, 39, 0.6); /* 你的深咖啡色底加透明度 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
  backdrop-filter: blur(4px); /* 稍微模糊背景，很有質感 */
  cursor: url('/images/game/pointer.png') 16 16, auto !important;
}

/* 彈窗卡片 */
.audio-auth-card {
  background-color: #fcf4e5; /* 溫暖的米色底 */
  border: 4px solid #453a27; /* 招牌咖啡色粗框 */
  border-radius: 20px;
  padding: 30px;
  width: 100%;
  height: 400px;
  max-width: 500px;
  text-align: center;
  box-shadow: 0 8px 0 #453a27; /* 復古感厚重陰影 */
}

.auth-title {
  font-size: 2.5rem;
  font-weight: 900;
  color: #453a27;
}

.auth-desc {
  font-size: 0.85rem;
  font-weight: 700;
  color: #6e5f47;
  line-height: 1.5;
  margin-bottom: 25px;
}
.auth-desc-2 {
  font-size: 1.65rem;
  font-weight: 700;
  color: #6e5f47;
  line-height: 1.5;
  margin-bottom: 15px;
}

/* 按鈕群組 */
.auth-btn-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}     

.auth-btn {
  padding: 12px;
  font-size: 1.1rem;
  font-weight: 800;
  border: 3px solid #453a27;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.1s ease;
  cursor: url('/images/game/pointer.png') 16 16, auto !important;
}

.auth-btn:active {
  transform: scale(0.98);
}

/* 莫蘭迪綠按鈕 */
.btn-confirm {
  background-color: #a8d5ba; 
  color: #453a27;
}

/* 莫蘭迪米紅按鈕 */
.btn-cancel {
  background-color: #f2a6a6;
  color: #453a27;
}

/* 彈窗淡入淡出動畫 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
