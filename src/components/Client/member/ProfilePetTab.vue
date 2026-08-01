<script setup>
import { ref } from 'vue'
import { Shield, Bell, PawPrint, Plus, Activity } from 'lucide-vue-next'
import { useMemberPets } from '@/composables/Client/member/useMemberPets'
import { useMemberUtils } from '@/composables/Client/member/useMemberUtils'

const props = defineProps({
  myPets: { type: Array, default: () => [] },
  petsLoading: { type: Boolean, default: false },
})

const showHealthSummary = ref(false)

const { getHealthColor, getHealthLabel, getHealthBg } = useMemberPets()
const { formatDate } = useMemberUtils()
</script>

<template>
  <div class="space-y-5">
    <!-- 標頭 -->
    <div class="flex items-center justify-between">
      <h2 class="font-fredoka text-2xl font-black text-[#445944]">我的毛孩</h2>
      <div class="flex items-center gap-2">
        <button
          @click="showHealthSummary = !showHealthSummary"
          class="flex items-center gap-1.5 rounded-xl border-2 border-[#445944] bg-white px-4 py-2 text-sm font-bold text-[#445944] shadow-[2px_2px_0px_#445944] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-[#D4E6D0] hover:shadow-[1px_1px_0px_#445944]">
          <Shield :size="15" />
          {{ showHealthSummary ? '隱藏摘要' : '健康摘要' }}
        </button>
        <router-link
          to="/healthpassport/addpet"
          class="flex items-center gap-1.5 rounded-xl border-2 border-[#445944] bg-[#FAE4AE] px-4 py-2 text-sm font-bold text-[#445944] shadow-[2px_2px_0px_#445944] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#445944]">
          <Plus :size="15" />
          新增毛孩
        </router-link>
      </div>
    </div>

    <!-- 載入中 -->
    <div v-if="petsLoading" class="flex items-center justify-center py-16 text-[#445944]">
      <span class="animate-pulse text-sm font-bold">毛孩資料載入中...</span>
    </div>

    <template v-else>
      <!-- 健康摘要 -->
      <div
        v-show="showHealthSummary"
        class="rounded-3xl border-4 border-[#445944] p-5 shadow-[5px_5px_0px_#445944]">
        <h3 class="font-fredoka mb-4 flex items-center gap-2 text-lg font-black text-[#445944]">
          <Shield :size="20" />
          健康摘要
        </h3>
        <div class="grid grid-cols-3 divide-x-2 divide-[#445944]/30">
          <div class="flex flex-col items-center">
            <span class="text-2xl font-black text-[#445944]">{{ myPets.length }}</span>
            <span class="text-xs text-[#445944]/70">飼養數量</span>
          </div>
          <div class="flex flex-col items-center">
            <span class="text-2xl font-black text-[#445944]">
              {{ myPets.filter((p) => p.health === 'good').length }}
            </span>
            <span class="text-xs text-[#445944]/70">健康良好</span>
          </div>
          <div class="flex flex-col items-center">
            <span class="text-2xl font-black text-[#A07A3C]">
              {{ myPets.filter((p) => p.health === 'warning' || p.health === 'bad').length }}
            </span>
            <span class="text-xs text-[#445944]/70">疫苗提醒</span>
          </div>
        </div>
      </div>

      <!-- 寵物卡片 -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div
          v-for="pet in myPets"
          :key="pet.id"
          class="pet-card group relative overflow-hidden rounded-3xl border-4 border-[#445944] bg-white shadow-[5px_5px_0px_#445944] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_#445944]">
          <!-- 寵物圖片 -->
          <div class="relative aspect-[16/9] overflow-hidden bg-[#D4E6D0]">
            <img
              v-if="pet.avatar"
              :src="pet.avatar"
              :alt="pet.name"
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              @error="(e) => (e.target.style.display = 'none')" />
            <div v-else class="flex h-full w-full items-center justify-center">
              <PawPrint :size="48" class="text-[#445944]/30" />
            </div>
            <!-- 健康標籤 -->
            <span
              class="absolute top-3 right-3 rounded-full border-2 border-[#445944] px-2.5 py-0.5 text-xs font-bold shadow-[2px_2px_0px_#445944]"
              :style="{ background: getHealthBg(pet.health), color: getHealthColor(pet.health) }">
              {{ getHealthLabel(pet.health) }}
            </span>
            <!-- 性別標籤 -->
            <span
              v-if="pet.gender"
              class="absolute top-3 left-3 rounded-full border-2 border-[#445944] bg-white px-2 py-0.5 text-xs font-bold text-[#445944] shadow-[2px_2px_0px_#445944]">
              {{ pet.gender === 'male' ? '♂ 公' : '♀ 母' }}
            </span>
          </div>

          <div class="p-4">
            <div class="mb-3 flex items-center justify-between">
              <div>
                <h3 class="font-fredoka text-xl font-black text-[#445944]">{{ pet.name }}</h3>
                <p class="text-xs text-gray-500">
                  {{ pet.age }}
                  <span v-if="pet.weight">· {{ pet.weight }} kg</span>
                  <span v-if="pet.isDesex !== null">
                    · {{ pet.isDesex ? '已絕育' : '未絕育' }}
                  </span>
                </p>
              </div>
              <router-link
                to="/healthpassport"
                class="flex items-center gap-1 rounded-xl border-2 border-[#445944] bg-[#D4E6D0] px-2.5 py-1.5 text-xs font-bold text-[#445944] shadow-[2px_2px_0px_#445944] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#445944]">
                <Activity :size="12" />
                護照
              </router-link>
            </div>

            <!-- 疫苗提醒 -->
            <div
              class="flex items-center gap-2 rounded-xl border-2 border-dashed px-3 py-2 text-xs"
              :class="
                pet.nextVaccine ? 'border-[#A07A3C] bg-[#FAE4AE]/50' : 'border-gray-200 bg-gray-50'
              ">
              <Bell
                :size="13"
                class="shrink-0"
                :class="pet.nextVaccine ? 'text-[#A07A3C]' : 'text-gray-300'" />
              <span :class="pet.nextVaccine ? 'text-[#7A5A20]' : 'text-gray-400'">
                {{
                  pet.nextVaccine
                    ? `下次疫苗：${formatDate(pet.nextVaccine)}`
                    : '無疫苗提醒'
                }}
              </span>
            </div>
          </div>
        </div>

        <!-- 新增毛孩佔位卡 -->
        <router-link
          to="/healthpassport/addpet"
          class="group flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-3xl border-4 border-dashed border-[#445944] bg-[#FCF4E5] transition-all hover:bg-[#D4E6D0]/30">
          <div
            class="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[#445944] bg-[#FAE4AE] shadow-[3px_3px_0px_#445944] transition-all group-hover:scale-110">
            <Plus :size="24" class="text-[#445944]" />
          </div>
          <p class="text-sm font-bold text-gray-500 group-hover:text-[#445944]">新增毛孩</p>
        </router-link>
      </div>
    </template>
  </div>
</template>

<style scoped>
.pet-card {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
</style>
