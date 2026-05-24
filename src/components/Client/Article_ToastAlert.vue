<script setup>
import { ref } from 'vue'

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

defineExpose({
  trigger,
})
</script>

<template>
  <Teleport to="body">
    <transition name="toast-fade">
      <div
        v-if="isVisible"
        class="fixed top-50 left-1/2 z-50 flex min-w-70 -translate-x-1/2 transform items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-medium text-red-800 shadow-lg">
        <span>⚠️ {{ errorMessage }}</span>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: opacity 0.3s ease;
}
.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
}
</style>
