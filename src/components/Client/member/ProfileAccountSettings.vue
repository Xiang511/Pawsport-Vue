<script setup>
import { Settings, Edit3, Bell, LogOut, ChevronRight } from 'lucide-vue-next'

const emit = defineEmits(['edit', 'logout'])
</script>

<template>
  <div
    class="rounded-3xl border-4 border-[#7a6856] bg-[#FCF4E5] p-5 shadow-[4px_4px_0px_#7a6856]">
    <h3 class="font-fredoka mb-4 flex items-center gap-2 text-lg font-black text-[#7a6856]">
      <Settings :size="18" />
      帳號設定
    </h3>
    <div class="space-y-2">
      <button
        @click="emit('edit')"
        class="group flex w-full items-center gap-3 rounded-2xl border-2 border-[#7a6856] bg-[#FCF4E5] px-4 py-3 text-left transition-all hover:bg-[#7a6856]/30">
        <Edit3 :size="15" class="text-[#7a6856]" />
        <span class="text-sm font-bold text-[#7a6856]">編輯個人資料</span>
        <ChevronRight
          :size="14"
          class="ml-auto text-[#7a6856] transition-transform group-hover:translate-x-1" />
      </button>
      <button
        class="group flex w-full items-center gap-3 rounded-2xl border-2 border-[#7a6856] bg-[#FCF4E5] px-4 py-3 text-left transition-all hover:bg-[#7a6856]/30">
        <Bell :size="15" class="text-[#7a6856]" />
        <span class="text-sm font-bold text-[#7a6856]">通知設定</span>
        <ChevronRight
          :size="14"
          class="ml-auto text-[#7a6856] transition-transform group-hover:translate-x-1" />
      </button>
      <button
        @click="emit('logout')"
        class="group flex w-full items-center gap-3 rounded-2xl border-2 border-[#7a6856] bg-[#FCF4E5] px-4 py-3 text-left transition-all hover:bg-[#7a6856]/30">
        <LogOut :size="15" class="text-[#7a6856]" />
        <span class="text-sm font-bold text-[#7a6856]">登出帳號</span>
      </button>
    </div>
  </div>
</template>
