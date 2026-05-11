<script setup>
import { LucideCat, Save } from 'lucide-vue-next'
const emit = defineEmits(['close']);
</script>

<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="profile-card">
      
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

      <button class="sticky-save-btn" @click="$emit('close')">
        <Save />儲存並返回
      </button>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

/* 玩家檔案主體：圓角與背景 */
.profile-card {
  background-color: #FCF4E5;
  width: 850px;
  min-height: 500px;
  padding: 60px 50px;
  border: 1px solid rgba(69, 58, 39, 0.3);
  border-radius: 20px; /* 圓角頁面 */
  position: relative;
  color: #453A27;
  box-shadow: 0 30px 60px rgba(0,0,0,0.4);
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
  padding: 8px 60px;
  border-radius: 0 0 15px 15px; /* 下圓角 */
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: -62px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.tag-title {
  font-size: 1.3rem;
  letter-spacing: 4px;
  font-weight: bold;
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
  width: 220px;
  height: 250px;
  background: #fff;
  border: 1px solid #e0e0e0;
  padding: 10px;
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
  font-size: 2.8rem;
  margin-bottom: 25px;
  font-weight: 900;
}

.stats-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stat-row {
  font-size: 1.2rem;
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
}

.sticky-save-btn :deep(svg) {
  display: block;
  stroke-width: 2.5px; /* 讓 Lucide 圖示線條跟文字粗細更接近 */
}

.sticky-save-btn:hover {
  background-color: #fcc86d;
  color: #453A27;
  transform: translateY(-5px) scale(1.05);
}
</style>