<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router';
import { Home } from 'lucide-vue-next';
import { animate, stagger } from 'animejs'
// import 'animate.css';

const router = useRouter();
const titleText = 'PETMILY'
onMounted(() => {
  const playTitleAnimation = () => {
    animate('.letter', {
      y: [
        { to: '-3rem', ease: 'out-expo', duration: 600 },
        { to: 0, ease: 'out-bounce', duration: 800, delay: 100 }
      ],
      rotate: { from: '0turn', to: '1turn' }
    }, {
      delay: stagger(50)
    });
  };

  // 1. 進入時立刻跑一次
  playTitleAnimation();

  // 2. 每 5 秒觸發一次（動畫 2秒 + 閒置 3秒 = 5000ms）
  const timer = setInterval(playTitleAnimation, 5000);

  // 3. 重要：離開頁面時要清掉計時器，避免記憶體洩漏
  onUnmounted(() => {
    clearInterval(timer);
  });
});

const proceedToMenu = () => {
  // 點擊後跳轉到主選單路由
  router.push({ name: 'client-mainmenu' });
};

// 返回 Petmily 官方首頁
const backToWebHome = (event) => {
  // 使用 stopPropagation 防止點擊按鈕時觸發父層的 proceedToMenu
  event.stopPropagation();
  router.push({ name: 'home' });
};
</script>

<template>
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
  background-color: #FCF4E5; /* 奶油米色背景 */
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
  color: #453A27;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: bold;
  transition: all 0.3s ease;
  border: 1px solid rgba(69, 58, 39, 0.2);
  z-index: 10;
}

.back-home-btn:hover {
  background-color: #453A27;
  color: #FCF4E5;
  transform: translateX(5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.game-logo {
  font-size: 200px;
  color: #453A27;
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
  color: #453A27;
  font-size: 1.2rem;
  letter-spacing: 2px;
  animation: blink 2s infinite;
}

.footer-info {
  position: absolute;
  bottom: 30px;
  color: #453A27;
  font-size: 10px;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.2; }
}
</style>