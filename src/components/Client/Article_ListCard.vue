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
    class="group relative cursor-pointer border-4 border-[#445944] bg-white p-5 rounded-3xl shadow-[5px_5px_0px_#445944] transition-all duration-300 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_#445944]"
    @click="handleCardClick">

    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
      
      <!-- 區塊 A：分類 / 收藏數 (桌機版側欄) -->
      <aside class="hidden w-20 shrink-0 border-r border-[#445944]/10 pr-2 text-center md:block">
        <div
          class="inline-block rounded-xl border-2 border-[#445944] bg-[#FCF4E5] px-2 py-0.5 text-[11px] font-black text-[#445944] shadow-[1px_1px_0px_#445944] truncate max-w-full"
          :title="category"
          :data-category="categoryid">
          {{ category }}
        </div>

        <div class="mt-2 flex flex-col items-center justify-center">
          <Heart :size="14" class="text-rose-500 fill-rose-500 mb-0.5" />
          <span class="text-sm font-black text-[#445944]">{{ bookmarkCount }}</span>
        </div>
      </aside>

      <!-- 區塊 B：縮圖，增強為立體厚框 -->
      <div class="h-[76px] w-[114px] shrink-0 overflow-hidden rounded-2xl border-2 border-[#445944] bg-stone-100 shadow-[2px_2px_0px_#445944]">
        <img
          :src="image || 'https://placehold.co/400x260'"
          :alt="title"
          class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
      </div>

      <!-- 區塊 C：主內容 -->
      <main class="min-w-0 flex-1 w-full">
        <!-- 標題 + 標籤 -->
        <div class="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1.5">
          <h2
            class="max-w-full truncate text-[17px] font-black text-[#445944] transition-colors group-hover:text-amber-600">
            {{ title }}
          </h2>

          <button
            v-for="tag in tags.slice(0, 5)"
            :key="tag"
            type="button"
            class="max-w-[80px] truncate rounded-xl border-2 border-[#445944] bg-[#FCF4E5] px-2 py-0.5 text-[10px] font-black text-[#445944] shadow-[1px_1px_0px_#445944] transition hover:bg-[#445944] hover:text-white"
            @click="handleTagClick(tag, $event)">
            <span class="text-amber-500">#</span>{{ tag }}
          </button>
        </div>

        <!-- 摘要內容 -->
        <p class="mt-1.5 line-clamp-1 text-xs font-bold text-gray-500">
          {{ summary }}
        </p>

        <!-- 點閱 / 作者 / 日期 -->
        <div class="mt-3 flex flex-wrap items-center gap-4 text-xs font-bold text-gray-400">
          <span class="flex items-center gap-1 font-black text-[#445944]">
            <Eye :size="14" class="stroke-[2.5]" />
            <span>{{ viewCount }}</span>
          </span>
          <span class="flex items-center gap-1 font-black text-[#445944]">
            <MessageSquare :size="14" class="stroke-[2.5]" />
            <span>{{ commentCount }}</span>
          </span>

          <span class="max-w-[100px] truncate text-[#445944]/80 font-black bg-[#FCF4E5] border border-[#445944]/25 px-1.5 py-0.5 rounded-lg" :title="author">
            👤 {{ author }}
          </span>

          <span class="whitespace-nowrap text-stone-400 font-bold sm:ml-auto" :title="fullDate">
            {{ displayDate }}
          </span>
        </div>
      </main>

      <!-- 區塊 D：右側收藏按鈕 -->
      <footer class="hidden w-[48px] shrink-0 items-center justify-center md:flex">
        <slot name="action">
          <button
            type="button"
            class="rounded-xl border-2 border-transparent p-2 text-stone-300 transition duration-200 hover:border-rose-500 hover:bg-rose-50 hover:text-rose-500"
            :class="isBookmarked ? 'text-rose-500' : ''"
            @click.stop="handleBookmark"
            aria-label="收藏文章">
            <Heart :size="20" :fill="isBookmarked ? 'currentColor' : 'none'" stroke-width="2.5" />
          </button>
        </slot>
      </footer>
    </div>
  </article>
</template>

<style scoped></style>
