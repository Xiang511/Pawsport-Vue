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

// 根據傳入的 type 返回對應的 CSS Class
// 計算：btn-上面props傳入的type值，轉換成字串
const typeClass = computed(() => `btn-${props.type}`)
</script>

<template>
  <button
    class="base-button"
    :class="[typeClass, { 'is-disabled': disabled }]"
    :disabled="disabled"
    @click="$emit('click', $event)">
    <!-- 使用 slot 讓按鈕文字可以靈活定義 -->
    <slot />
  </button>
</template>

<style scoped>
/* 基礎樣式：無邊框，圓角20px */
.base-button {
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}
/* 提交按鈕樣式：藍底粗白字 */
.btn-primary {
  background: #3367d6;
  color: white;
  font-weight: bold;
}
/* 草稿按鈕樣式：淺色底灰字 */
.btn-draft {
  background: #f5f5f5;
  color: #888;
}
/* 禁用狀態：淺灰底灰字，禁止游標 */
/*  */
.base-button:disabled,
.is-disabled {
  background: #e0e0e0;
  color: #aaa;
  cursor: not-allowed;
}
</style>
