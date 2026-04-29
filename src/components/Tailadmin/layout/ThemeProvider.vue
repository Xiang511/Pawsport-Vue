<script setup>
import { ref, provide, onMounted, watch, computed } from 'vue'

// 狀態管理
const theme = ref('light')
const isInitialized = ref(false)

// 計算屬性
const isDarkMode = computed(() => theme.value === 'dark')

// 切換主題的方法
const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

onMounted(() => {
  // 從 localStorage 讀取先前儲存的主題，若無則預設為 'light'
  const savedTheme = localStorage.getItem('theme')
  const initialTheme = savedTheme || 'light'

  theme.value = initialTheme
  isInitialized.value = true
})

// 監聽主題變化並更新 DOM 與本地儲存
watch([theme, isInitialized], ([newTheme, newIsInitialized]) => {
  if (newIsInitialized) {
    localStorage.setItem('theme', newTheme)
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
})

// 提供狀態給子元件
provide('theme', {
  isDarkMode,
  toggleTheme,
})
</script>

<script>
import { inject } from 'vue'

/**
 * 組合式函數：供子元件呼叫以取得主題狀態
 */
export function useTheme() {
  const theme = inject('theme')
  if (!theme) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return theme
}
</script>
<template>
  <slot></slot>
</template>
