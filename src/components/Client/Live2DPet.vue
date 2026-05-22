<script setup>
import { onMounted } from 'vue'

// 封裝一個動態載入 JS 的工具函式
const loadScript = (url) => {
  return new Promise((resolve, reject) => {
    // 如果已經載入過，就不要重複載入
    if (document.querySelector(`script[src="${url}"]`)) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = url
    script.onload = resolve
    script.onerror = reject
    document.body.appendChild(script)
  })
}

onMounted(async () => {
  try {
    // 🌟 仿照 NotionNext：動態引入網頁最穩定的經典版 Live2D 核心
    // 這個核心內部自帶滑鼠全域追蹤，且完全不依賴 Pixi.js，徹底根除 manager.on 錯誤！
    await loadScript('https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget/live2d.min.js')

    // 當全域物件確定存在後，直接初始化
    if (window.loadlive2d) {
      // 參數 1: Canvas 的 ID
      // 參數 2: 模型的 JSON 路徑（這裡用官方測試的經典 Shizuku 模型）
      window.loadlive2d(
        'live2d',
        'https://cdn.jsdelivr.net/npm/live2d-widget-model-hijiki/assets/hijiki.model.json',
      )
    }
  } catch (error) {
    console.error('Live2D 動態腳本載入失敗:', error)
  }
})
</script>

<template>
  <div class="pet-container">
    <!-- 經典版方案只需要一個固定的 canvas 標籤與對應的 ID -->
    <canvas id="live2d" width="250" height="350"></canvas>
  </div>
</template>

<style scoped>
.pet-container {
  position: fixed;
  bottom: 50%;
  left: 80%;
  width: 250px;
  height: 350px;
  z-index: 9999;
  pointer-events: none; /* 讓容器滑鼠穿透 */
  transform: translate(-50%, 50%);
}

#live2d {
  width: 100%;
  height: 100%;
  pointer-events: auto; /* 讓看板娘本身可以接收滑鼠事件，啟動追蹤 */
  cursor: pointer;
}
</style>
