<script setup>
import { computed, watch, nextTick } from 'vue'
import {animate} from 'animejs'
import axios from 'axios'

// 接收外部傳進來的參數
const props = defineProps({
  isOpen: { type: Boolean, default: false }, 
  score: { type: Number, default: 0 },
  // 新增：接收目前是第幾關的 ID (預設為 1)
  levelId: { type: Number, default: 1 } 
})

// 定義事件，用來通知父分頁「再試一次」或「離開」
defineEmits(['retry', 'continue', 'nextLevel'])

// 🌟 1. 星星規則計算
const stars = computed(() => {
  const currentScore = props.score
  if (currentScore === 10) return 3
  if (currentScore >= 6) return 2
  if (currentScore >= 1) return 1
  return 0
})

// 🌟 2. 獎勵點數計算：全對才給 10 點
const bonusPoints = computed(() => {
  return props.score === 10 ? 10 : 0
})

// 🌟 3. 勝敗判定：達到 6 題即勝利
const isVictory = computed(() => {
  return props.score >= 6
})

// 🚀 核心優化：當結算視窗打開時，自動發送結果給後端 API 儲存
watch(
  () => props.isOpen,
  async (newVal) => {
    if (newVal === true) {
      // 🎯 執行後端聯網儲存與解鎖
      try {
        const submitData = {
          PlayerId: 1,                // 統一使用測試帳號 PlayerId = 1
          GameId: props.levelId,       // 目前關卡 ID
          IsVictory: isVictory.value,  // 是否通過 (score >= 6)
          BonusPoints: bonusPoints.value // 答對 10 題給 10 點，其餘 0 點
        }

        console.log('🚀 [API 傳送] 正在同步關卡進度至後端...', submitData)

        const res = await axios.post('https://localhost:7048/api/Player/save-game-result', submitData)
        
        if (res.data && res.data.success) {
          console.log('🎉 [API 成功] 後端已成功記錄進度，資料庫與點數已更新！')
        }
        
      } catch (error) {
        console.error('❌ [API 失敗] 傳送遊戲結果失敗，後端服務可能未啟動或報錯：', error)
      }

      // 💾 離線本地防線（保留作為備用）
      saveProgressAndUnlockLocalStorage()

      // 🎬 播放彈窗動畫
      await nextTick()
      playModalAnimations()
    }
  }
)

// 修改後的儲存與解鎖核心邏輯
const saveProgressAndUnlockLocalStorage = () => {
  const progress = JSON.parse(localStorage.getItem('game_progress') || '{}')
  const currentLevelKey = `level_${props.levelId}`
  
  // 更新當前關卡最高星星
  const oldStars = progress[currentLevelKey]?.stars || 0
  if (stars.value > oldStars) {
    progress[currentLevelKey] = {
      Score: props.score,
      Stars: stars.value,
      Cleared: isVictory.value
    }
  }
  
  // 滿足勝利條件，解鎖下一關的本地防線
  if (isVictory.value) {
    progress[`level_${props.levelId + 1}_unlocked`] = true
  }
  
  localStorage.setItem('game_progress', JSON.stringify(progress))
}

// 🎬 結算彈窗 Anime.js 動畫控制
const playModalAnimations = () => {
  animate('.result-modal-overlay', {
    opacity: [0, 1],
    duration: 300,
    easing: 'linear'
  })

  animate('.result-modal-content', {
    Scale: [0.4, 1],
    Opacity: [0, 1],
    Duration: 500,
    Easing: 'easeOutBack'
  })

  // 星星依序彈出
  animate('.result-star-icon', {
    Scale: [0, 1.3, 1],
    Rotate: [0, 15, 0],
    Delay: (el, i) => 400 + i * 200,
    Duration: 600,
    Easing: 'easeOutBack'
  })

  // 數據面板由下往上滑入
  animate('.result-stats', {
    TranslateY: [40, 0],
    Opacity: [0, 1],
    Delay: 1000,
    Duration: 500,
    Easing: 'easeOutQuad'
  })

  // 按鈕淡入
  animate('.result-footer', {
    Opacity: [0, 1],
    Delay: 1300,
    Duration: 400,
    Easing: 'linear'
  })
}

</script>

<template>
  <Transition name="modal-wrapper">
    <div v-if="isOpen" class="modal-overlay result-overlay">
      <div class="result-modal-content">
        
        <div class="result-header">
          <h1 class="victory-title" :class="{ 'fail-title': !isVictory }">
            {{ isVictory ? 'VICTORY' : 'FAILED' }}
          </h1>
          <p class="user-name">Oka</p>
        </div>

        <div class="result-body">
          <div class="character-preview">
            <!-- <img src="/images/avatar/cat_calico.png" class="result-avatar" alt="avatar" /> -->
            <div class="character-name-badge">Oka</div>
          </div>

          <div class="stars-row">
            <div v-for="i in 3" :key="i" class="star-container">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                stroke-width="2.5" 
                class="result-star-icon"
                :class="{ 'is-active': i <= stars }"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
          </div>
        </div>

        <div class="result-stats">
          <div class="stat-line">
            <span class="stat-label">答題正確</span>
            <span class="stat-value">{{ score }} / 10</span>
          </div>
          <div class="stat-line">
            <span class="stat-label">獲得獎勵</span>
            <span class="stat-value points-val">🪙 {{ bonusPoints }}</span>
          </div>
        </div>

        <div class="result-footer">
          <template v-if="isVictory">
            <button class="footer-btn continue-btn" @click="$emit('nextLevel')">
              前往下一關 <span class="arrow">›</span>
            </button>
            <button class="footer-btn back-btn" @click="$emit('continue')">
              回關卡選擇
            </button>
          </template>

          <template v-else>
            <button class="footer-btn retry-btn" @click="$emit('retry')">
              重新開始
            </button>
            <button class="footer-btn back-btn" @click="$emit('continue')">
              回關卡選擇
            </button>
          </template>
        </div>

      </div>
    </div>
  </Transition>
</template>



<style scoped>
/* ===================================================
   🏆 結算組件專屬樣式（徹底與主要關卡頁面隔離）
   =================================================== */
.modal-overlay.result-overlay {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  background: rgba(252, 244, 229, 0.96) !important; /* 你的招牌 Morandi 溫暖奶油色 */
  backdrop-filter: blur(12px) !important;
  z-index: 999999 !important; /* 絕對無敵的最上層 */
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
}

.result-modal-content {
  width: 100%;
  max-width: 650px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.victory-title {
  font-size: 5.5rem;
  font-weight: 900;
  color: #453a27;
  letter-spacing: 6px;
  margin: 0;
  text-shadow: 0 8px 0 rgba(0,0,0,0.05);
}

.fail-title {
  color: #d96666;
}

.user-name {
  font-size: 1.3rem;
  font-weight: 800;
  color: #7a6e5d;
  margin: -5px 0 0 0;
}

.result-body {
  margin: 20px 0;
  position: relative;
}

.result-avatar {
  width: 180px;
  height: auto;
  filter: drop-shadow(0 15px 20px rgba(69, 58, 39, 0.15));
}

.character-name-badge {
  background: #453a27;
  color: white;
  padding: 4px 18px;
  border-radius: 10px;
  font-weight: bold;
  display: inline-block;
  margin-top: -15px;
  position: relative;
  font-size: 0.9rem;
}

/* ⭐ SVG 星星美化 */
.stars-row {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

.star-container {
  width: 70px;
  height: 70px;
}

.result-star-icon {
  width: 100%;
  height: 100%;
  fill: none;
  stroke: #e5dfd5; /* 未獲得星星的灰邊 */
  transition: all 0.3s ease;
}

.result-star-icon.is-active {
  fill: #fcc86d;  /* 你的招牌鵝黃色 */
  stroke: #453a27; /* 經典粗邊框 */
}

/* 📊 數據面板 */
.result-stats {
  background: #ffffff;
  border: 4px solid #453a27;
  border-radius: 24px;
  padding: 15px 40px;
  width: 380px;
  box-shadow: 0 8px 0 #453a27;
  margin-bottom: 35px;
}

.stat-line {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 1.25rem;
  font-weight: 800;
  color: #453a27;
}

.stat-line:first-child {
  border-bottom: 2px dashed #ecdcb9;
}

.points-val {
  color: #e4987e; /* 主橘色 */
}

/* 🔙 按鈕控制 */
.result-footer {
  display: flex;
  gap: 15px;
}

.footer-btn {
  padding: 12px 35px;
  font-size: 1.2rem;
  font-weight: 900;
  border: 4px solid #453a27;
  border-radius: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  box-shadow: 0 6px 0 #453a27;
}

.continue-btn {
  background: #fcc86d;
  color: #453a27;
}

.retry-btn {
  background: #ffffff;
  color: #453a27;
}

.footer-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 9px 0 #453a27;
}

.footer-btn:active {
  transform: translateY(3px);
  box-shadow: 0 2px 0 #453a27;
}

.arrow {
  font-size: 1.6rem;
  line-height: 1;
}

/* 動態淡入 */
.modal-wrapper-enter-active, .modal-wrapper-leave-active {
  transition: opacity 0.4s ease;
}
.modal-wrapper-enter-from, .modal-wrapper-leave-to {
  opacity: 0;
}
</style>