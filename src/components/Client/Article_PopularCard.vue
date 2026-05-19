<script setup>
import { Eye, Heart, Clock } from 'lucide-vue-next'
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

defineProps({
  category: {
    type: String,
    default: '未分類',
  },
  title: {
    type: String,
    required: true, // 標題通常是必填
  },
  imageUrl: {
    type: String,
    default: 'https://placecats.com/500/500', // 預設圖片
  },
  views: {
    type: [Number, String],
    default: 0,
  },
  likes: {
    type: [Number, String],
    default: 0,
  },
  date: {
    type: String,
    default: '',
  },
})

// 格式化數字的輔助函式（例如：1234 -> 1,234）
const formatNumber = (num) => {
  if (!num) return 0
  return Number(num).toLocaleString()
}
</script>

<template>
  <div class="flex h-72 w-64 flex-col gap-4 rounded-lg border border-stone-300 bg-white">
    <!-- 上方圖片 -->
    <div class="relative h-48 shrink-0 overflow-hidden rounded-t-lg bg-gray-100">
      <span
        class="absolute top-2 left-2 rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-medium tracking-wider text-stone-600 shadow-sm">
        {{ category }}
      </span>
      <img :src="imageUrl" :alt="title" class="h-full w-full object-cover" />
    </div>
    <!-- 下方文字 -->
    <div class="flex flex-1 flex-col px-4 pb-4">
      <!-- 分類+文章標題 -->
      <div class="flex items-center gap-2">
        <span class="border border-stone-200 px-2 py-0.5 text-sm">分類</span>
        <h3 class="line-clamp-1 text-lg font-semibold text-[#433D3C]">{{ title }}</h3>
      </div>
      <!-- 文章資訊 -->
      <div class="mt-auto flex gap-4">
        <div class="flex items-center gap-1">
          <Eye :size="14" :stroke-width="1.5" class="text-stone-400" />
          <p class="text-[11px] text-stone-500">{{ formatNumber(views) }}</p>
        </div>
        <div class="flex items-center gap-1">
          <Heart :size="14" :stroke-width="1.5" class="text-stone-400" />
          <p class="text-[11px] text-stone-500">{{ formatNumber(likes) }}</p>
        </div>
        <div class="flex items-center gap-1">
          <Clock :size="14" :stroke-width="1.5" class="text-stone-400" />
          <p class="text-[11px] text-stone-500">{{ date }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
