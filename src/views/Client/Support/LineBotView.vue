<script setup>
import { ref } from 'vue'
import { X } from 'lucide-vue-next'
import { Icon } from '@iconify/vue'

const isModalOpen = ref(false)

// 💡 修正：這裡改成改變 isModalOpen
defineExpose({
  openChat: () => {
    isModalOpen.value = true
    console.log('LINE 機器人收到開啟指令！')
  },
})
</script>

<template>
  <div>
    <Transition name="fade">
      <div
        v-if="isModalOpen"
        class="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div class="relative w-11/12 max-w-sm rounded-3xl bg-[#fbf6ef] p-8 text-center shadow-2xl">
          <button
            @click="isModalOpen = false"
            class="absolute top-4 right-4 rounded-full bg-[#e8dccb] p-2 text-[#7a6856] transition-colors hover:bg-[#d8ccbb]">
            <X class="h-5 w-5" />
          </button>

          <div class="mb-4 flex justify-center">
            <div
              class="flex h-16 w-16 items-center justify-center rounded-full bg-[#06C755] text-white shadow-md">
              <Icon icon="fa6-brands:line" class="h-8 w-8" />
            </div>
          </div>

          <h3 class="mb-2 text-2xl font-bold text-[#445944]">Petmily 真人客服</h3>
          <p class="mb-6 text-sm text-[#968677]">掃描下方 QR Code，立即與我們一對一對話！</p>

          <div
            class="mx-auto mb-6 flex aspect-square w-48 items-center justify-center rounded-2xl border-4 border-white bg-white shadow-inner">
            <img
              src="/images/support/M_Petmily_LineQRcode.png"
              alt="LINE 官方帳號 QR Code"
              class="h-full w-full rounded-2xl object-cover" />
          </div>
          <p class="font-bold tracking-widest text-[#7a6856]">ID: @233fdsil</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
