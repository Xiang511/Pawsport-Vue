<script setup>
import { watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'

const bgm = new Audio('/audio/bgm.mp3') 
bgm.loop = true
bgm.volume = 0.5
const route = useRoute()

watch(() => route.path, (newPath) => {
  // 2. 轉成小寫比對，增加穩定性
  const path = newPath.toLowerCase()
  const isGameArea = path.includes('game') || path.includes('level')
  
  console.log("當前路徑:", path, "是否播放音樂:", isGameArea)

  if (isGameArea) {
    // 3. 嘗試播放
    bgm.play().catch(() => {
      // 瀏覽器自動播放限制處理
      console.log("等待點擊後啟動 BGM...")
      window.addEventListener('click', () => {
        bgm.play()
      }, { once: true })
    })
  } else {
    // 4. 離開遊戲區則暫停
    bgm.pause()
    // 如果想要下次進入從頭開始，保留這行；如果想接續播放，則刪掉這行
    bgm.currentTime = 0 
  }
}, { immediate: true })

// 5. 讓其他組件（如暫停選單）也能控制這個音樂
window.gameBGM = bgm
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
