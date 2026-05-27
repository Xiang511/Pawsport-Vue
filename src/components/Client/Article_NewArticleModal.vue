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
    class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4 font-fredoka">
    
    <!-- 彈窗本體 -->
    <div
      class="w-full max-w-md transform cursor-default rounded-3xl border-4 border-[#445944] bg-white p-6 shadow-[8px_8px_0px_#445944] transition-all">
      
      <!-- 標題與圖示 -->
      <div class="flex items-center space-x-3 text-amber-500">
        <svg class="h-6 w-6 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 class="text-lg font-black text-[#445944]">儲存目前的變更嗎？</h3>
      </div>

      <!-- 說明內文 -->
      <p class="mt-3 text-xs font-bold leading-relaxed text-gray-500">
        您正在嘗試建立一篇全新文章。點擊儲存將會把目前的進度留存為草稿，避免內容遺失喔！🐾
      </p>

      <!-- 按鈕控制區 -->
      <div
        class="mt-6 flex flex-col space-y-3.5 text-xs sm:flex-row sm:justify-end sm:space-y-0 sm:space-x-2.5">
        
        <!-- 取消 -->
        <button
          @click="emit('update:modelValue', false)"
          class="w-full rounded-xl border-2 border-[#445944] bg-white px-4 py-2.5 font-black text-[#445944] shadow-[3px_3px_0px_#445944] transition hover:bg-[#FCF4E5] active:translate-y-[1px] active:shadow-[1px_1px_0px_#445944] sm:w-auto">
          取消
        </button>

        <!-- 不儲存直接新建 -->
        <button
          @click="emit('discard')"
          class="w-full rounded-xl border-2 border-[#445944] bg-rose-50 px-4 py-2.5 font-black text-rose-600 shadow-[3px_3px_0px_#445944] transition hover:bg-rose-100 active:translate-y-[1px] active:shadow-[1px_1px_0px_#445944] sm:w-auto">
          直接新建
        </button>

        <!-- 儲存並新建 -->
        <button
          @click="emit('save')"
          class="w-full rounded-xl border-2 border-[#445944] bg-amber-400 px-4 py-2.5 font-black text-[#445944] shadow-[3px_3px_0px_#445944] transition hover:bg-[#445944] hover:text-white active:translate-y-[1px] active:shadow-[1px_1px_0px_#445944] sm:w-auto">
          儲存草稿並新建
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
