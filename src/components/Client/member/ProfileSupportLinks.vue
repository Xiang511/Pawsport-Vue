<script setup>
import { HeadphonesIcon, ChevronRight } from 'lucide-vue-next'
import { supportLinks } from '@/constants/member/profileLinks'
</script>

<template>
  <div
    class="rounded-3xl border-4 border-[#445944] bg-[#FCF4E5] p-5 shadow-[5px_5px_0px_#445944]">
    <h3 class="font-fredoka mb-4 flex items-center gap-2 text-lg font-black text-[#445944]">
      <HeadphonesIcon :size="18" />
      客服 &amp; 支援
    </h3>
    <div class="space-y-3">
      <router-link
        v-for="link in supportLinks"
        :key="link.label"
        :to="link.route"
        class="group flex items-center gap-3 rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] px-4 py-3 transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-[#445944]/30 hover:shadow-[2px_2px_0px_#445944]">
        <div
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-[#445944] bg-[#FCF4E5] shadow-[2px_2px_0px_#445944] transition-all group-hover:shadow-none">
          <component :is="link.icon" :size="16" class="text-[#445944]" />
        </div>
        <div class="min-w-0 flex-1">
          <div class="text-sm font-bold text-[#445944]">{{ link.label }}</div>
          <div class="truncate text-xs text-[#445944]">{{ link.desc }}</div>
        </div>
        <ChevronRight
          :size="14"
          class="shrink-0 text-gray-400 transition-transform group-hover:translate-x-1" />
      </router-link>
    </div>
  </div>
</template>
