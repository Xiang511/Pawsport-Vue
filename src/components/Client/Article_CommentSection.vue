<script setup>
import { MessageSquare } from 'lucide-vue-next'
import { useDateTime } from '@/composables/Client/useDateTime'

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
  <section class="font-fredoka mt-6 space-y-4">
    <!-- 留言標題 -->
    <div class="flex items-center justify-between px-2">
      <h3 class="flex items-center gap-2 text-lg font-black text-[#445944]">
        <MessageSquare class="animate-bounce-slow h-5 w-5 text-amber-500" />
        全部回覆
        <span
          class="rounded-lg border-2 border-[#445944] bg-[#445944] px-2.5 py-0.5 text-xs font-black text-white shadow-[1px_1px_0px_#445944]">
          {{ comments.length }}
        </span>
      </h3>

      <select
        class="cursor-pointer rounded-xl border-2 border-[#445944] bg-[#FCF4E5] px-3.5 py-1.5 text-xs font-black text-[#445944] shadow-[2px_2px_0px_#445944] focus:outline-none">
        <option>最新優先</option>
        <option>熱門排序</option>
      </select>
    </div>

    <!-- 留言輸入框 -->
    <div class="rounded-3xl border-4 border-[#445944] bg-white p-5 shadow-[6px_6px_0px_#445944]">
      <div class="flex items-start gap-4">
        <img
          src="https://placecats.com/g/50/50"
          alt="目前使用者"
          class="h-10 w-10 shrink-0 rounded-full border-2 border-[#445944] object-cover" />

        <div class="flex-1">
          <textarea
            :value="commentText"
            @input="updateCommentText"
            rows="3"
            maxlength="300"
            placeholder="留下你的溫馨想法吧... ✏️"
            class="w-full resize-none rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] px-4 py-3 text-sm font-bold text-gray-800 placeholder-gray-400 shadow-[2px_2px_0px_#445944] transition-all focus:border-[#445944] focus:bg-white focus:ring-0 focus:outline-none"></textarea>

          <div class="mt-3 flex items-center justify-between">
            <span
              class="rounded-lg border border-[#445944]/20 bg-white px-2.5 py-0.5 text-xs font-black text-[#445944]/65">
              {{ commentText.length }} / 300
            </span>

            <button
              type="button"
              @click="emit('submit-comment')"
              :disabled="commentText.trim().length === 0 || isSubmittingComment"
              class="rounded-2xl border-2 border-[#445944] px-5 py-2 text-sm font-black shadow-[3px_3px_0px_#445944] transition-all disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
              :class="[
                commentText.trim().length === 0 || isSubmittingComment
                  ? 'bg-gray-200 text-gray-400'
                  : 'bg-amber-400 text-[#445944] hover:bg-[#445944] hover:text-white active:translate-y-[1px] active:shadow-[1px_1px_0px_#445944]',
              ]">
              {{ isSubmittingComment ? '送出中...' : '送出留言' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 留言列表 -->
    <div
      v-if="isCommentLoading"
      class="animate-pulse rounded-3xl border-2 border-dashed border-[#445944]/30 bg-white py-12 text-center text-sm font-black text-[#445944]">
      ⏳ 正在尋找大家的想法中...
    </div>

    <div
      v-else-if="isCommentError"
      class="rounded-3xl border-2 border-dashed border-[#445944]/30 bg-white py-12 text-center text-sm font-black text-red-500">
      ❌ 留言載入失敗，請稍後再試。
    </div>

    <div v-else-if="comments.length > 0" class="space-y-4">
      <div
        v-for="(comment, index) in comments"
        :key="comment.commentId"
        class="rounded-3xl border-4 border-[#445944] bg-white p-5 shadow-[4px_4px_0px_#445944] transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#445944]">
        <div class="flex items-start gap-4">
          <img
            :src="comment.userPhoto || 'https://placecats.com/g/50/50'"
            class="h-10 w-10 shrink-0 rounded-full border-2 border-[#445944] object-cover" />

          <div class="min-w-0 flex-1">
            <div class="mb-2 flex flex-wrap items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <span class="text-sm font-black text-[#445944]">
                  {{ comment.userName }}
                </span>

                <span
                  class="rounded-xl border-2 border-[#445944] bg-[#FCF4E5] px-2.5 py-0.5 text-xs font-black text-[#445944] shadow-[1px_1px_0px_#445944]">
                  B{{ index + 1 }}
                </span>
              </div>

              <span class="text-xs font-bold text-gray-400">
                {{ formatLocalDate(comment.createAt) }}
              </span>
            </div>

            <p class="text-sm leading-relaxed font-bold whitespace-pre-line text-gray-700">
              {{ comment.content }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div
      v-else
      class="rounded-3xl border-2 border-dashed border-[#445944]/30 bg-white py-12 text-center text-sm font-bold text-gray-400">
      🐾 目前還沒有回覆，快來成為第一個留下溫馨想法的人吧！
    </div>
  </section>
</template>

<style scoped>
.animate-bounce-slow {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}
</style>
