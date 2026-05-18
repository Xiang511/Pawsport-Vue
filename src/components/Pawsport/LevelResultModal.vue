<script setup>
import { computed, watch, nextTick } from 'vue'
import {animate} from 'animejs' // 💡 使用安全的路徑引入包

// 接收外部傳進來的參數
const props = defineProps({
  isOpen: { type: Boolean, default: false }, // 控制彈窗開關
  score: { type: Number, default: 0 }        // 玩家答對的題數 (0 ~ 10)
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

// 🔓 4. 當過關時，自動幫玩家寫入 localStorage 解鎖第二關 progress
// 💡 修改後的儲存與解鎖核心邏輯
const saveProgressAndUnlock = () => {
  try {
    // 1. 讀取舊進度
    const progress = JSON.parse(localStorage.getItem('game_progress') || '{}')
    
    // 2. 👑 無論輸贏，都紀錄當前關卡（關卡 1）獲得的最高星星數！
    // 加上 Math.max 可以確保如果玩家之前考過高分，不會不小心被低分蓋掉
    const oldStars = progress['level_1']?.stars || 0
    progress['level_1'] = {
      stars: Math.max(oldStars, stars.value) // 🌟 存入算好的一顆星、兩顆星或三顆星
    }
    
    // 3. 🔑 只有當真正勝利時，才去開啟第二關的綠燈進度
    if (isVictory.value) {
      progress['level_2_unlocked'] = true
    }

    // 4. 存回瀏覽器
    localStorage.setItem('game_progress', JSON.stringify(progress))
    console.log("進度動態儲存成功：", progress)
  } catch (e) {
    console.error("進度儲存失敗:", e)
  }
}

// 🎬 5. 監聽彈窗打開時，播放動畫與處理進度
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
      saveProgressAndUnlock()
    // 星星蹦跳特效
    nextTick(() => {
      try {
        animate({
          targets: '.result-star-icon.is-active',
          scale: [0, 1.4, 1],
          rotate: '1turn',
          delay: animate.stagger(250), // 精緻的依序延遲發射
          duration: 800,
          easing: 'outElastic(1, .6)'
        })
      } catch (err) {
        console.warn("星星動畫播放受阻:", err)
      }
    })
  }
})
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