<script setup>
import { ref } from 'vue'
import { Send } from 'lucide-vue-next'
import { Icon } from '@iconify/vue'
import SupportHeader from '@/components/Client/SupportHeader.vue'
import LineBotFloat from '@/views/Client/Support/LineBotView.vue'
import AiChatFloat from '@/views/Client/Support/AiChatFloatView.vue' 

// 表單資料綁定
const form = ref({
  userId: 110, // 測試階段先寫死，之後串接登入狀態再替換
  questionType: '領養諮詢',
  chiefComplaint: '',
  chatContent: '',
})

const isSubmitting = ref(false)

// 送出表單的 API 邏輯
const submitForm = async () => {
  if (!form.value.chiefComplaint || !form.value.chatContent) {
    alert('主訴與詳細內容不可為空喔！')
    return
  }

  isSubmitting.value = true
  try {
    const response = await fetch('https://localhost:7048/api/Support/Qa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value),
    })

    if (response.ok) {
      alert('問題已送出！客服人員會盡快為您解答 🐾')
      // 成功後清空表單
      form.value.chiefComplaint = ''
      form.value.chatContent = ''
      form.value.questionType = '領養諮詢'
    } else {
      alert('送出失敗，請稍後再試。')
    }
  } catch (error) {
    console.error('API錯誤:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#FCF4E5] px-4 py-12 font-sans">
    <div class="mx-auto w-11/12 lg:w-[95%] xl:w-10/12">
      <SupportHeader />
      <LineBotFloat />
      <AiChatFloat />

      <div class="mx-auto mt-8 grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-12">
        <div class="order-2 lg:order-1 lg:col-span-3">
          <div
            class="rounded-3xl border-2 border-[#e8dccb] bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-md sm:p-10">
            <form @submit.prevent="submitForm" class="space-y-7">
              <div>
                <label class="mb-3 block font-bold text-[#7a6856]">
                  您想詢問的類型：
                  <span class="text-red-400">*</span>
                </label>
                <select
                  v-model="form.questionType"
                  class="w-full rounded-xl border-2 border-[#e8dccb] bg-[#fcf6ed] px-4 py-3 text-[#7a6856] shadow-sm transition-all duration-300 hover:border-[#d8ccbb] focus:border-[#755e44] focus:bg-[#fceecc] focus:ring-4 focus:ring-[#fcf7c6]/50 focus:outline-none">
                  <option value="帳號問題">帳號問題</option>
                  <option value="領養諮詢">領養諮詢</option>
                  <option value="互動遊戲">互動遊戲</option>
                  <option value="健康護照">健康護照</option>
                  <option value="其他問題">其他問題</option>
                </select>
              </div>

              <div>
                <label class="mb-3 block font-bold text-[#7a6856]">
                  詢問主旨：
                  <span class="text-red-400">*</span>
                </label>
                <input
                  v-model="form.chiefComplaint"
                  type="text"
                  placeholder="請用一句話簡述您的問題"
                  class="w-full rounded-xl border-2 border-[#e8dccb] bg-[#fcf6ed] px-4 py-3 text-gray-800 shadow-sm transition-all duration-300 placeholder:text-gray-400 hover:border-[#d8ccbb] focus:border-[#755e44] focus:bg-[#fceecc] focus:ring-4 focus:ring-[#fcf7c6]/50 focus:outline-none" />
              </div>

              <div>
                <label class="mb-3 block font-bold text-[#7a6856]">
                  詳細狀況描述：
                  <span class="text-red-400">*</span>
                </label>
                <textarea
                  v-model="form.chatContent"
                  rows="5"
                  placeholder="請盡可能詳細描述您遇到的狀況，以便我們能更快為您處理喔！"
                  class="w-full rounded-xl border-2 border-[#e8dccb] bg-[#fcf6ed] px-4 py-3 text-gray-800 shadow-sm transition-all duration-300 placeholder:text-gray-400 hover:border-[#d8ccbb] focus:border-[#755e44] focus:bg-[#fceecc] focus:ring-4 focus:ring-[#fcf7c6]/50 focus:outline-none"></textarea>
              </div>

              <div class="pt-2 text-center">
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#755e44] px-10 py-4 text-lg font-bold text-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-[#5c4e40] hover:shadow-lg active:scale-95 disabled:opacity-50 sm:w-auto">
                  <Send v-if="!isSubmitting" class="h-5 w-5" />
                  {{ isSubmitting ? '正在發送中...' : '送出問題' }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div class="order-1 lg:order-2 lg:col-span-2">
          <div
            class="flex flex-col items-center justify-center rounded-3xl border-2 border-[#e8dccb] bg-white p-8 text-center shadow-sm transition-all duration-300 hover:shadow-md sm:p-10">
            <div
              class="mb-4 flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#FCF4E5]">
              <Icon icon="fa6-brands:line" class="h-10 w-10 text-[#06C755]" />
            </div>

            <h3 class="mb-2 text-xl font-bold text-[#755e44]">不想等待 Email 回覆？</h3>
            <p class="mb-6 text-sm leading-relaxed text-[#968677]">
              直接加入 LINE 官方帳號
              <br />
              智慧客服與專員將線上即時為您處理！
            </p>

            <div
              class="mb-6 hidden aspect-square w-44 shrink-0 items-center justify-center rounded-2xl border-2 border-dashed border-[#e8dccb] bg-[#FCF4E5]/40 p-3 lg:flex">
              <img
                src="/images/support/M_Petmily_LineQRcode.png"
                alt="LINE QR Code"
                class="h-full w-full rounded-xl object-cover" />
            </div>

            <a
              href="https://lin.ee/VlUqZzz4"
              target="_blank"
              class="inline-flex w-full items-center justify-center rounded-full bg-[#06C755] px-10 py-3.5 text-center font-bold tracking-wider text-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-[#05b04a] hover:shadow-md sm:w-auto">
              一鍵加入好友
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
