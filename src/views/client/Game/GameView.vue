<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const proceedToMenu = () => {
  // 點擊後跳轉到主選單路由
  router.push({ name: 'client-mainmenu' });
};
</script>

<template>
  <div class="game-start-screen" @click="proceedToMenu">
    <div class="logo-container">
      <h1 class="game-logo">PETMILY</h1>
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
  background-color: #FCF4E5;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.game-logo {
  font-size: 120px;
  color: #453A27;
  font-weight: 900;
  letter-spacing: 15px;
  text-shadow: 2px 2px 0px rgba(252, 200, 109, 0.3);
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