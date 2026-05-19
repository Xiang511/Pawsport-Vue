<script setup>
import { computed } from 'vue'

//
const props = defineProps({
  // 按鈕類型：primary (提交), draft (草稿)
  type: {
    type: String,
    default: 'primary',
  },
  // 按鈕是否被禁用
  disabled: {
    type: Boolean,
    default: false,
  },
})
// 當按鈕被點擊時，子元件會向父元件發出一個click信號
defineEmits(['click'])

// 根據傳入的 type 與 disabled 狀態，動態計算對應的 Tailwind 樣式
const buttonClass = computed(() => {
  // 1. 如果是禁用狀態，直接套用禁用樣式（不論是 primary 還是 draft）
  if (props.disabled) {
    return 'bg-gray-200 text-gray-400 cursor-not-allowed'
  }

  // 2. 正常狀態下，根據 type 切換對應的 Tailwind 樣式與 Hover 效果
  switch (props.type) {
    case 'draft':
      return 'bg-gray-100 text-[#747bbd] hover:bg-gray-200'
    case 'primary':
    default:
      return 'bg-[#3367d6] text-white font-bold hover:bg-[#2852b3]'
  }
})
</script>

<template>
  <!-- 
    基礎樣式（對應 .base-button）：
    px-5 py-2.5 (內邊距) | rounded-full (圓角20px/膠囊狀) | text-sm (14px) | transition-all duration-300 (動態過渡) 
  -->
  <button
    class="rounded-full px-5 py-2.5 text-sm transition-all duration-300 select-none"
    :class="buttonClass"
    :disabled="disabled"
    @click="$emit('click', $event)">
    <!-- 使用 slot 讓按鈕文字可以靈活定義 -->
    <slot />
  </button>
</template>

<style scoped></style>
