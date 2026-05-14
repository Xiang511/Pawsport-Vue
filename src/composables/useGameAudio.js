// src/composables/useGameAudio.js
import { watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'

export function useGameAudio() {
  const route = useRoute()

  // 初始化音訊物件
  const bgm = new Audio('/audio/bgm.mp3')
  bgm.loop = true
  bgm.volume = 0.5

  const tryPlayBGM = () => {
    const path = route.path.toLowerCase()
    const isGameArea = path.includes('game') || path.includes('level')

    if (isGameArea) {
      bgm
        .play()
        .then(() => {
          console.log('BGM 成功播放')
          window.removeEventListener('click', tryPlayBGM)
        })
        .catch(() => {
          console.log('音訊等待互動中...')
        })
    }
  }

  const initAudioLogic = () => {
    watch(
      () => route.path,
      (newPath) => {
        const path = newPath.toLowerCase()
        const isGameArea = path.includes('game') || path.includes('level')

        if (isGameArea) {
          tryPlayBGM()
          window.addEventListener('click', tryPlayBGM)
        } else {
          bgm.pause()
          bgm.currentTime = 0
          window.removeEventListener('click', tryPlayBGM)
        }
      },
      { immediate: true },
    )

    onMounted(() => {
      tryPlayBGM()
    })
  }

  // 將 BGM 實例掛載到 window，方便其他元件直接控制（例如靜音按鈕）
  window.gameBGM = bgm

  return {
    initAudioLogic,
    bgm, // 如果之後有元件需要調整音量或暫停，可以 return 出去
  }
}
