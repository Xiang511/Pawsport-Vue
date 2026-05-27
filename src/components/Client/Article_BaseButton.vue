<script setup>
import { computed } from 'vue'

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
  if (props.disabled) {
    return 'border-2 border-[#445944]/30 bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
  }

  switch (props.type) {
    case 'draft':
      return 'border-2 border-[#445944] bg-[#FCF4E5] text-[#445944] shadow-[3px_3px_0px_#445944] hover:bg-white active:translate-y-[1px] active:shadow-[2px_2px_0px_#445944]'
    case 'primary':
    default:
      return 'border-2 border-[#445944] bg-[#445944] text-white shadow-[3px_3px_0px_#445944] hover:bg-emerald-800 active:translate-y-[1px] active:shadow-[2px_2px_0px_#445944]'
  }
})
</script>

<template>
  <button
    class="rounded-xl px-5 py-2.5 text-sm font-black transition-all select-none"
    :class="buttonClass"
    :disabled="disabled"
    @click="$emit('click', $event)">
    <slot />
  </button>
</template>

<style scoped></style>
