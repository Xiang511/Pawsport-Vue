<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { PawPrint, Save } from 'lucide-vue-next'
import PlayerProfile from './PlayerProfile.vue'
import 'animate.css';
import { useGameAudio } from '@/composables/useGameAudio'

const { playSFX } = useGameAudio()

const isProfileOpen = ref(false)
const showBigSave = ref(false)
const closeType = ref('default') // 用來區分儲存或是取消
const openProfile = () => {
  closeType.value = 'default'
  isProfileOpen.value = true
}
const showCancelEffect = ref(false);
const handleClose = (type) => {
  closeType.value = type;

  if (type === 'save') {
    playSFX('click');
    showBigSave.value = true;
    setTimeout(() => { isProfileOpen.value = false; }, 2000); 
    setTimeout(() => { showBigSave.value = false; }, 1800);
  } else {
    playSFX('click');
    // 新增：普通退出的視覺回饋
    showCancelEffect.value = true;
    
    // 配合 PlayerProfile 彈走動畫 (0.8s)
    setTimeout(() => {
      isProfileOpen.value = false;
    }, 800);

    setTimeout(() => {
      showCancelEffect.value = false;
    }, 1000);
  }
};

const router = useRouter()
const exitGame = () => {
  router.push({ name: 'client-gameview' })
}
const levelSelect = () => {
  router.push({ name: 'client-levelselect' })
}
</script>

<template>
  <div v-if="showCancelEffect" class="cancel-overlay">
    <div class="cancel-circle"></div>
  </div>
  <div class="main-menu-container">
    <div class="user-profile-trigger animate__animated animate__jackInTheBox" @click="playSFX('click'); openProfile()">
      <span class="player-name">玩家名稱：DevUser_01</span>
    </div>

    <div v-if="showBigSave" class="big-save-overlay">
      <div class="big-save-icon">
        <img src="../../../../public/images/game/cat.gif" alt="Save Icon" class="custom-save-gif" />
        <!-- <Save :size="500" /> -->
      </div>
    </div>

    <Transition name="modal-fade">
      <PlayerProfile v-if="isProfileOpen" @close="handleClose" />
    </Transition>

    <div class="menu-side">
      <h2 class="mini-logo animate__animated animate__jackInTheBox">PETMILY</h2>
      <nav class="nav-list animate__animated animate__jackInTheBox">
        <div class="nav-item" @click="playSFX('click');levelSelect()">
          <span class="paw-icon"><PawPrint /></span>
          選擇關卡
        </div>
        <div class="nav-item" @click="playSFX('click');exitGame()">
          <span class="paw-icon"><PawPrint /></span>
          我的收藏
        </div>
        <div class="nav-item" @click="playSFX('click');exitGame()">
          <span class="paw-icon"><PawPrint /></span>
          遊戲設定
        </div>
        <div class="nav-item" @click="playSFX('click');exitGame()">
          <span class="paw-icon"><PawPrint /></span>
          造型商店
        </div>
        <div class="nav-item" @click="playSFX('click');exitGame()">
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
.cancel-overlay {
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  display: flex; justify-content: center; align-items: center;
  z-index: 10002;
  pointer-events: none;
}
.cancel-circle {
  width: 100px;
  height: 100px;
  border: 8px solid rgba(69, 58, 39, 0.3);
  border-radius: 50%;
  animation: cancel-pop 0.8s ease-out forwards;
}
.modal-fade-leave-active {
  transition: opacity 0.8s ease; /* 這裡的時間要足以覆蓋內部的彈掉動畫 */
}
.modal-fade-leave-to {
  opacity: 0;
}

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
  background-color: #453a27;
  color: #fcf4e5;
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
  color: #453a27;
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
  font-size: 7.5rem;
  font-weight: 900;
  margin-bottom: 30px;
  margin-left: 2rem;
  -webkit-text-stroke: 4px #453a27;
  paint-order: stroke fill;
  text-shadow: 
    1px 1px 0 #453a27, 
    -1px -1px 0 #453a27, 
    1px -1px 0 #453a27, 
    -1px 1px 0 #453a27,
    5px 5px 0px rgba(252, 200, 109, 0.3);
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
  width: fit-content; /* 讓背景寬度跟著文字走 */
  z-index: 1; /* 確保文字在背景之上 */
}

.nav-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #453a27;
  border-radius: 15px; /* 圓角矩形 */
  z-index: -1; /* 放在文字下面 */

  /* 初始動畫狀態：縮小並透明 */
  transform: scaleX(0.8);
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.nav-item:hover {
  color: #fcf4e5; /* 移入時文字變米色，與背景形成對比 */
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
.custom-save-gif {
  width: 400px;
  height: auto;
  /* 讓 GIF 邊緣有金色的發光感，更符合寵物遊戲的溫馨調性 */
  filter: drop-shadow(0 0 20px rgba(252, 200, 109, 0.6)); 
  margin-bottom: 15px;
}

/* 巨大儲存圖示的容器 */
.big-save-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000; /* 比 Modal 還高 */
  pointer-events: none;
}
.big-save-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fcc86d;
  text-shadow: 0 0 20px rgba(0,0,0,0.5);
  /* 執行 2.2 秒的動畫，最後停留在透明狀態 */
  animation: big-save-sequence 1.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

.save-text {
  /* 讓文字也有一點發光感 */
  color: #fcc86d;
  font-size: 3rem;
  font-weight: 900;
  text-shadow: 0 0 20px rgba(252, 200, 109, 0.8);
  margin-top: 20px;
}

@keyframes save-fly-in-out {
  0% {
    opacity: 0;
    /* 一開始很小，旋轉著從遠處飛來 */
    transform: scale(0) rotate(-180deg);
  }
  30% {
    opacity: 1;
    /* 快速放大到超出螢幕的感覺 (旋轉一圈) */
    transform: scale(2.5) rotate(0deg);
  }
  60% {
    /* 停留在畫面中間震動或縮小一點點 */
    transform: scale(1.2) rotate(10deg);
  }
  100% {
    opacity: 0;
    /* 最後旋轉著縮小並飛回去 */
    transform: scale(0) rotate(360deg);
  }
}

@keyframes big-save-sequence {
  0% { 
    transform: scale(0) rotate(-180deg); 
    opacity: 0; 
  }
  20% { 
    transform: scale(1.3) rotate(10deg); 
    opacity: 1; 
  }
  35% { 
    transform: scale(1) rotate(10deg); 
  }
  /* 停留期 */
  75% { 
    transform: scale(1) rotate(-10deg); 
    opacity: 1; 
  }
  /* 修正離開：在 1.8s 結束前完成旋轉飛出，這樣就不會比 Modal 晚離開 */
  100% { 
    transform: scale(0) rotate(180deg); 
    opacity: 0; 
  }
}
@keyframes cancel-pop {
  0% { transform: scale(0.5); opacity: 0; }
  50% { opacity: 0.5; }
  100% { transform: scale(2); opacity: 0; }
}

</style>
