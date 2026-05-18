<script setup>
import { Eye, Heart, Clock } from 'lucide-vue-next'
</script>

<template>
  <div class="flex h-72 w-64 flex-col gap-4 rounded-lg border border-stone-300 bg-white">
    <!-- 上方圖片 -->
    <div class="relative h-48 shrink-0 overflow-hidden rounded-t-lg bg-gray-100">
      <span
        class="absolute top-2 left-2 rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-medium tracking-wider text-stone-600 shadow-sm">
        分類
      </span>
      <img
        src="https://placecats.com/500/500"
        alt="熱門文章圖片"
        class="h-full w-full object-cover" />
    </div>
    <!-- 下方文字 -->
    <div class="px-4">
      <!-- 分類+文章標題 -->
      <div class="flex items-center gap-2">
        <span class="border border-stone-200 px-2 py-0.5 text-sm">分類</span>
        <h3 class="line-clamp-1 text-lg font-semibold text-[#433D3C]">熱門文章標題</h3>
      </div>
      <!-- 文章資訊 -->
      <div class="mt-auto flex gap-4">
        <div class="flex items-center gap-1">
          <Eye :size="14" :stroke-width="1.5" class="text-stone-400" />
          <p class="text-[11px] text-stone-500">1,234</p>
        </div>
        <div class="flex items-center gap-1">
          <Heart :size="14" :stroke-width="1.5" class="text-stone-400" />
          <p class="text-[11px] text-stone-500">567</p>
        </div>
        <div class="flex items-center gap-1">
          <Clock :size="14" :stroke-width="1.5" class="text-stone-400" />
          <p class="text-[11px] text-stone-500">2026.05.11</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
