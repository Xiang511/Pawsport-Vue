<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { PawPrint, Save } from 'lucide-vue-next'
import PlayerProfile from './PlayerProfile.vue'
import 'animate.css';
import { useGameAudio } from '@/composables/useGameAudio'

const { 
  playSFX, 
  updateBGMVolume, 
  updateSFXVolume, 
  bgmVolume, 
  sfxVolume 
} = useGameAudio()

// 控制主選單設定 Modal 的顯示
const showSettingsModal = ref(false)
// 定義滑桿專用變數 (0~100)
const bgmSlider = ref(bgmVolume.value * 100)
const sfxSlider = ref(sfxVolume.value * 100)
// 監聽並同步全域音量
watch(bgmSlider, (newVal) => updateBGMVolume(newVal))
watch(sfxSlider, (newVal) => updateSFXVolume(newVal))

// 點擊「遊戲設定」按鈕
const openSettings = () => {
  playSFX('click')
  // 打開前再次同步最新音量值，避免數值與關卡內調整的不一致
  bgmSlider.value = bgmVolume.value * 100
  sfxSlider.value = sfxVolume.value * 100
  showSettingsModal.value = true
}

// 關閉設定
const closeSettings = () => {
  playSFX('click')
  showSettingsModal.value = false
}

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
const skinShop = () => {
  router.push({ name: 'client-skinshop' })
}
const inventory = () => {
  router.push({ name: 'client-inventory' })
}
</script>

<template>
  <div v-if="showCancelEffect" class="cancel-overlay">
    <div class="cancel-circle"></div>
  </div>
  <div class="main-menu-container">
    <div class="user-profile-trigger animate__animated animate__jackInTheBox" @click="playSFX('click'); openProfile()">
      <span class="player-name">玩家名稱：DevUser_01</span><span class="user-profile-tail"></span>
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
          選擇關卡<span class="nav-item-tail"></span>
        </div>
        <div class="nav-item" @click="playSFX('click');inventory()">
          <span class="paw-icon"><PawPrint /></span>
          我的收藏<span class="nav-item-tail"></span>
        </div>
        <div class="nav-item" @click="playSFX('click');openSettings()">
          <span class="paw-icon"><PawPrint /></span>
          遊戲設定<span class="nav-item-tail"></span>
        </div>
        <div class="nav-item" @click="playSFX('click');skinShop()">
          <span class="paw-icon"><PawPrint /></span>
          造型商店<span class="nav-item-tail"></span>
        </div>
        <div class="nav-item" @click="playSFX('click');exitGame()">
          <span class="paw-icon"><PawPrint /></span>
          離開遊戲<span class="nav-item-tail"></span>
        </div>
      </nav>
    </div>

    <div class="character-art">
      <div class="art-placeholder"></div>
    </div>
  </div>
  <Transition name="fade">
  <div v-if="showSettingsModal" class="audio-auth-mask">
    <div class="audio-auth-card">
      <h3 class="auth-title">遊戲音量設定</h3>
      
      <div class="audio-settings-body">
        <div class="volume-control-row">
          <span class="volume-label">背景音樂</span>
          <input 
            type="range" 
            v-model="bgmSlider" 
            min="0" 
            max="100" 
            class="volume-input-range" 
            :style="{ '--value': bgmSlider + '%' }" 
          />
          <span class="volume-percentage">{{ Math.round(bgmSlider) }}%</span>
        </div>

        <div class="volume-control-row">
          <span class="volume-label">遊戲音效</span>
          <input 
            type="range" 
            v-model="sfxSlider" 
            min="0" 
            max="100" 
            class="volume-input-range" 
            :style="{ '--value': sfxSlider + '%' }" 
          />
          <span class="volume-percentage">{{ Math.round(sfxSlider) }}%</span>
        </div>

        <button class="auth-btn btn-save-settings" @click="closeSettings">
          儲存並返回選單
        </button>
      </div>
    </div>
  </div>
</Transition>
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

/* ===================================================
   👤 玩家檔案按鈕：基礎狀態（完美對齊關卡按鈕樣式）
   =================================================== */
/* ===================================================
   👤 玩家檔案按鈕：完全對齊 nav-item 靈魂手感版（向左滑動）
   =================================================== */
.user-profile-trigger {
  /* 完好保留你原本的絕對定位，釘在右上角不動 */
  position: absolute;
  top: 40px;
  right: 60px;
  
  /* 完好保留原本外框與基礎樣式 */
  background-color: #fcf4e5; 
  color: #453a27;
  padding: 12px 30px; /* 對齊 nav-item padding */
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 10;
  border: 4px solid #453a27;
  
  /* 💡 預設初始陰影：6px */
  box-shadow: 0 6px 0 #453a27;
  
  /* 💡 關鍵 1：固定底部支點，讓垂直縮放彈跳時有踩在地面上的扎實感 */
transform-origin: bottom;
  
  /* 帶有強烈彈性的果凍曲線 */
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.user-profile-trigger::before {
  display: none !important; /* 確保 before 清空不干擾 */
}

/* ===================================================
   🐾 貓耳朵：緊貼天花板（完美繼承頂部震動，不陷落）
   =================================================== */
.user-profile-trigger::after {
  content: '';
  position: absolute;
  bottom: 100%; 
  left: 25px; /* 對齊 nav-item 耳朵左邊距 */
  width: 0;
  height: 0;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-bottom: 16px solid #453a27;
  filter: drop-shadow(75px 0 0 #453a27); 
  
  opacity: 0;
  transform: translateY(6px) scale(0);
  /* 💡 關鍵 2：耳朵支點鎖在底部，完美繼承按鈕頂部的壓扁動態 */
transform-origin: bottom;
  
  /* 帶有強烈彈性的果凍曲線 */
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: -1;
}

/* ===================================================
   🐈 貓尾巴：此處利用獨立標籤控制，若 HTML 中未加則維持此設定
   =================================================== */
.user-profile-tail {
  content: '';
  position: absolute;
  bottom: 0;
  right: -32px; 
  width: 35px;
  height: 50px;
  border-right: 5px solid #453a27;
  border-bottom: 5px solid #453a27;
  border-radius: 0 0 25px 0; 
  opacity: 0;
  transform: scale(0) rotate(-30deg);
transform-origin: bottom;
  
  /* 帶有強烈彈性的果凍曲線 */
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: -1;
}

/* ===================================================
   ✨ Hover 互動：改為【向左位移 40px】+ 純垂直 Q 彈放大
   =================================================== */
.user-profile-trigger:hover {
  background-color: #fcf4e5; /* 對齊 nav-item 移入變米色 */
  color: #453a27;
  
  /* 💡 核心變形：
      - translateX(-40px): 滿足你想要的改為【往左滑動】40px！
      - translateY(-4px): 稍微飄浮起來
      - scaleY(1.08): 只有垂直方向拉長，產生啵一聲的彈跳感
      - scaleX(1): 水平方向絕對不變形 */
transform-origin: bottom;
  
  /* 帶有強烈彈性的果凍曲線 */
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 10px 0 #453a27 !important;
  z-index: 99;
}

/* Hover 時 —— 耳朵與獨立尾巴完美彈出 */
.user-profile-trigger:hover::after {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.user-profile-trigger:hover .user-profile-tail {
  opacity: 1;
  transform: scale(1) rotate(0deg);
  animation: profileTailWag 1.4s ease-in-out infinite alternate;
}

/* ===================================================
   💥 Active 點擊互動：維持向左位移 + 壓扁 + 解決陰影閃爍
   =================================================== */
.user-profile-trigger:active {
  /* 💡 點擊時，維持在左邊（translateX(-40px)），垂直壓扁到 0.88，陰影縮短到 2px */
  transform: translateY(4px) scaleY(0.88) scaleX(1) !important;
  box-shadow: 0 2px 0 #453a27 !important;
  
  /* 對齊 nav-item 點擊時的極速壓扁體感 */
transform-origin: bottom;
  
  /* 帶有強烈彈性的果凍曲線 */
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* 💡 耳朵在按鈕壓扁時，同步進行微幅壓扁，絕不閃爍與下陷 */
.user-profile-trigger:active::after {
  opacity: 1;
  transform: translateY(0) scaleY(0.85) scaleX(1); 
transform-origin: bottom;
  
  /* 帶有強烈彈性的果凍曲線 */
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.user-profile-trigger:active .user-profile-tail {
  opacity: 1;
  transform: scale(0.95) translateY(2px);
transform-origin: bottom;
  
  /* 帶有強烈彈性的果凍曲線 */
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* ===================================================
   🐈 貓尾巴擺動動畫
   =================================================== */
@keyframes profileTailWag {
  0% { transform: rotate(-8deg); }
  100% { transform: rotate(18deg); }
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

/* --- 純平移融合版：主選單選項（Nav Item） --- */
.nav-item {
  display: flex;
  align-items: center;
  font-size: 1.8rem;
  margin: 18px 0;
  cursor: pointer;
  color: #453a27;
  position: relative;
  padding: 12px 30px;
  width: fit-content; 
  z-index: 1; 

  background-color: #fcf4e5;
  border: 4px solid #453a27;
  border-radius: 20px;
  box-shadow: 0 6px 0 #453a27;

  /* 💡 關鍵 1：固定底部支點，讓垂直縮放彈跳時有踩在地面上的扎實感 */
  transform-origin: bottom;
  
  /* 帶有強烈彈性的果凍曲線 */
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.nav-item::before {
  display: none !important;
}

/* ===================================================
   🐾 貓耳朵：緊貼天花板
   =================================================== */
.nav-item::after {
  content: '';
  position: absolute;
  bottom: 100%; 
  left: 25px;
  width: 0;
  height: 0;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-bottom: 16px solid #453a27;
  filter: drop-shadow(75px 0 0 #453a27); 
  
  opacity: 0;
  transform: translateY(6px) scale(0);
  /* 💡 關鍵 2：耳朵的支點也鎖在底部，這樣它會完美繼承按鈕頂部的震動，絕不陷進去 */
  transform-origin: bottom center;
  transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: -1;
}

/* ===================================================
   🐈 貓尾巴
   =================================================== */
.nav-item-tail {
  content: '';
  position: absolute;
  bottom: 0;
  right: -32px; 
  width: 35px;
  height: 50px;
  border-right: 5px solid #453a27;
  border-bottom: 5px solid #453a27;
  border-radius: 0 0 25px 0; 
  opacity: 0;
  transform: scale(0) rotate(-30deg);
  transform-origin: left bottom;
  transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: -1;
}

/* ===================================================
   ✨ Hover 互動：右移 40px + 【純垂直】高頻率 Q 彈晃動
   =================================================== */
.nav-item:hover {
  background-color: #fcf4e5;
  color: #453a27;
  
  /* 💡 核心融合：
     - translateX(40px): 滿足你想要的大幅往右滑動
     - translateY(-4px): 稍微飄浮起來
     - scaleY(1.08): 只有垂直方向拉長，產生啵一聲的彈跳感！
     - scaleX(1): 【核心修正】水平方向維持 1，絕對不往左右擠扁或變形！ */
  transform: translateX(40px) translateY(-4px) scaleY(1.08) scaleX(1);
  
  box-shadow: 0 10px 0 #453a27;
  z-index: 99;
}

/* Hover 時 —— 耳朵彈出 */
.nav-item:hover::after {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* Hover 時 —— 尾巴彈出搖擺 */
.nav-item:hover .nav-item-tail {
  opacity: 1;
  transform: scale(1) rotate(0deg);
  animation: menuTailWag 1.4s ease-in-out infinite alternate;
}

/* 貓爪變色放大 */
.nav-item:hover .paw-icon {
  color: #fcc86d;
  opacity: 1;
  transform: scale(1.2) rotate(-12deg); 
}

/* ===================================================
   💥 Active 點擊互動：整體下沉 + 耳朵精確微壓
   =================================================== */
.nav-item:active {
  /* 💡 點擊時，按鈕寬度不變形（scaleX(1)），但垂直壓扁到 0.88，營造極強點擊打擊感 */
  transform: translateX(40px) translateY(4px) scaleY(0.88) scaleX(1);
  box-shadow: 0 2px 0 #453a27;
  transition: all 0.05s ease;
}

/* 💡 因為按鈕用了 scaleY 壓扁，且耳朵的定位鎖在頂部天花板，
   現在耳朵只要同步進行微幅壓扁 scaleY(0.85)，
   視覺上就會呈現完美的「跟著按鈕一起往下壓低、微微收起耳朵」的精緻動態，完全不穿幫！ */
.nav-item:active::after {
  opacity: 1;
  transform: translateY(0) scaleY(0.85) scaleX(1); 
  transition: all 0.05s ease;
}

.nav-item:active .nav-item-tail {
  opacity: 1;
  transform: scale(0.95) translateY(2px);
  transition: all 0.05s ease;
}

/* ===================================================
   🐾 貓爪 Icon
   =================================================== */
.paw-icon {
  color: #453a27; 
  margin-right: 15px;
  display: flex;
  align-items: center;
  opacity: 0.6; 
  transform: scale(0.8); 
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes menuTailWag {
  0% { transform: rotate(-8deg); }
  100% { transform: rotate(18deg); }
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


/* --- 彈窗基礎遮罩與卡片 --- */
.audio-auth-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(69, 58, 39, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
  backdrop-filter: blur(4px);
}

.audio-auth-card {
  background-color: #fcf4e5;
  border: 4px solid #453a27;
  border-radius: 20px;
  padding: 30px;
  width: 90%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 8px 0 #453a27;
}

.auth-title {
  font-size: 1.6rem;
  font-weight: 900;
  color: #453a27;
  margin-bottom: 20px;
}

.audio-settings-body {
  margin: 20px 0;
  text-align: left;
}

.volume-control-row {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.volume-label, .volume-percentage {
  color: #453a27;
  font-weight: bold;
  font-size: 1.1rem;
}

.volume-percentage {
  width: 45px;
  text-align: right;
}

/* --- 這裡完全沿用你在 LevelSelect-1.vue 的滑桿魔法 --- */
.volume-input-range {
  flex: 1;
  -webkit-appearance: none;
  width: 100%;
  height: 14px;
  border-radius: 10px;
  /* 運用 HTML 傳進來的 --value 變數，動態切割漸層色 */
  background: linear-gradient(to right, #453a27 0%, #453a27 var(--value), #e5dfd5 var(--value), #e5dfd5 100%);
  outline: none;
}

/* 網頁滑桿的圓鈕（Thumb）樣式 */
.volume-input-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #453a27;
  cursor: pointer;
  border: 2px solid #fcf4e5;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.volume-input-range::-moz-range-thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #453a27;
  cursor: pointer;
  border: 2px solid #fcf4e5;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

/* 儲存按鈕（配合主選單粗框質感） */
.btn-save-settings {
  width: 100%;
  padding: 12px;
  font-size: 1.2rem;
  font-weight: 800;
  background-color: #fcc86d;
  color: #453a27;
  border: 3px solid #453a27;
  border-radius: 12px;
  box-shadow: 0 5px 0 #453a27;
  cursor: pointer;
  transition: all 0.1s ease;
  margin-top: 10px;
}

.btn-save-settings:active {
  transform: translateY(4px);
  box-shadow: 0 1px 0 #453a27;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
