// src/composables/useGameAudio.js
import { watch, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const sfxVolume = ref(0.5) // 預設音效音量 50%
const bgmVolume = ref(0.3) // 預設背景音樂音量 30%

let isAudioAuthorized = false
// 用來確保只提示一次音訊授權，避免重複彈窗騷擾玩家
const hasPromptedAudio = ref(false)

const bgm = new Audio('/audio/bgm.mp3')
bgm.loop = true
bgm.volume = bgmVolume.value

let countdownInstance = null

const sfxAssets = {
  click: '/audio/click.wav',
  success: '/audio/win.wav',
  fail: '/audio/lose.wav',
  win: '/audio/win.wav',
  lose: '/audio/lose.wav',
  countdown: '/audio/countdown.wav'
}

export function useGameAudio() {
  const route = useRoute()

  // 播放音效：這裡建立新實體是正確的，因為音效需要重疊播放
  const playSFX = (type) => {
    if (!sfxAssets[type]) return
    const sound = new Audio(sfxAssets[type])
    sound.volume = sfxVolume.value
    if (type === 'countdown') {
      countdownInstance = sound
    }
    sound.play().catch((e) => console.log('音效播放受阻:', e))
  }

  const forcePlayBGM = () => {
    isAudioAuthorized = true
    hasPromptedAudio.value = true
    if (bgm.paused) {
      bgm.play()
        .then(() => console.log('BGM 經使用者允許成功播放'))
        .catch((e) => console.log('強制播放失敗:', e))
    }
  }

  const pauseCountdown = () => {
    if (countdownInstance) {
      countdownInstance.pause()
    }
  }

  const resumeCountdown = () => {
    if (countdownInstance && countdownInstance.paused) {
      countdownInstance.play()
    }
  }

  // 控制背景音樂音量
  const updateBGMVolume = (val) => {
    const volume = val / 100
    bgmVolume.value = volume
    if (bgm) {
      bgm.volume = volume
    }
  }
  // 控制音效音量
  const updateSFXVolume = (val) => {
    sfxVolume.value = val / 100
  }

  const tryPlayBGM = () => {
    if (!route?.path) return
    const path = route.path.toLowerCase()
    const isGameArea = path.includes('game') || path.includes('level')

    //多加一個判斷：必須 isAudioAuthorized 為 true 才能播
    if (isGameArea && bgm.paused && isAudioAuthorized) {
      bgm.play().catch(() => console.log('等待互動以播放音樂...'))
    }
  }

  const initAudioLogic = () => {
    watch(
      () => route.path,
      (newPath) => {
        if (!newPath) return
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

  // 掛載到 window 方便調用
  window.gameSFX = playSFX
  window.gameBGM = bgm

  return {
    initAudioLogic,
    playSFX,
    updateBGMVolume,
    updateSFXVolume,
    bgmVolume, // 回傳給滑桿 v-model 使用 (需轉換為 0-100)
    sfxVolume, // 回傳給滑桿 v-model 使用 (需轉換為 0-100)
    bgm,
    pauseCountdown,
    resumeCountdown,
    forcePlayBGM,
    hasPromptedAudio
  }
}
