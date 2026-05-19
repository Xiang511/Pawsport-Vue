<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Home } from 'lucide-vue-next'
import { animate, stagger } from 'animejs'
import { useGameAudio } from '@/composables/useGameAudio'

const { playSFX, forcePlayBGM, updateBGMVolume, updateSFXVolume, hasPromptedAudio } = useGameAudio()
// import 'animate.css';

// 控制彈窗是否顯示
const showAudioModal = ref(!hasPromptedAudio.value)

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

const router = useRouter()
const titleText = 'PETMILY'
onMounted(() => {
  const playTitleAnimation = () => {
    animate(
      '.letter',
      {
        y: [
          { to: '-3rem', ease: 'out-expo', duration: 600 },
          { to: 0, ease: 'out-bounce', duration: 800, delay: 100 },
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
  // 點擊後跳轉到主選單路由
  router.push({ name: 'client-mainmenu' })
}

// 返回 Petmily 官方首頁
const backToWebHome = (event) => {
  // 使用 stopPropagation 防止點擊按鈕時觸發父層的 proceedToMenu
  event.stopPropagation()
  router.push({ name: 'home' })
}
</script>

<template>
  <Transition name="fade">
    <div v-if="showAudioModal" class="audio-auth-mask">
      <div class="audio-auth-card">
        <h3 class="auth-title">Petmily知識遊戲</h3>
        <p class="auth-desc">
          為了提供最好的遊戲體驗，本遊戲包含背景音樂與療癒音效。是否開啟音訊？
        </p>

        <div class="auth-btn-group">
          <button class="auth-btn btn-confirm" @click="enableAudio">🔊 開啟音效進場</button>
          <button class="auth-btn btn-cancel" @click="disableAudio">🔇 靜音進場</button>
        </div>
      </div>
    </div>
  </Transition>
  <div class="game-start-screen" @click="proceedToMenu">
    <div class="back-home-btn" @click="backToWebHome">
      <Home :size="18" />
      <span>返回 Petmily 首頁</span>
    </div>

    <div class="logo-container">
      <h1 class="game-logo">
        <span v-for="(char, index) in titleText" :key="index" class="letter">
          {{ char }}
        </span>
      </h1>
      <div class="logo-accent"></div>
    </div>

    <div class="press-hint">
      <p>點 選 任 意 位 置 進 入 遊 戲</p>
    </div>

    <div class="footer-info">
      <p>© 2026 Petmily. All rights reserved.</p>
    </div>
  </div>
</template>

<style scoped>
.game-start-screen {
  height: 100vh;
  background-color: #fcf4e5; /* 奶油米色背景 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  user-select: none;
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
  font-size: 200px;
  color: #453a27;
  font-weight: 900;
  letter-spacing: 15px;
  display: flex;
  justify-content: center;
  -webkit-text-stroke: 4px #453a27;
  paint-order: stroke fill;
  text-shadow:
    1px 1px 0 #453a27,
    -1px -1px 0 #453a27,
    1px -1px 0 #453a27,
    -1px 1px 0 #453a27,
    5px 5px 0px rgba(252, 200, 109, 0.3);
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
  font-size: 1.2rem;
  letter-spacing: 2px;
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
}

/* 彈窗卡片 */
.audio-auth-card {
  background-color: #fcf4e5; /* 溫暖的米色底 */
  border: 4px solid #453a27; /* 招牌咖啡色粗框 */
  border-radius: 20px;
  padding: 30px;
  width: 90%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 8px 0 #453a27; /* 復古感厚重陰影 */
}

.auth-title {
  font-size: 1.6rem;
  font-weight: 900;
  color: #453a27;
  margin-bottom: 15px;
}

.auth-desc {
  font-size: 1.1rem;
  font-weight: 700;
  color: #6e5f47;
  line-height: 1.5;
  margin-bottom: 25px;
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
