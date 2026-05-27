<script setup>
import { ref, computed } from 'vue'

const isVisible = ref(false)
const errorMessage = ref('')

// 給外部組件呼叫，並動態傳入訊息
const trigger = (message, duration = 3000) => {
  errorMessage.value = message
  isVisible.value = true

  // 自動消失計時器
  setTimeout(() => {
    isVisible.value = false
  }, duration)
}

// 根據訊息內容智慧化決定狀態圖示，增強 Neo-brutalist 交互樂趣
const statusEmoji = computed(() => {
  const msg = errorMessage.value || ''
  if (
    msg.includes('失敗') ||
    msg.includes('異常') ||
    msg.includes('錯誤') ||
    msg.includes('請先') ||
    msg.includes('限制') ||
    msg.includes('無效') ||
    msg.includes('未填')
  ) {
    return '⚠️'
  }
  if (
    msg.includes('成功') ||
    msg.includes('更新') ||
    msg.includes('儲存') ||
    msg.includes('載入') ||
    msg.includes('跳轉')
  ) {
    return '✨'
  }
  return '🐾'
})

defineExpose({
  trigger,
})
</script>

<template>
  <Teleport to="body">
    <transition name="toast-slide">
      <div
        v-if="isVisible"
        class="font-fredoka fixed top-24 left-1/2 z-50 flex max-w-[90%] min-w-[320px] -translate-x-1/2 transform items-center justify-center gap-3 rounded-2xl border-4 border-[#445944] bg-[#FCF4E5] px-6 py-3.5 text-sm font-black text-[#445944] shadow-[6px_6px_0px_#445944]">
        <span class="shrink-0 text-lg">{{ statusEmoji }}</span>
        <span class="leading-relaxed">{{ errorMessage }}</span>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&display=swap');

.font-fredoka {
  font-family: 'Fredoka', 'GenJyuu', sans-serif;
}

/* 立體彈跳滑入過渡動畫 */
.toast-slide-enter-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.toast-slide-leave-active {
  transition: all 0.3s ease-in;
}
.toast-slide-enter-from {
  opacity: 0;
  transform: translate(-50%, -24px) scale(0.95);
}
.toast-slide-leave-to {
  opacity: 0;
  transform: translate(-50%, -12px) scale(0.98);
}
</style>
