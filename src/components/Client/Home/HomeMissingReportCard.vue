<script setup>
import { AlertTriangle, ChevronRight, Clock, MapPin } from 'lucide-vue-next'

defineProps({
  missingPets: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <div
    class="card-feature group border-brand-success-950 rounded-3xl border-4 bg-white p-6 shadow-[6px_6px_0px_#445944] transition-all hover:-translate-y-1 hover:shadow-[10px_10px_0px_#445944] md:p-8">
    <div class="mb-6 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div
          class="animate-pulse-slow rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] p-3 text-[#445944]">
          <AlertTriangle :size="28" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h3 class="text-2xl font-extrabold text-[#445944]">遺失協尋</h3>
            <span class="inline-flex h-2.5 w-2.5 animate-ping rounded-full bg-red-600"></span>
          </div>
          <p class="text-xs text-gray-500">守護防線，帶迷路寶貝回家</p>
        </div>
      </div>
      <router-link
        to="/missingreport"
        class="flex items-center gap-1 text-sm font-bold text-[#445944] hover:underline">
        查看協尋
        <ChevronRight :size="16" />
      </router-link>
    </div>

    <div class="mb-6 space-y-4">
      <div
        v-for="pet in missingPets"
        :key="pet.id"
        class="relative flex items-center gap-4 rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] p-3">
        <div class="h-22 w-22 shrink-0 overflow-hidden rounded-xl border-2 border-[#445944]">
          <img :src="pet.photo" :alt="pet.breed" class="h-full w-full object-cover" />
        </div>
        <div class="min-w-0 flex-1">
          <div class="flex items-center justify-between">
            <span
              class="rounded border border-red-300 bg-red-100 px-2 py-0.5 text-xs font-black text-red-600">
              緊急協尋中
            </span>
            <span class="flex items-center gap-0.5 text-[10px] text-gray-400">
              <Clock :size="10" />
              {{ pet.lostTime }}
            </span>
          </div>
          <h4 class="mt-1 truncate text-sm font-bold text-[#445944]">
            {{ pet.breed }} ({{ pet.gender }})
          </h4>
          <p class="flex items-center gap-0.5 truncate text-[11px] text-gray-500">
            <MapPin :size="10" />
            {{ pet.lostPlace }}
          </p>
        </div>
      </div>
    </div>

    <div class="flex gap-3">
      <router-link
        to="/missingreport"
        class="text-theme-lg flex-1 rounded-xl bg-[#445944] py-3 text-center font-bold text-white transition-all hover:translate-x-[1px] hover:translate-y-[1px]">
        🚨 我有協尋線索
      </router-link>
      <router-link
        to="/missingreport/create"
        class="text-theme-lg rounded-xl border-2 border-[#445944] bg-[#FCF4E5] px-4 py-3 text-center font-bold text-[#445944] transition-all hover:translate-x-[1px] hover:translate-y-[1px]">
        刊登協尋啟事
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.card-feature {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.animate-pulse-slow {
  animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse-slow {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.9;
    transform: scale(0.98);
  }
}
</style>
