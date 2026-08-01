<script setup>
import { Zap } from 'lucide-vue-next'
import { quickLinks } from '@/constants/member/profileLinks'
</script>

<template>
  <div
    class="rounded-3xl border-4 border-[#445944] bg-[#FCF4E5] p-5 shadow-[5px_5px_0px_#445944]">
    <h3 class="font-fredoka mb-4 flex items-center gap-2 text-lg font-black text-[#445944]">
      <Zap :size="18" />
      快速導覽
    </h3>
    <div class="grid grid-cols-3 gap-2">
      <router-link
        v-for="link in quickLinks"
        :key="link.label"
        :to="link.route"
        class="quick-link flex flex-col items-center gap-1.5 rounded-2xl border-2 border-[#445944] p-3 text-center transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#445944]"
        :style="{ background: link.bg }">
        <component :is="link.icon" :size="20" :style="{ color: link.color }" />
        <span class="text-[11px] leading-tight font-bold" :style="{ color: link.color }">
          {{ link.label }}
        </span>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.quick-link {
  transition: all 0.2s ease;
}
</style>
