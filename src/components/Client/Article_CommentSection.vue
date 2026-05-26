<script setup>
import { MessageSquare } from 'lucide-vue-next'
import { useDateTime } from '@/composables/useDateTime'

defineProps({
  comments: {
    type: Array,
    default: () => [],
  },
  commentText: {
    type: String,
    default: '',
  },
  isCommentLoading: {
    type: Boolean,
    default: false,
  },
  isCommentError: {
    type: Boolean,
    default: false,
  },
  isSubmittingComment: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:commentText', 'submit-comment'])

const { formatLocalDate } = useDateTime()

const updateCommentText = (event) => {
  emit('update:commentText', event.target.value)
}
</script>

<template>
  <section class="mt-6 space-y-4">
    <!-- 留言標題 -->
    <div class="flex items-center justify-between px-2">
      <h3 class="flex items-center gap-2 text-lg font-bold text-slate-800">
        <MessageSquare class="text-brand-success-600 h-5 w-5" />
        全部回覆
        <span class="text-sm font-medium text-slate-400">({{ comments.length }})</span>
      </h3>

      <select
        class="focus:border-brand-success-400 focus:ring-brand-success-600/10 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 transition outline-none focus:ring-2">
        <option>最新優先</option>
        <option>熱門排序</option>
      </select>
    </div>

    <!-- 留言輸入框 -->
    <div class="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
      <div class="flex items-start gap-3">
        <img
          src="https://placecats.com/g/50/50"
          alt="目前使用者"
          class="h-10 w-10 shrink-0 rounded-full object-cover" />

        <div class="flex-1">
          <textarea
            :value="commentText"
            @input="updateCommentText"
            rows="3"
            maxlength="300"
            placeholder="留下你的想法吧..."
            class="focus:border-brand-success-400 focus:ring-brand-success-600/10 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition outline-none placeholder:text-slate-400 focus:bg-white focus:ring-2"></textarea>

          <div class="mt-3 flex items-center justify-between">
            <span class="text-xs text-slate-400">{{ commentText.length }} / 300</span>

            <button
              type="button"
              @click="emit('submit-comment')"
              :disabled="commentText.trim().length === 0 || isSubmittingComment"
              class="bg-brand-success-600 hover:bg-brand-success-700 rounded-full px-5 py-2 text-sm font-medium text-white shadow-sm transition disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none">
              {{ isSubmittingComment ? '送出中...' : '送出留言' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 留言列表 -->
    <div
      v-if="isCommentLoading"
      class="rounded-xl bg-white py-8 text-center text-sm text-slate-400">
      留言讀取中...
    </div>

    <div
      v-else-if="isCommentError"
      class="rounded-xl bg-white py-8 text-center text-sm text-red-400">
      留言載入失敗
    </div>

    <div v-else-if="comments.length > 0" class="space-y-3">
      <div
        v-for="(comment, index) in comments"
        :key="comment.commentId"
        class="hover:border-brand-success-600/20 rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md">
        <div class="flex items-start gap-4">
          <img
            :src="comment.userPhoto || 'https://placecats.com/g/50/50'"
            class="h-10 w-10 shrink-0 rounded-full object-cover" />

          <div class="min-w-0 flex-1">
            <div class="mb-1 flex flex-wrap items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <span class="text-sm font-bold text-slate-700">
                  {{ comment.userName }}
                </span>

                <span
                  class="bg-brand-success-600/10 text-brand-success-700 rounded-full px-2 py-0.5 text-xs font-medium">
                  B{{ index + 1 }}
                </span>
              </div>

              <span class="text-xs text-slate-400">
                {{ formatLocalDate(comment.createAt) }}
              </span>
            </div>

            <p class="text-sm leading-relaxed whitespace-pre-line text-slate-600">
              {{ comment.content }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div
      v-else
      class="rounded-xl border border-dashed border-slate-200 bg-white py-10 text-center text-sm text-slate-400">
      目前還沒有留言，成為第一個回覆的人吧！
    </div>
  </section>
</template>
