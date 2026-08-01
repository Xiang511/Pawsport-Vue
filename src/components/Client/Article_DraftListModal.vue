<script setup>
import { Trash2, Inbox, X } from 'lucide-vue-next'
import { useDateTime } from '@/composables/Client/useDateTime'

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
    class="font-fredoka fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
    <!-- 彈窗本體 -->
    <div
      class="w-full max-w-xl transform cursor-default overflow-hidden rounded-3xl border-4 border-[#445944] bg-white shadow-[8px_8px_0px_#445944] transition-all">
      <!-- 頂部標題列 -->
      <div
        class="flex items-center justify-between border-b-4 border-[#445944] bg-[#FCF4E5] px-6 py-4">
        <div class="flex items-center space-x-2">
          <h3 class="text-lg font-black text-[#445944]">📁 我的草稿匣</h3>
        </div>
        <!-- 關閉按鈕 -->
        <button
          @click="emit('update:modelValue', false)"
          class="rounded-xl border-2 border-[#445944] bg-white p-1 text-[#445944] shadow-[2px_2px_0px_#445944] transition-all hover:bg-red-100 hover:text-red-500 active:translate-y-[1px] active:shadow-[1px_1px_0px_#445944]">
          <X class="h-5 w-5 stroke-[3]" />
        </button>
      </div>

      <!-- 草稿清單區 -->
      <div class="max-h-96 space-y-4 overflow-y-auto bg-[#FDF9F3] p-6">
        <!-- 沒草稿時的狀態 -->
        <div
          v-if="drafts.length === 0"
          class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#445944]/30 bg-white py-12 text-[#445944]/50">
          <Inbox class="mb-2 h-12 w-12 stroke-[1.5]" />
          <p class="text-xs font-black">您的草稿匣空空如也 🐾</p>
        </div>

        <!-- 草稿卡片項目 -->
        <div
          v-for="draft in drafts"
          :key="getDraftId(draft)"
          class="group flex cursor-pointer items-center justify-between rounded-2xl border-2 border-[#445944] bg-white p-4 shadow-[3px_3px_0px_#445944] transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#445944]"
          @click="selectDraft(draft)">
          <!-- 左側：內文資訊 -->
          <div class="min-w-0 flex-1 pr-4">
            <div class="mb-1.5 flex flex-wrap items-center gap-2">
              <h4 class="truncate text-base font-black text-[#445944] transition-colors">
                {{ draft.title || '（無標題草稿）' }}
              </h4>
              <span
                v-if="draft.categoryName"
                class="rounded-lg border-2 border-[#445944] bg-[#FCF4E5] px-2 py-0.5 text-xs font-black text-[#445944] shadow-[1px_1px_0px_#445944]">
                {{ draft.categoryName }}
              </span>
            </div>

            <p class="mb-1 truncate text-xs font-bold text-gray-500">
              {{ draft.summary || '點擊載入此篇草稿以繼續編寫...' }}
            </p>

            <span class="block text-[10px] font-black text-[#445944]/65">
              最後修改：{{ formatLocalDate(draft.lastEditTime) }} ({{
                timeAgo(draft.lastEditTime)
              }})
            </span>
          </div>

          <!-- 右側：獨立刪除按鈕（阻止冒泡免得觸發點擊載入） -->
          <button
            @click.stop="deleteDraft(draft)"
            class="shrink-0 rounded-xl border-2 border-transparent p-2 text-gray-400 transition-all hover:border-red-500 hover:bg-red-50 hover:text-red-500"
            title="刪除草稿">
            <Trash2 class="h-5 w-5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
