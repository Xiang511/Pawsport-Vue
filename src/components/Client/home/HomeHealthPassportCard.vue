<script setup>
import { ref } from 'vue'
import { Activity, ChevronRight, CheckCircle } from 'lucide-vue-next'

const vaccines = ref([
  { id: 1, name: '狂犬病疫苗', status: true },
  { id: 2, name: '貓狗核心疫苗 (DHPP/五合一)', status: true },
  { id: 3, name: '心絲蟲預防藥投藥', status: false },
  { id: 4, name: '體外寄生蟲驅蟲', status: false },
])

const toggleVaccine = (index) => {
  vaccines.value[index].status = !vaccines.value[index].status
}
</script>

<template>
  <div
    class="card-feature group border-brand-success-950 rounded-3xl border-4 bg-white p-6 shadow-[6px_6px_0px_#445944] transition-all hover:-translate-y-1 hover:shadow-[10px_10px_0px_#445944] md:p-8">
    <div class="mb-6 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div
          class="text-brand-success-950 border-brand-success-950 rounded-2xl border-2 bg-[#FCF4E5] p-3">
          <Activity :size="28" />
        </div>
        <div>
          <h3 class="text-2xl font-extrabold text-[#445944]">健康護照</h3>
          <p class="text-xs text-gray-500">科學化記錄愛寵健康成長</p>
        </div>
      </div>
      <router-link
        to="/healthpassport"
        class="flex items-center gap-1 text-sm font-bold text-[#445944] hover:underline">
        開啟護照
        <ChevronRight :size="16" />
      </router-link>
    </div>

    <div class="mb-6 rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] p-4">
      <div class="mb-3 flex items-center justify-between">
        <span class="text-xs font-black text-gray-500">愛寵體重追蹤曲線 (kg)</span>
        <span
          class="bg-brand-success-500 rounded-full px-2 py-0.5 text-[10px] font-bold text-white">
          狀態良好
        </span>
      </div>
      <div
        class="relative flex h-24 w-full items-end overflow-hidden rounded-xl border border-gray-200 bg-white p-2">
        <svg viewBox="0 0 300 80" class="h-full w-full">
          <defs>
            <linearGradient id="gradientWeight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#83aeba" stop-opacity="0.4" />
              <stop offset="100%" stop-color="#83aeba" stop-opacity="0.0" />
            </linearGradient>
          </defs>
          <line x1="0" y1="20" x2="300" y2="20" stroke="#f1f1f1" stroke-dasharray="3,3" />
          <line x1="0" y1="40" x2="300" y2="40" stroke="#f1f1f1" stroke-dasharray="3,3" />
          <line x1="0" y1="60" x2="300" y2="60" stroke="#f1f1f1" stroke-dasharray="3,3" />
          <path
            d="M 10 70 L 10 50 Q 80 35 150 42 T 290 20 L 290 70 Z"
            fill="url(#gradientWeight)" />
          <path
            d="M 10 50 Q 80 35 150 42 T 290 20"
            fill="none"
            stroke="#83aeba"
            stroke-width="3" />
          <circle cx="10" cy="50" r="4" fill="#4f6970" />
          <circle cx="80" cy="41" r="4" fill="#4f6970" />
          <circle cx="150" cy="42" r="4" fill="#4f6970" />
          <circle cx="220" cy="27" r="4" fill="#4f6970" />
          <circle cx="290" cy="20" r="5" fill="#9C6D6D" stroke="white" stroke-width="2" />
          <text x="8" y="40" font-size="8" font-weight="bold">8.2</text>
          <text x="145" y="32" font-size="8" font-weight="bold">8.9</text>
          <text x="282" y="12" font-size="8" font-weight="bold" fill="#9C6D6D">9.5 kg</text>
        </svg>
      </div>

      <div class="mt-4 grid grid-cols-2 gap-2">
        <div
          v-for="(v, index) in vaccines"
          :key="v.id"
          @click="toggleVaccine(index)"
          class="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white p-2 transition-colors select-none hover:bg-gray-50">
          <div
            class="flex h-5 w-5 items-center justify-center rounded-full border-2 border-black"
            :class="v.status ? 'bg-[#83aeba] text-white' : 'bg-white'">
            <CheckCircle v-if="v.status" :size="12" />
          </div>
          <span class="truncate text-[11px] font-bold text-gray-700">{{ v.name }}</span>
        </div>
      </div>
    </div>

    <router-link
      to="/healthpassport"
      class="text-theme-lg block w-full rounded-xl border-2 border-[#445944] bg-[#445944] py-3 text-center font-bold text-white transition-all hover:translate-x-[1px] hover:translate-y-[1px]">
      📊 開啟專屬健康檔案
    </router-link>
  </div>
</template>

<style scoped>
.card-feature {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
</style>
