<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'
import { PawPrint } from 'lucide-vue-next'
import PlayerProfile from './PlayerProfile.vue';

const isProfileOpen = ref(false);
const toggleProfile = () => {
  isProfileOpen.value = !isProfileOpen.value;
};

const router = useRouter()
const exitGame = () => {
  router.push({ name: 'client-gameview' })
}
</script>

<template>
  <div class="main-menu-container">
    <div class="user-profile-trigger" @click="toggleProfile">
      <span class="player-name">玩家名稱：DevUser_01</span>
    </div>
    <PlayerProfile v-if="isProfileOpen" @close="isProfileOpen = false" />

    <div class="menu-side">
      <h2 class="mini-logo">PETMILY</h2>
      <nav class="nav-list">
        <div class="nav-item" @click="exitGame">
          <span class="paw-icon"><PawPrint /></span>
          選擇關卡
        </div>
        <div class="nav-item" @click="exitGame">
          <span class="paw-icon"><PawPrint /></span>
          我的收藏
        </div>
        <div class="nav-item" @click="exitGame">
          <span class="paw-icon"><PawPrint /></span>
          遊戲設定
        </div>
        <div class="nav-item" @click="exitGame">
          <span class="paw-icon"><PawPrint /></span>
          造型商店
        </div>
        <div class="nav-item" @click="exitGame">
          <span class="paw-icon"><PawPrint /></span>
          離開遊戲
        </div>
      </nav>
    </div>

    <div class="character-art">
      <div class="art-placeholder"></div>
    </div>
  </div>
</template>

<style scoped>
.main-menu-container {
  height: 100vh;
  background: #fcf4e5;
  color: #453a27;
  display: flex;
  position: relative;
  padding: 60px 100px;
  user-select: none;
}

.user-profile-trigger {
  position: absolute;
  top: 40px;
  right: 60px;
  
  /* 模仿儲存按鈕的視覺風格 */
  background-color: #453A27;
  color: #FCF4E5;
  padding: 10px 25px;
  border-radius: 50px; /* 大圓角矩形 */
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  
  /* 增加一點點陰影與縮放動畫 */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 10;
  border: 2px solid transparent;
}

.user-profile-trigger:hover {
  background-color: #fcc86d;
  color: #453A27;
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.player-name {
  font-size: 1.1rem;
  font-weight: bold;
  letter-spacing: 1px;
}

.menu-side {
  width: 40%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 2;
}

.mini-logo {
  color: #453a27;
  font-size: 5.5rem;
  font-weight: 900;
  margin-bottom: 30px;
  margin-left: 2rem;
  text-shadow: 2px 2px 0px rgba(252, 200, 109, 0.3);
}

.nav-list {
  display: flex;
  flex-direction: column;
}

.nav-item {
  display: flex;
  align-items: center;
  font-size: 1.8rem;
  margin: 10px 0; /* 稍微增加間距讓背景更明顯 */
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  color: #453a27;
  opacity: 0.9;
  position: relative;
  padding: 10px 25px; /* 增加內邊距，給背景矩形呼吸空間 */
  width: fit-content;  /* 讓背景寬度跟著文字走 */
  z-index: 1;         /* 確保文字在背景之上 */
}

.nav-item::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #453A27;
  border-radius: 15px; /* 圓角矩形 */
  z-index: -1;         /* 放在文字下面 */
  
  /* 初始動畫狀態：縮小並透明 */
  transform: scaleX(0.8);
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.nav-item:hover {
  color: #FCF4E5;      /* 移入時文字變米色，與背景形成對比 */
  transform: translateX(40px) scale(1.1); /* 稍微縮小位移距離，避免視覺太突兀 */
  opacity: 1;
}

.nav-item:hover::before {
  opacity: 1;
  transform: scaleX(1); /* 橫向展開效果 */
}

.nav-item:hover .paw-icon {
  color: #fcc86d;
  opacity: 1;
  transform: scale(1.2) rotate(-10deg);
}

.paw-icon {
  color: #453a27; /* 預設改為咖啡色 */
  margin-right: 15px;
  display: flex;
  align-items: center;
  opacity: 0.6;
  transform: scale(0.8);
  transition: all 0.3s ease-out;
}

.character-art {
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  pointer-events: none;
}

.art-placeholder {
  width: 100%;
  height: 80%;
  background: url('插圖路徑') no-repeat bottom right;
  background-size: contain;
  opacity: 0.9;
}
</style>
