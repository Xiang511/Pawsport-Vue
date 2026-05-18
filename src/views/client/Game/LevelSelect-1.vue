<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  X,
  Circle,
  Pause,
  Play,
  ChevronRight,
  Home,
  RotateCcw,
  LogOut,
  Star,
} from 'lucide-vue-next'
import { animate } from 'animejs'
import { useGameAudio } from '@/composables/useGameAudio'
import LevelResultModal from '@/components/Pawsport/LevelResultModal.vue' 

const isResultOpen = ref(false) // 專門控制獨立結算組件的開啟

const {
  bgm,
  playSFX,
  updateBGMVolume,
  bgmVolume,
  sfxVolume,
  updateSFXVolume,
  pauseCountdown,
  resumeCountdown,
} = useGameAudio()
const bgmSlider = ref(bgmVolume ? bgmVolume.value * 100 : 30)
const sfxSlider = ref(sfxVolume ? sfxVolume.value * 100 : 50)

watch(bgmSlider, (newVal) => {
  updateBGMVolume(newVal)
})
watch(sfxSlider, (newVal) => {
  updateSFXVolume(newVal)
})
const handlePauseToggle = () => {
  playSFX('click')
  isPaused.value = !isPaused.value
  if (!gameStarted.value) {
    if (isPaused.value) {
      pauseCountdown() // 暫停音效
    } else {
      resumeCountdown() // 繼續音效
    }
  }
}
const router = useRouter()

// --- 遊戲狀態管理 ---
const gameStarted = ref(false)
const startCountdown = ref(3) // 開場 3 秒倒數
const isPaused = ref(false)
const currentQuestionIndex = ref(0)
const timeLeft = ref(10) // 每題 10 秒
const showExplanation = ref(false)
const userScore = ref(0)
const timerInterval = ref(null)
const countdownInterval = ref(null)
const isUserCorrect = ref(false)
const stars = ref([])
const wrongEffects = ref([])

// --- 題目資料 ---
const questions = ref([
  {
    text: '領養寵物前，應該先評估自己的經濟能力是否能負擔醫療與伙食費。',
    answer: true,
    explanation:
      '養育寵物除了基本伙食，還有每年的疫苗、健檢以及突發的醫療費用，穩定的經濟能力是負責表現的第一步。',
  },
  {
    text: '貓咪是獨立的動物，所以領養後不需要每天花時間陪伴或玩耍。',
    answer: false,
    explanation:
      '貓咪雖然相對獨立，但仍需要人類的陪伴、互動與遊戲來維持心理健康，長期忽視會導致焦慮或行為問題。',
  },
  {
    text: '在台灣領養犬隻後，法律規定必須辦理寵物登記並植入晶片。',
    answer: true,
    explanation:
      '根據《動物保護法》，飼主應為寵物辦理登記並植入晶片，這也是遺失時找回寵物的重要依據。',
  },
  {
    text: '為了保持環境整潔，領養貓咪後應該立即進行去爪手術（Declawing）。',
    answer: false,
    explanation:
      '去爪手術實際上是截斷腳趾節骨，會對貓咪造成極大痛苦並影響其平衡與行為，這在許多國家被視為虐待行為。',
  },
  {
    text: '領養幼犬、幼貓比領養成犬、成貓更好，因為牠們比較乖巧且不需要訓練。',
    answer: false,
    explanation:
      '幼年動物通常充滿活力且需要大量社會化訓練與耐心；而成犬、成貓性格多已穩定，對新手飼主來說有時是更好的選擇。',
  },
  {
    text: '家中的巧克力、洋蔥、葡萄等食物對貓狗來說是具危險性的毒素。',
    answer: true,
    explanation:
      '許多人類美食對寵物是有毒的，例如巧克力中的可可鹼、洋蔥中的硫化物都會導致嚴重的中毒甚至死亡。',
  },
  {
    text: '領養寵物是一輩子的承諾，不應因為搬家、結婚或生子等人生變動而輕易棄養。',
    answer: true,
    explanation:
      '寵物是家人，在做任何人生重大決定時，都應將寵物的安置一併納入考慮，確保牠們的生活不受影響。',
  },
  {
    text: '只要有準時餵食，寵物並不需要每年的預防針或健康檢查。',
    answer: false,
    explanation:
      '預防針能預防重大傳染病（如狂犬病、核心疫苗），定期檢查看似花錢，實則能及早發現潛在疾病，節省長遠醫療開銷。',
  },
  {
    text: '領養前應確認家中的窗戶或陽台是否已做好防護措施，以防寵物墜樓。',
    answer: true,
    explanation:
      '特別是貓咪容易被窗外的昆蟲吸引而發生墜樓意外（高樓症候群），充足的防護網是保護牠們生命的基本條件。',
  },
  {
    text: '如果領養的寵物生病了，可以自行餵食人類的成藥（如普拿疼）來緩解症狀。',
    answer: false,
    explanation:
      '人類藥物的成分與劑量對寵物極其危險，例如普拿疼會導致貓狗急性肝腎衰竭，生病務必諮詢專業獸醫師。',
  },
])

const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])

// --- 計時器邏輯 ---
const startTimer = () => {
  if (timerInterval.value) clearInterval(timerInterval.value)

  // 記錄開始計時的絕對時間，解決切換標籤頁 (Tab) 導致 setInterval 變慢的問題
  let startTime = Date.now()
  let initialTime = timeLeft.value

  timerInterval.value = setInterval(() => {
    if (isPaused.value) {
      startTime = Date.now() // 暫停時重置參考時間
      initialTime = timeLeft.value
      return
    }

    const elapsed = Math.floor((Date.now() - startTime) / 1000)
    timeLeft.value = initialTime - elapsed

    if (timeLeft.value <= 0) {
      timeLeft.value = 0
      handleAnswer(null) // 時間到自動進入結算
    }
  }, 100) // 縮短檢查頻率確保精準度
}

// --- 開場倒數邏輯 ---
const runStartCountdown = () => {
  // 1. 一開始就播放完整的三秒倒數音效
  playSFX('countdown')

  // 👈 修正：將 cd 改為 countdownInterval.value
  countdownInterval.value = setInterval(() => {
    if (!isPaused.value) {
      if (startCountdown.value > 1) {
        startCountdown.value--
      } else if (startCountdown.value === 1) {
        startCountdown.value = 'START!'
      } else {
        clearInterval(countdownInterval.value)
        gameStarted.value = true
        startTimer()
      }
    }
  }, 1000)
}

// --- 答題處理 ---
const handleAnswer = (choice, event) => {
  if (showExplanation.value) return
  clearInterval(timerInterval.value)

  const correct = choice === currentQuestion.value.answer
  isUserCorrect.value = correct
  if (correct) {
    playSFX('success') // 播放成功音效 (對應你 useGameAudio 裡的 key)
    userScore.value++
  } else {
    playSFX('fail') // 播放失敗音效 (對應你 useGameAudio 裡的 key)
  }
  createStars(event, correct)
  showExplanation.value = true
}

// --- 星星噴發特效 ---
const createStars = (e, isCorrect) => {
  if (!e || !e.target) return

  const rect = e.target.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  const batchId = Date.now()

  // 每次點擊先清空，防止特效疊加
  stars.value = []
  wrongEffects.value = []

  if (isCorrect) {
    const count = 6
    for (let i = 0; i < count; i++) {
      stars.value.push({ id: `${batchId}-${i}`, x: centerX, y: centerY })
    }

    nextTick(() => {
      animate(
        '.star-particle-wrapper',
        {
          x: [0, () => (Math.random() - 0.5) * 1000],
          y: [0, () => Math.random() * -700 - 100],
          scale: [0, 4, 0],
          rotate: [0, () => (Math.random() - 0.5) * 1500],
          opacity: [1, 0],
        },
        {
          duration: 1500,
          easing: 'out-expo',
          onComplete: () => {
            stars.value = []
          },
        },
      )
    })
  } else {
    // --- 答錯：狗狗 GIF ---
    wrongEffects.value.push({ id: batchId, x: centerX, y: centerY })

    nextTick(() => {
      animate(
        '.wrong-gif-wrapper',
        {
          scale: [0, 2.5],
          opacity: [0, 1, 0],
          translateY: [0, -120],
        },
        {
          duration: 1800,
          easing: 'out-quad',
          onComplete: () => {
            wrongEffects.value = []
          },
        },
      )
    })
  }
}

const nextQuestion = () => {
  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++
    timeLeft.value = 10
    showExplanation.value = false
    startTimer()
    isUserCorrect.value = false
  } else {
    // --- 🌟 10 題全部答完了，觸發獨立結算視窗！ ---
    
    // 💡 註解或刪除原本的 if (timer) clearInterval(timer)，改用 try-catch 包裹
    try {
      // 如果你的計時器變數叫其他名字，可以在這裡安全地清除它，就算失敗也不會卡死程式
      if (typeof timer !== 'undefined') {
        clearInterval(timer)
      }
    } catch (e) {
      console.log('計時器清除跳過')
    }

    // 🎯 核心：強制直接打開獨立結算視窗！
    isResultOpen.value = true 
  }
}

// 💡 點擊「再次挑戰」時由主頁面執行的重置方法
const handleRetry = () => {
  isResultOpen.value = false
  currentQuestionIndex.value = 0
  userScore.value = 0
  timeLeft.value = 10
  showExplanation.value = false
  startTimer()
}

// 💡 點擊「繼續探索」時返回選單
const handleContinue = () => {
  router.push({ name: 'client-levelselect' })
}

const handleNextLevel = () => {
  // 假設你的第二關路由名稱叫 LevelSelect2 或 Level2，請對齊你的 router 設定
  router.push({ name: 'client-levelselect-2' }) 
}

onMounted(() => {
  runStartCountdown()
})

onUnmounted(() => {
  clearInterval(timerInterval.value)
})

const togglePause = () => {
  isPaused.value = !isPaused.value
}

const restartLevel = () => {
  playSFX('click')

  // 1. 【核心修正】徹底清除「答題計時器」與「開場倒數計時器」，防止多重計時器並存導致時間錯亂
  if (timerInterval.value) clearInterval(timerInterval.value)
  if (countdownInterval.value) clearInterval(countdownInterval.value)

  // 2. 【核心修正】強行暫停倒數音效（避免舊局的 3-2-1 音效殘留與新局重疊）
  if (typeof pauseCountdown === 'function') {
    pauseCountdown()
  }

  // 3. 重置所有遊戲響應式變數回到開局狀態
  gameStarted.value = false
  startCountdown.value = 3 // 重新變回開場倒數 3 秒
  currentQuestionIndex.value = 0
  timeLeft.value = 10
  showExplanation.value = false
  userScore.value = 0
  isUserCorrect.value = false
  stars.value = []
  wrongEffects.value = []

  // 4. 關閉暫停視窗
  isPaused.value = false

  // 5. 重要：重新啟動開場 3、2、1 的倒數邏輯（這裡會重新觸發乾淨的倒數音效）
  runStartCountdown()

  // 6. 安全續命：確保 BGM 繼續播放
  if (bgm && bgm.paused && isAudioAuthorized) {
    bgm.play().catch((err) => console.log('BGM 續命受阻:', err))
  }
}

const exitLevel = () => {
  playSFX('click')
  // 1. 清除計時器
  if (timerInterval.value) clearInterval(timerInterval.value)

  // 2. 清空特效資料（避免 Teleport 殘留）
  stars.value = []
  wrongEffects.value = []

  // 3. 執行跳轉
  router.push({ name: 'client-levelselect' })
}
</script>

<template>
  <div class="game-page">
    <button class="pause-btn-trigger" @click="handlePauseToggle">
      <component :is="isPaused ? Play : Pause" :size="32" />
    </button>

    <Teleport to="body">
      <div
        v-for="star in stars"
        :key="star.id"
        class="star-particle-wrapper"
        :style="{ left: star.x + 'px', top: star.y + 'px' }">
        <div class="star-visual">
          <Star fill="#fcc86d" color="#fcc86d" :size="32" />
        </div>
      </div>

      <div
        v-for="effect in wrongEffects"
        :key="effect.id"
        class="wrong-gif-wrapper"
        :style="{ left: effect.x + 'px', top: effect.y + 'px' }">
        <img src="/images/game/dog.gif" :key="effect.id" class="wrong-gif" />
      </div>
    </Teleport>

    <Transition name="modal-wrapper">
      <div v-if="isPaused" class="modal-overlay">
        <div
          class="modal-backdrop"
          @click="
            playSFX('click');
            togglePause()
          "></div>

        <div class="modal-content pause-modal">
          <h2 class="modal-title">遊戲暫停</h2>
          <div class="modal-body">
            <p class="pause-info">休息一下吧！準備好再繼續挑戰。</p>
            <div class="pause-options">
              <button
                class="menu-opt continue"
                @click="
                  playSFX('click');
                  togglePause()
                ">
                <Play :size="20" fill="currentColor" />
                繼續遊戲
              </button>
              <button
                class="menu-opt restart"
                @click="
                  playSFX('click');
                  restartLevel()
                ">
                <RotateCcw :size="20" />
                重新開始
              </button>
              <button
                class="menu-opt exit"
                @click="
                  playSFX('click');
                  exitLevel()
                ">
                <LogOut :size="20" />
                退出關卡
              </button>
            </div>
          </div>
          <div class="modal-footer">
            <div class="audio-settings">
              <div class="volume-control">
                <span class="label">背景音樂</span>
                <input
                  type="range"
                  v-model="bgmSlider"
                  min="0"
                  max="100"
                  class="volume-input-range"
                  :style="{ '--value': bgmSlider + '%' }" />
                <span class="val-num">{{ Math.round(bgmSlider) }}%</span>
              </div>

              <div class="volume-control">
                <span class="label">遊戲音效</span>
                <input
                  type="range"
                  v-model="sfxSlider"
                  min="0"
                  max="100"
                  class="volume-input-range"
                  :style="{ '--value': sfxSlider + '%' }" />
                <span class="val-num">{{ Math.round(sfxSlider) }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <div v-if="!gameStarted" class="overlay">
      <div class="countdown-number">{{ startCountdown }}</div>
      <p v-if="isPaused" class="pause-text">遊戲暫停中</p>
    </div>

    <div v-if="gameStarted" class="game-container">
      <div class="game-header">
        <h2 class="question-title">第 {{ currentQuestionIndex + 1 }} 題</h2>
        <div class="timer-bar">
          <div class="timer-progress" :style="{ width: (timeLeft / 10) * 100 + '%' }"></div>
          <span class="timer-text">{{ timeLeft }}s</span>
        </div>
      </div>

      <div class="main-card">
        <div class="question-body">
          <p>{{ currentQuestion.text }}</p>
        </div>

        <div v-if="!showExplanation" class="action-buttons">
          <button class="answer-btn circle-btn" @click="handleAnswer(true, $event)">
            <Circle :size="70" stroke-width="4" />
          </button>

          <button class="answer-btn cross-btn" @click="handleAnswer(false, $event)">
            <X :size="80" stroke-width="4" />
          </button>
        </div>

        <div v-else class="explanation-box" :class="isUserCorrect ? 'bg-correct' : 'bg-wrong'">
          <div class="result-label">
            {{ isUserCorrect ? '回答正確！' : '回答錯誤...' }}
          </div>
          <p class="explanation-text">{{ currentQuestion.explanation }}</p>
          <button
            class="next-btn"
            @click="
              playSFX('click');
              nextQuestion()
            ">
            下一題
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  </div>
  <LevelResultModal 
      :isOpen="isResultOpen" 
      :score="userScore" 
      @retry="handleRetry"
      @continue="handleContinue"
      @nextLevel="handleNextLevel"
    />
</template>

<style scoped>
.pause-btn-trigger {
  position: fixed;
  top: 20px;
  left: 20px;
  width: 60px;
  height: 60px;
  background: #fcf4e5;
  border: 4px solid #453a27;
  border-radius: 15px;
  color: #453a27;
  cursor: pointer;
  box-shadow: 0 4px 0 #453a27;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.pause-btn-trigger:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 0 #453a27;
  background: #fcc86d;
}
.pause-btn-trigger:active {
  transform: translateY(2px);
  box-shadow: 0 2px 0 #453a27;
  transition: all 0.05s;
}
/* Modal 遮罩層 */
.modal-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}
.modal-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(69, 58, 39, 0.7);
  backdrop-filter: blur(6px);
  z-index: -1;
}
/* 2. 定義動畫組合 (Wrapper) */
/* 進入動畫 */
.modal-wrapper-enter-active {
  transition: all 0.4s ease;
}
/* 離開動畫 */
.modal-wrapper-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 3. 具體元素的過渡狀態 */
/* 遮罩的淡入淡出 */
.modal-wrapper-enter-from .modal-backdrop,
.modal-wrapper-leave-to .modal-backdrop {
  opacity: 0;
}

/* Modal 內容的縮放與浮現 */
.modal-wrapper-enter-from .pause-modal,
.modal-wrapper-leave-to .pause-modal {
  opacity: 0;
  transform: scale(0.85) translateY(30px);
}

/* Modal 本體 */
.pause-modal {
  width: 90%;
  max-width: 400px;
  background: #fcf4e5;
  border: 6px solid #453a27;
  border-radius: 40px;
  padding: 30px;
  box-shadow: 0 12px 0 #453a27;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-title {
  font-size: 2rem;
  font-weight: 900;
  color: #fcf4e5;
  background: #453a27;
  display: inline-block;
  padding: 8px 30px;
  border-radius: 20px;
  margin-top: -50px; /* 向上偏移營造層次感 */
  margin-bottom: 20px;
}

.pause-info {
  color: #453a27;
  font-weight: 600;
  margin-bottom: 25px;
}

/* 選項按鈕列表 */
.pause-options {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.menu-opt {
  padding: 15px;
  border: 4px solid #453a27;
  border-radius: 20px;
  font-size: 1.2rem;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.1s ease; /* 縮短時間讓回饋感更靈敏 */
  background: #fff;
  color: #453a27;
  box-shadow: 0 6px 0 #453a27; /* 預設陰影厚度 */
}

.menu-opt:hover {
  transform: translateY(-3px);
  box-shadow: 0 9px 0 #453a27;
}
.menu-opt:active {
  transform: translateY(4px); /* 向下位移 */
  box-shadow: 0 2px 0 #453a27; /* 陰影變短，模擬壓下去的視覺 */
  transition: all 0.05s; /* 極速回饋 */
}

.menu-opt.continue {
  background: #fcc86d;
}
.menu-opt.exit {
  background: #e8a8a8;
}
.menu-opt.restart {
  background: #fff;
}

/* 音量條樣式 (參考 Audio 截圖) */
.audio-settings {
  width: 100%;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #453a27;
  font-weight: 800;
}

.volume-control .label {
  width: 80px; /* 固定寬度讓滑桿對齊 */
  text-align: left;
  font-size: 1rem;
}

.volume-control .val-num {
  width: 45px;
  font-size: 0.9rem;
  text-align: right;
}

.volume-slider {
  flex: 1;
  accent-color: #453a27;
  cursor: pointer;
  height: 8px;
  border-radius: 4px;
}

/* --- 調整關卡頁面的滑桿外觀，與主選單完全同步 --- */
.volume-input-range {
  flex: 1;
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 14px; /* 與 MainMenu 一致的厚度 */
  border-radius: 10px;
  /* 關鍵修正：運用傳進來的 --value 變數，動態切割「深咖啡色」與「偏白灰米色」 */
  background: linear-gradient(
    to right,
    #453a27 0%,
    #453a27 var(--value),
    #e5dfd5 var(--value),
    #e5dfd5 100%
  );
  outline: none;
}

/* Chrome / Safari / Edge 的圓鈕樣式 */
.volume-input-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 24px; /* 與 MainMenu 一致的尺寸 */
  height: 24px;
  border-radius: 50%;
  background: #453a27; /* 招牌深咖啡色 */
  cursor: pointer;
  border: 2px solid #fcf4e5; /* 奶油米色細邊框 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Firefox 的圓鈕樣式 */
.volume-input-range::-moz-range-thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #453a27;
  cursor: pointer;
  border: 2px solid #fcf4e5;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* 過渡動畫 */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition:
    opacity 0.3s,
    transform 0.3s;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.game-page {
  width: 100vw;
  height: 100vh;
  background: #fcf4e5; /* 沿用 Morandi 米色 */
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 控制按鈕 */
.control-btn {
  position: absolute;
  top: 30px;
  left: 30px;
  z-index: 1000;
  background: #fcf4e5;
  border: 4px solid #453a27;
  border-radius: 15px;
  padding: 10px;
  cursor: pointer;
  color: #453a27;
  box-shadow: 0 4px 0 #453a27;
}

/* 倒數與暫停遮罩 */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(69, 58, 39, 0.85);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 500;
  color: #fcf4e5;
}

.countdown-number {
  font-size: 15rem;
  font-weight: 900;
  text-shadow: 0 10px 0 #453a27;
}

/* 遊戲主容器 */
.game-container {
  /* 寬度從 95vw 下修，讓高度不會撐太長 */
  width: 85vw;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;

  /* 關鍵：透過負的 margin-top 將整個容器往上拉，並增加底部間距 */
  margin-top: -50px;
  gap: 20px;
  position: relative;
}
.game-header {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px; /* 縮小題號與計時條的間距 */
}
.question-title {
  font-size: 3rem; /* 從 3.5rem 微調到 3rem */
  font-weight: 900;
  color: #453a27;
  margin: 0;
}
.timer-bar {
  width: 100%;
  height: 32px;
  background: #e0d7c6;
  border: 5px solid #453a27;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
}

.timer-progress {
  height: 100%;
  background: #fcc86d;
  transition: width 0.1s linear;
}

.timer-text {
  font-size: 1.6rem;
  font-weight: 900;
  color: #453a27;
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
}

/* 大矩形卡片 */
.main-card {
  width: 100%;
  background: #fcf4e5;
  border: 8px solid #453a27;
  border-radius: 60px;

  /* 減少上下內距，讓內容上移 */
  padding: 60px 50px;
  min-height: 500px; /* 從 600px 下修，避免頂到螢幕底部 */

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 15px 0 #453a27;
}

.question-body {
  width: 100%;
  max-width: 1000px; /* 限制文字最大寬度，避免在超寬螢幕上一行太長難閱讀 */
  font-size: 3.5rem;
  font-weight: 800;
  color: #453a27;
  text-align: center;
  line-height: 1.6; /* 增加行高讓文字更舒適 */
}
.question-body p {
  font-size: 2.8rem; /* 從 3.5rem 下修 */
  line-height: 1.4;
  margin-bottom: 30px;
}

/* 圈叉按鈕 */
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 60px;
  margin-top: 30px; /* 縮小按鈕與題目的間距 */
}

.answer-btn {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  border: 6px solid #453a27;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s;
  background: #fcf4e5;
  color: #453a27;
  box-shadow: 0 8px 0 #453a27;
}
.answer-btn:hover {
  /* 懸停時觸發名為 pulse 的動畫 */
  animation: pulse 1.5s infinite;
  background: #fcc86d; /* 懸停時稍微變色增加互動感 */
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(69, 58, 39, 0.4);
  }
  70% {
    /* 產生一個向外擴散的圓圈 */
    box-shadow: 0 0 0 20px rgba(69, 58, 39, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(69, 58, 39, 0);
  }
}
/* --- 星星噴發特效樣式 --- */
.star-particle-wrapper {
  position: absolute;
  z-index: 9999;
  pointer-events: none;
  /* 讓容器本身居中，這樣 animate 的 x: 0 才會準確在按鈕中間 */
  transform: translate(-50%, -50%) scale(0);
  display: flex;
  align-items: center;
  justify-content: center;
}

.star-visual {
  /* 使用金色與白色的強烈發光，營造圖片中的亮點感 */
  filter: drop-shadow(0 0 15px #fcc86d) drop-shadow(0 0 30px rgba(255, 255, 255, 0.8));
}

.wrong-gif-wrapper {
  position: absolute;
  z-index: 9999;
  pointer-events: none;
  transform: translate(-50%, -50%) scale(0);
}
.wrong-gif {
  width: 300px; /* 狗狗大一點比較有張力 */
  height: auto;
  filter: drop-shadow(0 0 20px rgba(155, 89, 182, 0.5));
}
/* 脈衝效果 (保留並優化) */
.answer-btn:hover {
  animation: pulse 1.5s infinite;
  background: #fcc86d;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(252, 200, 109, 0.7);
  }
  70% {
    box-shadow: 0 0 0 25px rgba(252, 200, 109, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(252, 200, 109, 0);
  }
}

.circle-btn:hover {
  background: #a8d5ba;
  transform: translateY(-5px);
}
.cross-btn:hover {
  background: #f2a6a6;
  transform: translateY(-5px);
}
.answer-btn:active {
  transform: translateY(4px);
  box-shadow: 0 2px 0 #453a27;
}

/* 詳細解答區塊基礎樣式 */
.explanation-box {
  margin-top: 40px; /* 關鍵：增加與上方題目文字的間隙 */
  padding: 30px;
  border-radius: 25px;
  border: 4px solid #453a27;
  animation: slideUp 0.4s ease-out;
  transition: background-color 0.3s ease;
  box-shadow: inset 0 4px 0 rgba(0, 0, 0, 0.05);
}

/* 答對時的綠色 (莫蘭迪綠) */
.bg-correct {
  background-color: #a8d5ba !important;
}

/* 答錯或超時的紅色 (莫蘭迪紅) */
.bg-wrong {
  background-color: #f2a6a6 !important;
}

.result-label {
  font-size: 1.8rem;
  font-weight: 900;
  color: #453a27;
  margin-bottom: 10px;
}

.explanation-text {
  font-size: 1.4rem; /* 從 1.25rem 增加到 1.4rem */
  font-weight: 700;
  color: #453a27;
  line-height: 1.6;
  margin-bottom: 15px;
}

/* 下一題的按鈕 */
.next-btn {
  margin-top: 20px;
  padding: 12px 40px;
  background: #fcf4e5; /* 改為米色底 */
  color: #453a27; /* 咖啡色文字 */
  border: 4px solid #453a27;
  border-radius: 15px;
  font-weight: 900;
  cursor: pointer;
  float: right;
  display: flex;
  align-items: center;
  gap: 8px;

  /* 使用深咖啡色陰影，增加厚度感 */
  box-shadow: 0 6px 0 #453a27;
  transition: all 0.1s ease;
}

.next-btn:hover {
  background: #fcc86d; /* 懸停時變為亮黃色，與暫停按鈕一致 */
  transform: translateY(-3px);
  box-shadow: 0 9px 0 #453a27;
}

.next-btn:active {
  transform: translateY(4px);
  box-shadow: 0 2px 0 #453a27;
  transition: all 0.05s;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
<style>
html,
body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden !important; /* 強制鎖死，不讓特效撐開 */
  position: fixed; /* 雙重保險：讓 body 固定住 */
}

/* 確保遊戲容器撐滿，不留白 */
#app {
  width: 100%;
  height: 100%;
}
</style>
