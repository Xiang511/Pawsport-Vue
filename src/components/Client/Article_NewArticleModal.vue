<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue', 'discard', 'save'])
</script>
<template>
  <div
    v-if="modelValue"
    @click.self="emit('update:modelValue', false)"
    class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
    <!-- 彈窗本體 -->
    <div
      class="w-full max-w-md transform cursor-default rounded-2xl border border-gray-100 bg-white p-6 shadow-xl transition-all">
      <!-- 標題與圖示 -->
      <div class="flex items-center space-x-3 text-amber-500">
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 class="text-lg font-bold text-gray-900">您想儲存目前的變更嗎？</h3>
      </div>

      <!-- 說明內文 -->
      <p class="mt-3 text-sm leading-relaxed text-gray-500">
        您正在嘗試建立一篇全新文章。點擊儲存將會把目前的進度留存為草稿，避免內容遺失。
      </p>

      <!-- 按鈕控制區 -->
      <div
        class="mt-6 flex flex-col space-y-2 text-sm sm:flex-row sm:justify-end sm:space-y-0 sm:space-x-2">
        <!-- 取消 -->
        <button
          @click="emit('update:modelValue', false)"
          class="w-full rounded-xl px-4 py-2.5 font-medium text-gray-500 transition-colors hover:bg-gray-100 sm:w-auto">
          取消
        </button>

        <!-- 不儲存直接新建 -->
        <button
          @click="emit('discard')"
          class="w-full rounded-xl px-4 py-2.5 font-medium text-rose-400 transition-colors hover:bg-red-50 sm:w-auto">
          直接新建
        </button>

        <!-- 儲存並新建 -->
        <button
          @click="emit('save')"
          class="bg-brand-success-300 hover:bg-brand-success-400 w-full rounded-xl px-4 py-2.5 font-medium text-white shadow-sm transition-colors sm:w-auto">
          儲存草稿並新建
        </button>
      </div>
    </div>
  </div>
</template>
