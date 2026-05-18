<script setup>
import { Eye, Heart, Clock } from 'lucide-vue-next'
</script>

<template>
  <div class="flex w-75 gap-4 rounded-md border border-stone-100 bg-white p-5">
    <!-- 左邊圖片 -->
    <div class="flex flex-col gap-2">
      <div class="relative h-24 w-32 shrink-0 overflow-hidden rounded-md bg-gray-200">
        <span
          class="absolute top-2 left-2 rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-medium tracking-wider text-stone-600 shadow-sm">
          分類
        </span>
        <img
          src="https://placecats.com/500/500"
          alt="熱門文章圖片"
          class="h-full w-full object-cover" />
      </div>
      <div class="flex items-center gap-1">
        <Clock :size="14" :stroke-width="1.5" class="text-stone-400" />
        <p class="text-[11px] text-stone-500">2026.05.11</p>
      </div>
    </div>
    <!-- 右邊內容 -->
    <div class="flex min-w-0 flex-col gap-2">
      <div class="border-b border-stone-300 pb-1">
        <h3 class="line-clamp-1 text-base font-semibold text-[#433D3C]">熱門文章標題</h3>
        <p class="text-xs text-stone-400">作者名稱</p>
      </div>
      <div class="text-sm leading-relaxed text-stone-500">
        <p class="line-clamp-2">
          熱門文章摘要熱門文章摘要熱門文章摘要熱門文章摘要熱門文章摘要熱門文章摘要熱門文章摘要
        </p>
      </div>
      <div class="mt-auto flex gap-4">
        <div class="flex items-center gap-1">
          <Eye :size="14" :stroke-width="1.5" class="text-stone-400" />
          <p class="text-[11px] text-stone-500">1,234</p>
        </div>
        <div class="flex items-center gap-1">
          <Heart :size="14" :stroke-width="1.5" class="text-stone-400" />
          <p class="text-[11px] text-stone-500">567</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
