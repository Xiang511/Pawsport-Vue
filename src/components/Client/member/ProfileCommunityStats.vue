<script setup>
import { Users, FileText, BookOpen, Activity, ChevronRight } from 'lucide-vue-next'

const props = defineProps({
  myPosts: { type: Array, default: () => [] },
})
</script>

<template>
  <div
    class="rounded-3xl border-4 border-[#7a6856] bg-[#FCF4E5] p-5 shadow-[5px_5px_0px_#7a6856]">
    <h3 class="font-fredoka mb-4 flex items-center gap-2 text-lg font-black text-[#7a6856]">
      <Users :size="18" />
      社群概況
    </h3>
    <div class="space-y-3">
      <div
        class="flex items-center justify-between rounded-xl border-2 border-[#7a6856] bg-[#FCF4E5] px-4 py-3">
        <span class="flex items-center gap-2 text-sm font-bold text-[#7a6856]">
          <FileText :size="15" class="text-[#7a6856]" />
          發表文章
        </span>
        <span class="font-fredoka text-xl font-black text-[#7a6856]">
          {{ myPosts.length }}
        </span>
      </div>
      <div
        class="flex items-center justify-between rounded-xl border-2 border-[#7a6856] bg-[#FCF4E5] px-4 py-3">
        <span class="flex items-center gap-2 text-sm font-bold text-[#7a6856]">
          <BookOpen :size="15" class="text-[#7a6856]" />
          已發表文章
        </span>
        <span class="font-fredoka text-xl font-black text-[#7a6856]">
          {{ myPosts.filter((p) => p.status === 1).length }}
        </span>
      </div>
      <div
        class="flex items-center justify-between rounded-xl border-2 border-[#7a6856] bg-[#FCF4E5] px-4 py-3">
        <span class="flex items-center gap-2 text-sm font-bold text-[#7a6856]">
          <Activity :size="15" class="text-[#7a6856]" />
          累計瀏覽
        </span>
        <span class="font-fredoka text-xl font-black text-[#7a6856]">
          {{ myPosts.reduce((acc, p) => acc + p.viewCount, 0).toLocaleString() }}
        </span>
      </div>
    </div>
    <router-link
      to="/community-home"
      class="mt-4 flex items-center justify-center gap-1 text-sm font-bold text-[#7a6856] hover:underline">
      前往社群
      <ChevronRight :size="14" />
    </router-link>
  </div>
</template>
