<script setup>
import { ref } from 'vue'
import { Bot, Mail, Plus, X, Send } from 'lucide-vue-next'
import { Icon } from '@iconify/vue'

const isMenuOpen = ref(false)
const isSubscribeOpen = ref(false)

// 🌟 新增：電子報表單綁定的變數
const subscribeEmail = ref('')
const isSubmittingEmail = ref(false)

const emit = defineEmits(['openAiChat', 'openLineChat'])

const handleAiClick = () => {
  emit('openAiChat')
  isMenuOpen.value = false
}

const handleLineClick = () => {
  emit('openLineChat')
  isMenuOpen.value = false
}

const handleSubscribeClick = () => {
  isSubscribeOpen.value = true
  isMenuOpen.value = false
}

// 🌟 新增：處理訂閱電子報的邏輯
const handleSubscribeSubmit = async () => {
  if (!subscribeEmail.value) {
    alert('請輸入 Email 喔！')
    return
  }
  
  isSubmittingEmail.value = true
  
  // 模擬 API 呼叫延遲 (這裡之後可以換成你真正的後端 API)
  setTimeout(() => {
    alert('訂閱成功！感謝您的加入 🐾')
    subscribeEmail.value = '' // 清空輸入框
    isSubmittingEmail.value = false // 關閉載入狀態
    isSubscribeOpen.value = false // 關閉彈窗
  }, 1000)
}
</script>

<template>
  <div class="fixed right-8 bottom-8 z-50 flex flex-col items-end gap-3">
    <Transition name="fade-slide">
      <div v-if="isMenuOpen" class="flex flex-col items-end gap-4 pb-2">
        
        <div class="group flex items-center gap-3">
          <span class="rounded-lg bg-white px-3 py-1.5 text-sm font-bold text-[#755e44] opacity-0 shadow-sm transition-opacity duration-300 group-hover:opacity-100">
            訂閱電子報
          </span>
          <button
            @click="handleSubscribeClick"
            class="flex h-14 w-14 items-center justify-center rounded-full bg-[#FAE4AE] text-[#755e44] shadow-md transition-all hover:scale-110 hover:shadow-lg">
            <Mail class="h-6 w-6" />
          </button>
        </div>

        <div class="group flex items-center gap-3">
          <span class="rounded-lg bg-white px-3 py-1.5 text-sm font-bold text-[#755e44] opacity-0 shadow-sm transition-opacity duration-300 group-hover:opacity-100">
            AI 智能客服
          </span>
          <button
            @click="handleAiClick"
            class="flex h-14 w-14 items-center justify-center rounded-full bg-[#E8DCCB] text-[#755e44] shadow-md transition-all hover:scale-110 hover:shadow-lg">
            <Bot class="h-6 w-6" />
          </button>
        </div>

        <div class="group flex items-center gap-3">
          <span class="rounded-lg bg-white px-3 py-1.5 text-sm font-bold text-[#755e44] opacity-0 shadow-sm transition-opacity duration-300 group-hover:opacity-100">
            LINE 真人客服
          </span>
          <button
            @click="handleLineClick"
            class="flex h-14 w-14 items-center justify-center rounded-full bg-[#06C755] text-white shadow-md transition-all hover:scale-110 hover:shadow-lg">
            <Icon icon="fa6-brands:line" class="h-8 w-8" />
          </button>
        </div>
      </div>
    </Transition>

    <button
      @click="isMenuOpen = !isMenuOpen"
      class="flex h-16 w-16 items-center justify-center rounded-full bg-[#755e44] text-white shadow-xl transition-all duration-300 hover:scale-110 hover:bg-[#5c4e40]">
      <X v-if="isMenuOpen" class="h-8 w-8 rotate-90 transition-transform duration-300" />
      <Plus v-else class="h-8 w-8 transition-transform duration-300 hover:rotate-90" />
    </button>

    <Transition name="fade">
      <div v-if="isSubscribeOpen" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div class="relative w-11/12 max-w-md rounded-3xl bg-[#fbf6ef] p-8 shadow-2xl">
          <button @click="isSubscribeOpen = false" class="absolute top-4 right-4 rounded-full bg-[#e8dccb] p-2 text-[#7a6856] transition-colors hover:bg-[#d8ccbb]">
            <X class="h-5 w-5" />
          </button>

          <div class="mb-4 flex justify-center">
            <div class="flex h-16 w-16 items-center justify-center rounded-full bg-[#FAE4AE] text-[#755e44] shadow-md">
              <Mail class="h-8 w-8" />
            </div>
          </div>
          
          <h3 class="mb-2 text-center text-2xl font-bold text-[#7a6856]">訂閱 Petmily 電子報</h3>
          <p class="mb-8 text-center text-sm font-medium leading-relaxed text-[#968677]">
            輸入您的 Email，第一時間獲取<br>最新的毛孩照護知識與專屬活動情報！
          </p>
          
          <form @submit.prevent="handleSubscribeSubmit" class="flex flex-col gap-4">
            <input
              v-model="subscribeEmail"
              type="email"
              required
              placeholder="請輸入您的 Email 地址"
              class="w-full rounded-xl border-2 border-[#e8dccb] bg-white px-5 py-3.5 font-bold text-[#7a6856] shadow-inner transition-colors placeholder:font-medium placeholder:text-gray-400 focus:border-[#755e44] focus:outline-none"
            />
            <button
              type="submit"
              :disabled="isSubmittingEmail"
              class="flex w-full items-center justify-center gap-2 rounded-xl bg-[#755e44] px-5 py-3.5 text-lg font-bold text-white shadow-md transition-all hover:bg-[#5c4e40] disabled:opacity-70">
              <Send v-if="!isSubmittingEmail" class="h-5 w-5" />
              {{ isSubmittingEmail ? '發送中...' : '立即訂閱' }}
            </button>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* 選單上下滑動動畫 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}

/* 彈窗淡入淡出動畫 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>