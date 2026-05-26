<script setup>
import { computed } from 'vue'
import { Eye, Heart, MessageSquare } from 'lucide-vue-next'
import { useDateTime } from '@/composables/useDateTime'

const { formatLocalDate, timeAgo } = useDateTime()

//defineProps用在顯示唯讀的資料
const props = defineProps({
  id: [Number, String],
  title: { type: String, required: true },
  summary: { type: String, default: '這篇文章沒有摘要' },
  author: { type: String, default: '未知作者' },
  date: { type: String, default: '' }, // 建議格式: "2026-05-13 10:30"
  image: { type: String, default: 'https://placehold.co/400x260' },
  categoryid: { type: Number, default: 0 },
  category: { type: String, default: '未分類' },
  tags: { type: Array, default: () => [] },
  viewCount: { type: Number, default: 0 },
  bookmarkCount: { type: Number, default: 0 },
  isBookmarked: { type: Boolean, default: false },
  commentCount: { type: Number, default: 0 },
})

const emit = defineEmits(['toggle-bookmark', 'click-card', 'click-tag'])

const displayDate = computed(() => {
  if (!props.date) return '近期發表'
  return timeAgo(props.date)
})

const fullDate = computed(() => {
  if (!props.date) return '近期發表'
  return formatLocalDate(props.date)
})

const handleCardClick = () => {
  emit('click-card', props.id)
}

const handleBookmark = (e) => {
  e.stopPropagation() // 防止觸發整張卡片的點擊
  emit('toggle-bookmark', props.id)
}

const handleTagClick = (tag, e) => {
  e.stopPropagation()
  emit('click-tag', tag)
}
</script>

<template>
  <article
    class="group relative cursor-pointer border-b border-[#e8e4de] bg-white px-4 py-3 transition-colors duration-200 hover:bg-[#faf9f7]"
    @click="handleCardClick">
    <!-- Hover 左側裝飾線 -->
    <div
      class="pointer-events-none absolute inset-y-0 left-0 w-1 bg-transparent transition-colors duration-200 group-hover:bg-[#d4a373]"></div>

    <div class="flex items-center gap-5">
      <!-- 區塊 A：分類 / 收藏數 -->
      <aside class="hidden w-20 shrink-0 border-r border-stone-100 text-center md:block">
        <div
          class="truncate text-[13px] text-stone-400"
          :title="category"
          :data-category="categoryid">
          {{ category }}
        </div>

        <div class="mt-1 text-lg font-bold text-[#d4a373]">
          {{ bookmarkCount }}
        </div>
      </aside>

      <!-- 區塊 B：縮圖，維持原本 110x70 -->
      <div class="h-[70px] w-[110px] shrink-0 overflow-hidden rounded bg-stone-100">
        <img
          :src="image || 'https://placehold.co/400x260'"
          :alt="title"
          class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
      </div>

      <!-- 區塊 C：主內容 -->
      <main class="min-w-0 flex-1">
        <!-- 標題 + 標籤 -->
        <div class="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
          <h2
            class="max-w-full truncate text-[17px] font-semibold text-stone-800 transition-colors group-hover:text-[#9c6d6d]">
            {{ title }}
          </h2>

          <button
            v-for="tag in tags.slice(0, 5)"
            :key="tag"
            type="button"
            class="max-w-[72px] truncate rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-500 transition hover:bg-amber-50 hover:text-amber-700"
            @click="handleTagClick(tag, $event)">
            #{{ tag }}
          </button>
        </div>

        <p class="mt-1 line-clamp-1 text-[13px] text-stone-500">
          {{ summary }}
        </p>

        <!-- 點閱 / 作者 / 日期：改放在文章區塊下方，跟標題左側對齊 -->
        <div class="mt-2 flex items-center gap-4 text-xs text-stone-400">
          <span class="flex items-center gap-1 font-medium text-stone-500">
            <Eye :size="14" />
            <span>{{ viewCount }}</span>
          </span>
          <span class="flex items-center gap-1 font-medium text-stone-500">
            <MessageSquare :size="14" />
            <span>{{ commentCount }}</span>
          </span>

          <span class="max-w-[80px] truncate text-slate-500" :title="author">
            {{ author }}
          </span>

          <span class="whitespace-nowrap text-stone-400" :title="fullDate">
            {{ displayDate }}
          </span>
        </div>
      </main>

      <!-- 區塊 D：右側只放收藏按鈕 -->
      <footer class="hidden w-[48px] shrink-0 items-center justify-center md:flex">
        <slot name="action">
          <button
            type="button"
            class="rounded-full p-1.5 text-stone-300 transition-colors duration-200 hover:bg-rose-50 hover:text-rose-500"
            :class="isBookmarked ? 'text-rose-500' : ''"
            @click.stop="handleBookmark"
            aria-label="收藏文章">
            <Heart :size="20" :fill="isBookmarked ? 'currentColor' : 'none'" stroke-width="2" />
          </button>
        </slot>
      </footer>
    </div>
  </article>
</template>

<style scoped></style>
