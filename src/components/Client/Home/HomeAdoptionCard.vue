<script setup>
import { Dog, ChevronRight } from 'lucide-vue-next'

defineProps({
  adoptionPets: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <div
    class="card-feature group rounded-3xl border-4 border-[#445944] bg-white p-6 shadow-[6px_6px_0px_#445944] transition-all hover:-translate-y-1 hover:shadow-[10px_10px_0px_#445944] md:p-8">
    <div class="mb-6 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] p-3 text-[#445944]">
          <Dog :size="28" />
        </div>
        <div>
          <h3 class="text-2xl font-extrabold text-[#445944]">領養狗狗</h3>
          <p class="text-xs text-gray-500">尋找命定毛孩夥伴</p>
        </div>
      </div>
      <router-link
        to="/adopt"
        class="flex items-center gap-1 text-sm font-bold text-[#445944] hover:underline">
        查看全部
        <ChevronRight :size="16" />
      </router-link>
    </div>

    <div class="mb-6 grid grid-cols-2 gap-4">
      <div
        v-for="pet in adoptionPets.slice(0, 2)"
        :key="pet.id"
        class="sub-pet-card overflow-hidden rounded-2xl border-2 border-[#445944] bg-[#FDF9F3] transition-transform hover:scale-[1.02]">
        <div class="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <img :src="pet.imageUrl" :alt="pet.name" class="h-full w-full object-cover" />
          <span
            class="absolute top-2 left-2 rounded-full bg-[#9C6D6D] px-2 py-0.5 text-[10px] font-bold text-white">
            {{ pet.nickname }}
          </span>
        </div>
        <div class="bg-[#FCF4E5] p-3">
          <div class="mb-1 flex items-center justify-between">
            <h4 class="truncate text-base font-bold">{{ pet.name }}</h4>
            <span
              v-if="pet.gender === 'male'"
              class="ml-1 inline-flex shrink-0 text-[#3b82f6]"
              title="男生">
              <svg
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2.5">
                <circle cx="10" cy="14" r="5" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M14 10l6-6M15 4h5v5" />
              </svg>
            </span>
            <span v-else class="ml-1 inline-flex shrink-0 text-[#ec4899]" title="女生">
              <svg
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2.5">
                <circle cx="12" cy="9" r="5" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 14v7M9 18h6" />
              </svg>
            </span>
          </div>
          <p class="truncate text-xs text-gray-500">{{ pet.breed }} • {{ pet.age }} 歲</p>
        </div>
      </div>
    </div>

    <div class="flex gap-3">
      <router-link
        to="/adopt"
        class="text-theme-lg flex-1 rounded-xl border-2 border-[#445944] bg-[#445944] py-3 text-center font-bold text-white transition-all hover:translate-x-[1px] hover:translate-y-[1px]">
        🐾 給牠一個溫暖的家
      </router-link>
      <router-link
        to="/adopt/create"
        class="text-theme-lg rounded-xl border-2 border-[#445944] bg-[#FCF4E5] px-4 py-3 text-center font-bold text-[#445944] transition-all hover:translate-x-[1px] hover:translate-y-[1px]">
        刊登送養
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.card-feature {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.sub-pet-card {
  transition:
    transform 0.2s ease,
    border-color 0.2s ease;
}

.sub-pet-card:hover {
  border-color: #445944;
}
</style>
