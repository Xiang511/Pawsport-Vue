<script setup>
import { Trash2 } from 'lucide-vue-next'

defineProps({
  modelValue: { type: Boolean, default: false },
  drafts: { type: Array, default: () => [] },
})
const emit = defineEmits(['update:modelValue', 'select', 'delete'])

// 簡單的文字截斷輔助函式
const truncateText = (text, length = 60) => {
  if (!text) return '無內文...'
  const cleanText = text.replace(/<[^>]*>/g, '')
  return cleanText.length > length ? cleanText.substring(0, length) + '...' : cleanText
}
</script>

<template>
  <div
    v-if="modelValue"
    @click.self="emit('update:modelValue', false)"
    class="fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-slate-900/50 backdrop-blur-sm">
    <!-- 彈窗本體 -->
    <div
      class="w-full max-w-xl transform cursor-default overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl transition-all">
      <!-- 頂部標題列 -->
      <div class="flex items-center justify-between border-b border-gray-100 bg-slate-50 px-6 py-4">
        <div class="flex items-center space-x-2">
          <h3 class="text-lg font-bold text-gray-800">所有草稿</h3>
        </div>
        <!-- 關閉按鈕 -->
        <button
          @click="emit('update:modelValue', false)"
          class="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
          <svg
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L16 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- 草稿清單區 -->
      <div class="max-h-100 divide-y divide-gray-100 overflow-y-auto">
        <!-- 沒草稿時的狀態 -->
        <div
          v-if="drafts.length === 0"
          class="flex flex-col items-center justify-center py-12 text-gray-400">
          <svg
            class="mb-2 h-12 w-12 stroke-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p class="text-sm">目前沒有任何草稿</p>
        </div>

        <!-- 草稿卡片項目 -->
        <div
          v-for="draft in drafts"
          :key="draft.id"
          class="group flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-slate-50/80"
          @click="emit('select', draft)">
          <!-- 左側：內文資訊 -->
          <div class="min-w-0 flex-1 pr-4">
            <div class="mb-1 flex items-center space-x-2">
              <h4
                class="group-hover:text-brand-success-400 truncate text-base font-semibold text-gray-900 transition-colors">
                {{ draft.title || '（未命名文章）' }}
              </h4>
              <span
                v-if="draft.categoryName"
                class="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                {{ draft.categoryName }}
              </span>
            </div>
            <p class="truncate text-sm text-gray-500">
              {{ truncateText(draft.content) }}
            </p>
            <span class="mt-1 block text-xs text-gray-400">
              最後修改：{{ draft.updatedAt || '剛剛' }}
            </span>
          </div>

          <!-- 右側：獨立刪除按鈕（阻止冒泡免得觸發點擊載入） -->
          <button
            @click.stop="emit('delete', draft.articleId)"
            class="rounded-xl p-2.5 text-gray-400 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500">
            <Trash2 class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
