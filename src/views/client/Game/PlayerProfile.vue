<script setup>
import { ref, onMounted } from 'vue'
import { LucideCat, Save } from 'lucide-vue-next'
import 'animate.css';
import { useGameAudio } from '@/composables/useGameAudio'

const { playSFX } = useGameAudio()

const emit = defineEmits(['close']);
const isVisible = ref(false);
onMounted(() => {
  isVisible.value = true;
});
// JavaScript 離開動畫
const onLeave = (el, done) => {
  const animation = el.animate([
    { transform: 'scale(1) translateY(0)', opacity: 1, filter: 'blur(0px)' },
    { transform: 'scale(1.05) translateY(-70px)', opacity: 1, offset: 0.35 },
    { transform: 'scale(0.4) translateY(400px)', opacity: 0, filter: 'blur(10px)', offset: 1 }
  ], {
    duration: 800,
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    fill: 'forwards'
  });

  animation.onfinish = done;
};
// 內部控制
const startClose = (type) => {
  // 發送事件讓父組件知道現在是什麼類型的退出
  emit('close', type); 

  if (type === 'save') {
    // 儲存：延遲一下再讓卡片彈走，給大圖示留表演時間
    setTimeout(() => {
      isVisible.value = false; 
    }, 1200);
  } else {
    // 普通退出：立刻讓卡片彈走
    isVisible.value = false;
  }
};
</script>

<template>
  <div class="modal-overlay " @click.self="startClose('default')">
    <Transition 
      appear
      enter-active-class="animate__animated animate__bounceIn"
      @leave="onLeave"
      :css="true"
    >
    <div v-if="isVisible" class="profile-card">
      <div class="card-decorations">
        <div class="line horizontal top"></div>
        <div class="line horizontal bottom"></div>
        <div class="circle top-left"></div>
        <div class="circle top-right"></div>
        <div class="circle bottom-left"></div>
        <div class="circle bottom-right"></div>
      </div>

      <div class="card-header-internal">
        <div class="top-tag-internal">
          <span class="tag-decorator"><LucideCat /></span>
          <span class="tag-title">玩家檔案</span>
          <span class="tag-decorator"><LucideCat /></span>
        </div>
      </div>

      <div class="header-meta">
        <p>建立時間: 2026/05/11</p>
        <p>ID: 719007</p>
      </div>

      <div class="card-content">
        <div class="photo-section">
          <div class="photo-frame">
            <div class="avatar-placeholder">
              <img src="https://via.placeholder.com/150" alt="Avatar" />
            </div>
            <div class="corner-tape top-left"></div>
            <div class="corner-tape bottom-right"></div>
          </div>
          <div class="rank-badge">現有點數：1,234 點</div>
        </div>

        <div class="info-section">
          <h2 class="player-name">DevUser_01</h2>
          
          <div class="stats-container">
            <div class="stat-row">
              <span class="label">持有造型數量：</span>
              <span class="value">12 件</span>
            </div>
            <div class="stat-row">
              <span class="label">最新遊玩進度：</span>
              <span class="value">第一章：初遇寵物</span>
            </div>
            <div class="stat-row">
              <span class="label">最後遊玩時間：</span>
              <span class="value">2026/05/11 14:30</span>
            </div>
          </div>

          <div class="decoration-dots">
            <span v-for="i in 8" :key="i" class="dot">✦</span>
          </div>
        </div>
      </div>

      <button class="sticky-save-btn" @click="playSFX('click'); startClose('save')">
          <Save />儲存並返回
        </button>
    </div>
    </Transition>
  </div>
</template>

<style scoped>
/* modal相關 */
.modal-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(45, 38, 27, 0.4);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

/* 玩家檔案主體：圓角與背景 */
.profile-card {
  --animate-duration: 0.8s;
  background-color: #FCF4E5;
  width: 1050px;
  min-height: 620px;
  padding: 80px 60px;
  border: 1px solid rgba(69, 58, 39, 0.3);
  border-radius: 25px; /* 圓角頁面 */
  position: relative;
  color: #453A27;
  box-shadow: 0 40px 80px rgba(0,0,0,0.4);
}

/* 半透明線條裝飾層 */
.card-decorations .line {
  position: absolute;
  left: 30px;
  right: 30px;
  height: 1px;
  background: rgba(69, 58, 39, 0.15); /* 半透明橫線 */
}
.line.top { top: 40px; }
.line.bottom { bottom: 40px; }

.card-decorations .circle {
  position: absolute;
  width: 12px;
  height: 12px;
  border: 2px solid rgba(69, 58, 39, 0.2);
  border-radius: 50%;
}
.top-left { top: 34px; left: 24px; }
.top-right { top: 34px; right: 24px; }
.bottom-left { bottom: 34px; left: 24px; }
.bottom-right { bottom: 34px; right: 24px; }

/* 內部標籤 */
.card-header-internal {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.top-tag-internal {
  background-color: #453A27;
  color: #FCF4E5;
  padding: 10px 80px;
  border-radius: 0 0 30px 30px; /* 下圓角 */
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: -85px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  justify-content: center;
}

.tag-title {
  font-size: 2rem;
  letter-spacing: 4px;
  font-weight: bold;
}

.tag-decorator {
  display: inline-flex; 
  align-items: center;
  justify-content: center;
  margin: 0 5px; 
}

.tag-decorator :deep(svg) {
  width: 32px;  
  height: 32px; 
  stroke: #FCF4E5;
  stroke-width: 2.5px;
  
  /* 應用動畫：持續 3 秒，平滑循環 */
  animation: cat-breath 3s ease-in-out infinite;
  animation: cat-wiggle 3s ease-in-out infinite;
  
  /* 為了讓縮放從中心開始，設定基準點 */
  transform-origin: center;
}

/* 右上角半透明資訊 */
.header-meta {
  position: absolute;
  top: 50px;
  right: 60px;
  text-align: right;
  font-size: 0.85rem;
  color: rgba(69, 58, 39, 0.5); /* 半透明文字 */
  line-height: 1.6;
}

.card-content {
  display: flex;
  margin-top: 40px;
  gap: 60px;
  position: relative;
  z-index: 2;
}

/* 照片區塊 */
.photo-frame {
  width: 280px;
  height: 320px;
  background: #fff;
  border: 1px solid #e0e0e0;
  padding: 12px;
  position: relative;
  box-shadow: 5px 5px 15px rgba(0,0,0,0.05);
}

.avatar-placeholder img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 照片角落膠帶感裝飾 */
.corner-tape {
  position: absolute;
  width: 40px;
  height: 15px;
  background: rgba(252, 200, 109, 0.4);
}
.corner-tape.top-left { top: -5px; left: -15px; transform: rotate(-45deg); }
.corner-tape.bottom-right { bottom: -5px; right: -15px; transform: rotate(-45deg); }

.rank-badge {
  margin-top: 25px;
  background: #453A27;
  color: white;
  padding: 6px 0;
  border-radius: 20px;
  font-size: 0.9rem;
  text-align: center;
}

/* 右側文字資訊 */
.player-name {
  font-size: 3.2rem;
  margin-bottom: 35px;
  font-weight: 900;
}

.stats-container {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.stat-row {
  font-size: 1.4rem;
  border-bottom: 1px dashed rgba(69, 58, 39, 0.1);
  padding-bottom: 10px;
}

.label {
  color: rgba(69, 58, 39, 0.6);
  margin-right: 15px;
}

.decoration-dots {
  margin-top: 30px;
  color: #fcc86d;
  letter-spacing: 8px;
}

/* 儲存按鈕：圓角、一半在外 */
.sticky-save-btn {
  position: absolute;
  bottom: -25px;
  right: 60px;
  background-color: #453A27;
  color: #FCF4E5;
  border: 4px solid #FCF4E5; /* 增加粗邊框與背景切齊 */
  padding: 12px 40px;
  font-size: 1.1rem;
  font-weight: bold;
  border-radius: 50px; /* 橢圓長條圓角 */
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  display: flex;
  align-items: center;    /* 垂直置中 */
  justify-content: center; /* 水平置中 */
  gap: 10px;              /* 圖示與文字間的距離 */
  z-index: 5;
}

.sticky-save-btn :deep(svg) {
  display: block;
  stroke-width: 2.5px; /* 讓 Lucide 圖示線條跟文字粗細更接近 */
    /* 新增：圖示本身的放大與動畫 transition */
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-origin: center;
}

.sticky-save-btn:hover {
  background-color: #fcc86d;
  color: #453A27;
  transform: translateY(-3px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.3);
}

.sticky-save-btn:hover :deep(svg) {
  /* 1. 圖示放大一些，比貓咪更明顯，更有強調感 */
  transform: scale(1.3); 
  
  /* 2. 套用持續晃動動畫，比貓咪的搖晃速度稍快，增加張力 */
  animation: save-wiggle 1.5s ease-in-out infinite;
  animation-delay: 0.1s; /* 在放大完成後稍稍延遲一點點開始，更有層次 */
}

@keyframes cat-breath {
  0%, 100% {
    transform: scale(1);
    opacity: 0.9;
  }
  50% {
    transform: scale(1.15); /* 稍微放大 */
    opacity: 1;
  }
}

@keyframes cat-wiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-10deg); }
  75% { transform: rotate(10deg); }
}

@keyframes save-wiggle {
  0%, 100% { transform: scale(1.3) rotate(0deg); } /* 維持在放大狀態 */
  25% { transform: scale(1.3) rotate(-15deg); }    /* 搖晃幅度稍大 */
  75% { transform: scale(1.3) rotate(15deg); }
}

@keyframes save-pop {
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.2); opacity: 1; }
  70% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.2); opacity: 0; } /* 最後微微放大並消失 */
}
</style>