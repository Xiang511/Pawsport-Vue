<script setup>
import { Trash2, Inbox, X } from 'lucide-vue-next'
import { useDateTime } from '@/composables/useDateTime'

defineProps({
  modelValue: { type: Boolean, default: false },
  drafts: { type: Array, default: () => [] },
})
const emit = defineEmits(['update:modelValue', 'select', 'delete'])
const { formatLocalDate, timeAgo } = useDateTime()

const getDraftId = (draft) => {
  return draft.articleId ?? draft.ArticleId ?? draft.articleID ?? draft.id ?? draft.Id
}

const selectDraft = (draft) => {
  const id = getDraftId(draft)

  if (!id) {
    console.warn('草稿缺少文章 ID：', draft)
    return
  }

  emit('select', id)
}

const deleteDraft = (draft) => {
  const id = getDraftId(draft)

  if (!id) {
    console.warn('草稿缺少文章 ID，無法刪除：', draft)
    return
  }

  emit('delete', id)
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
          <X class="h-5 w-5 stroke-2" />
        </button>
      </div>

      <!-- 草稿清單區 -->
      <div class="max-h-100 divide-y divide-gray-100 overflow-y-auto">
        <!-- 沒草稿時的狀態 -->
        <div
          v-if="drafts.length === 0"
          class="flex flex-col items-center justify-center py-12 text-gray-400">
          <Inbox class="mb-2 h-12 w-12 stroke-1" />
          <p class="text-sm">目前沒有任何草稿</p>
        </div>

        <!-- 草稿卡片項目 -->
        <div
          v-for="draft in drafts"
          :key="getDraftId(draft)"
          class="group flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-slate-50/80"
          @click="selectDraft(draft)">
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
              {{ draft.summary || '無內文...' }}
            </p>
            <span class="mt-1 block text-xs text-gray-400">
              最後修改：{{ formatLocalDate(draft.lastEditTime) }} ({{
                timeAgo(draft.lastEditTime)
              }})
            </span>
          </div>

          <!-- 右側：獨立刪除按鈕（阻止冒泡免得觸發點擊載入） -->
          <button
            @click.stop="deleteDraft(draft)"
            class="rounded-xl p-2.5 text-gray-400 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500">
            <Trash2 class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
