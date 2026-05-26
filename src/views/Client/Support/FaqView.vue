<script setup>
import { ref, onMounted, computed } from 'vue'
import { HelpCircle, ChevronDown, MessageCircleMore, Search } from 'lucide-vue-next'
import SupportHeader from '@/components/Client/SupportHeader.vue'
import SupportFloatingServiceMenu from '@/components/Client/SupportFloatingServiceMenu.vue'
import AiChatFloat from '@/views/Client/Support/AiChatFloatView.vue'
import LineBotFloat from '@/views/Client/Support/LineBotView.vue'

const faqList = ref([])
const activeCategory = ref('全部')
const openFaqId = ref(null)
const isLoading = ref(false)
const searchQuery = ref('')
const aiChatRef = ref(null)
const lineBotRef = ref(null)

const triggerAiChat = () => {
  if (aiChatRef.value) aiChatRef.value.openChat()
}
const triggerLineChat = () => {
  if (lineBotRef.value) lineBotRef.value.openChat()
}

const loadFaqs = async () => {
  isLoading.value = true
  try {
    const response = await fetch('https://localhost:7048/api/Support/Faq?page=1&pageSize=100')
    if (response.ok) {
      const result = await response.json()
      faqList.value = (result.data.items || []).filter((faq) => faq.status === '已發佈')
    }
  } catch (error) {
    console.error('取得 FAQ 失敗:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadFaqs()
})

const categories = computed(() => {
  const types = faqList.value.map((faq) => faq.questionType)
  return ['全部', ...new Set(types)]
})

const filteredFaqs = computed(() => {
  let result = faqList.value

  if (activeCategory.value !== '全部') {
    result = result.filter((faq) => faq.questionType === activeCategory.value)
  }

  const keyword = searchQuery.value.trim().toLowerCase()
  if (keyword) {
    result = result.filter(
      (faq) =>
        faq.question.toLowerCase().includes(keyword) || faq.answer.toLowerCase().includes(keyword),
    )
  }

  return result
})

const highlightText = (text) => {
  const keyword = searchQuery.value.trim()
  // 如果沒有搜尋、或是文字為空，就直接回傳原字串
  if (!keyword || !text) return text

  // 建立正規表達式 (gi代表：g 全域搜尋、i 不分大小寫)
  const regex = new RegExp(`(${keyword})`, 'gi')

  // 將找到的關鍵字，替換成有底色的標籤
  return text.replace(
    regex,
    '<mark class="bg-[#fcf7c6] text-[#7a6856] rounded px-1 font-bold shadow-sm">$1</mark>',
  )
}

const toggleFaq = (id) => {
  openFaqId.value = openFaqId.value === id ? null : id
}
</script>

<template>
  <div
    class="page-container min-h-screen bg-[#FCF4E5] px-4 py-12 font-sans text-gray-800 antialiased">
    <div class="mx-auto w-11/12 lg:w-[95%] xl:w-10/12">
      <SupportHeader />

      <div class="mb-10 flex justify-center">
        <div class="flex flex-wrap justify-center gap-3 sm:gap-4">
          <button
            v-for="cat in categories"
            :key="cat"
            @click="activeCategory = cat"
            :class="[
              'rounded-full border-2 px-6 py-2.5 text-base font-bold transition-all duration-300',
              activeCategory === cat
                ? 'border-[#445944] bg-[#445944] text-white shadow-md'
                : 'border-[#b4a496]/50 bg-white text-[#7a6856] shadow-sm hover:border-[#445944] hover:text-[#445944]',
            ]">
            {{ cat }}
          </button>
        </div>
      </div>

      <div
        class="relative mx-auto mt-8 mb-12 max-w-2xl rounded-2xl border-4 border-[#7a6856] bg-white shadow-[4px_4px_0px_#7a6856] transition-all hover:shadow-[6px_6px_0px_#7a6856]">
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
          <Search class="h-5 w-5 text-[#7a6856]" />
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="請輸入關鍵字... 例如：領養、點數"
          class="w-full rounded-xl bg-transparent py-4 pr-16 pl-12 text-base font-bold text-gray-700 outline-none" />
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="absolute inset-y-0 right-0 flex items-center pr-5 text-sm font-black text-gray-400 transition-colors hover:text-[#445944]">
          清除
        </button>
      </div>

      <div v-if="isLoading" class="py-16 text-center text-[#7a6856]">
        <div
          class="mb-3 inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#445944] border-t-transparent"></div>
        <div class="font-extrabold tracking-wide">正在為您尋找解答中... 🐾</div>
      </div>

      <div v-else class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
        <div
          v-for="faq in filteredFaqs"
          :key="faq.faqid"
          class="h-fit overflow-hidden rounded-2xl border-4 border-[#445944] bg-white shadow-[4px_4px_0px_#445944] transition-all duration-300 hover:shadow-[6px_6px_0px_#445944]">
          <button
            @click="toggleFaq(faq.faqid)"
            :class="[
              'flex w-full items-center justify-between px-6 py-5 text-left font-bold transition-colors',
              openFaqId === faq.faqid
                ? 'bg-[#FAE4AE] text-[#445944]'
                : 'bg-white text-[#5a4d40] hover:bg-[#FCF4E5]/50',
            ]">
            <div class="flex items-center gap-3 pr-4">
              <HelpCircle class="h-6 w-6 shrink-0 text-[#7a6856]" />
              <span
                class="text-base font-black sm:text-lg"
                v-html="highlightText(faq.question)"></span>
            </div>
            <ChevronDown
              :class="[
                'h-6 w-6 shrink-0 text-[#7a6856] transition-transform duration-300',
                openFaqId === faq.faqid ? 'rotate-180' : '',
              ]" />
          </button>

          <div
            class="grid transition-all duration-300 ease-in-out"
            :class="
              openFaqId === faq.faqid ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
            ">
            <div class="overflow-hidden">
              <div
                class="border-t-4 border-dashed border-[#445944] bg-[#FDF9F3] px-6 py-5 text-base leading-relaxed font-semibold text-gray-700 lg:px-8">
                <div class="flex items-start gap-3">
                  <MessageCircleMore class="mt-1 h-5 w-5 shrink-0 text-[#7a6856]" />
                  <div
                    class="grow leading-relaxed whitespace-pre-wrap text-gray-700"
                    v-html="highlightText(faq.answer)"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="!isLoading && filteredFaqs.length === 0"
        class="mx-auto max-w-md rounded-2xl border-4 border-dashed border-[#7a6856]/40 bg-[#FCF4E5] py-12 text-center text-lg font-bold text-[#7a6856]">
        找不到與「{{ searchQuery }}」相關的問題喔！ 🐾
      </div>
    </div>
  </div>

  <SupportFloatingServiceMenu @openAiChat="triggerAiChat" @openLineChat="triggerLineChat" />
  <AiChatFloat ref="aiChatRef" />
  <LineBotFloat ref="lineBotRef" />
</template>
