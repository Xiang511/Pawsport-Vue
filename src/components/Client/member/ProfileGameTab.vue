<script setup>
import { Zap, Trophy, ShoppingBag, Award, Gamepad2, ChevronRight } from 'lucide-vue-next'
import { useMemberUtils } from '@/composables/Client/member/useMemberUtils'

const props = defineProps({
  gameStats: { type: Object, required: true },
})

const { formatDate } = useMemberUtils()
</script>

<template>
  <div class="space-y-5">
    <h2 class="font-fredoka text-2xl font-black text-[#445944]">遊戲概況</h2>

    <!-- 統計卡片 -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-3">
      <div
        class="game-stat-card rounded-3xl border-4 border-[#A07A3C] bg-[#FAE4AE] p-5 text-center shadow-[5px_5px_0px_#A07A3C] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_#A07A3C]">
        <div class="mb-2 flex justify-center">
          <div
            class="rounded-2xl border-2 border-[#A07A3C] bg-white p-2.5 shadow-[2px_2px_0px_#A07A3C]">
            <Zap :size="24" class="text-[#A07A3C]" />
          </div>
        </div>
        <div class="font-fredoka text-3xl font-black text-[#A07A3C]">
          {{ gameStats.points.toLocaleString() }}
        </div>
        <div class="text-sm font-bold text-[#7A5A20]">毛幣點數</div>
      </div>

      <div
        class="game-stat-card rounded-3xl border-4 border-[#9C6D6D] bg-[#9C6D6D]/15 p-5 text-center shadow-[5px_5px_0px_#9C6D6D] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_#9C6D6D]">
        <div class="mb-2 flex justify-center">
          <div
            class="rounded-2xl border-2 border-[#9C6D6D] bg-white p-2.5 shadow-[2px_2px_0px_#9C6D6D]">
            <Trophy :size="24" class="text-[#9C6D6D]" />
          </div>
        </div>
        <div class="font-fredoka text-3xl font-black text-[#9C6D6D]">
          {{ gameStats.level || 0 }}
        </div>
        <div class="text-sm font-bold text-[#7A4A4A]">最高關卡</div>
      </div>

      <div
        class="game-stat-card rounded-3xl border-4 border-[#5B7FA0] bg-[#D0E2F3] p-5 text-center shadow-[5px_5px_0px_#5B7FA0] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_#5B7FA0]">
        <div class="mb-2 flex justify-center">
          <div
            class="rounded-2xl border-2 border-[#5B7FA0] bg-white p-2.5 shadow-[2px_2px_0px_#5B7FA0]">
            <ShoppingBag :size="24" class="text-[#5B7FA0]" />
          </div>
        </div>
        <div class="font-fredoka text-3xl font-black text-[#5B7FA0]">
          {{ gameStats.skins }}
        </div>
        <div class="text-sm font-bold text-[#3A5870]">擁有造型</div>
      </div>
    </div>

    <!-- 遊戲進度卡片 -->
    <div
      class="rounded-3xl border-4 border-[#445944] bg-[#FCF4E5] p-6 shadow-[5px_5px_0px_#445944]">
      <h3 class="font-fredoka mb-4 flex items-center gap-2 text-lg font-black text-[#445944]">
        <Award :size="20" />
        遊戲進度
      </h3>
      <div class="space-y-3">
        <div
          class="flex items-center justify-between rounded-2xl border-2 border-[#445944] bg-[#FDF9F3] px-4 py-3">
          <span class="text-sm font-bold text-gray-600">目前進度</span>
          <span
            class="rounded-xl border-2 border-[#445944] bg-[#FAE4AE] px-3 py-1 text-sm font-black text-[#7A5A20] shadow-[2px_2px_0px_#445944]">
            {{ gameStats.progress }}
          </span>
        </div>
        <div
          class="flex items-center justify-between rounded-2xl border-2 border-[#445944] bg-[#FDF9F3] px-4 py-3">
          <span class="text-sm font-bold text-gray-600">最後遊玩</span>
          <span class="text-sm font-bold text-[#445944]">
            {{ formatDate(gameStats.lastPlayed) }}
          </span>
        </div>
      </div>
      <router-link
        to="/game"
        class="mt-5 flex items-center justify-center gap-2 rounded-2xl border-2 border-[#445944] bg-[#445944] py-3 text-sm font-bold text-white shadow-[3px_3px_0px_#445944] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_#445944]">
        <Gamepad2 :size="18" />
        前往遊戲中心
        <ChevronRight :size="16" />
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.game-stat-card {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
</style>
