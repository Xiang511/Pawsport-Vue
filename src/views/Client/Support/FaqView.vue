<script setup>
import { ref, onMounted, computed } from 'vue'
import { HelpCircle, ChevronDown, MessageCircleMore, Search } from 'lucide-vue-next'
import SupportHeader from '@/components/Client/SupportHeader.vue'

const faqList = ref([])
const activeCategory = ref('全部')
const openFaqId = ref(null)
const isLoading = ref(false)
const searchQuery = ref('')

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
  <div class="min-h-screen bg-[#fbf6ef] px-4 py-12 font-sans">
    <div class="mx-auto w-11/12 lg:w-[95%] xl:w-10/12">
      <SupportHeader />

      <div class="mb-10 flex flex-wrap justify-center gap-4 lg:gap-6">
        <button
          v-for="cat in categories"
          :key="cat"
          @click="activeCategory = cat"
          :class="[
            'rounded-full px-8 py-3 text-base font-bold transition-all duration-300 active:scale-95 lg:text-lg',
            activeCategory === cat
              ? 'bg-[#7a6856] text-white shadow-md hover:-translate-y-1 hover:bg-[#5c4e40]'
              : 'bg-[#e8dccb] text-[#7a6856] hover:-translate-y-1 hover:bg-[#d8ccbb]',
          ]">
          {{ cat }}
        </button>
      </div>

      <div
        class="relative mx-auto mb-10 max-w-2xl rounded-full transition-all duration-300 hover:shadow-md">
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
          <Search class="h-5 w-5 text-[#968677]" />
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="請輸入關鍵字... 例如：疫苗、晶片、領養"
          class="w-full rounded-full border-2 border-[#e8dccb] bg-white py-4 pr-6 pl-12 text-gray-700 shadow-sm transition-all focus:border-[#7a6856] focus:ring-4 focus:ring-[#fcf7c6]/50 focus:outline-none" />
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="absolute inset-y-0 right-0 flex items-center pr-5 text-sm font-bold text-gray-400 hover:text-[#7a6856]">
          清除
        </button>
      </div>

      <div v-if="isLoading" class="py-10 text-center text-xl text-[#968677]">
        正在為您尋找解答中... 🐾
      </div>

      <div v-else class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
        <div
          v-for="faq in filteredFaqs"
          :key="faq.faqid"
          class="h-fit overflow-hidden rounded-2xl border-2 border-[#e8dccb] bg-white transition-all duration-300 hover:shadow-md">
          <button
            @click="toggleFaq(faq.faqid)"
            :class="[
              'flex w-full items-center justify-between px-6 py-5 text-left transition-colors',
              openFaqId === faq.faqid ? 'bg-[#fcf7c6]' : 'bg-white hover:bg-[#fde6db]',
            ]">
            <div class="flex items-center gap-3 pr-4">
              <HelpCircle class="h-6 w-6 shrink-0 text-[#7a6856]" />

              <span
                class="text-lg font-bold text-[#5a4d40]"
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
                class="border-t-2 border-dashed border-[#e8dccb] bg-white px-8 py-6 text-base leading-relaxed text-gray-700 lg:px-12">
                <div class="flex items-start gap-3">
                  <MessageCircleMore class="mt-1 h-5 w-5 shrink-0 text-[#968677]" />

                  <div class="grow whitespace-pre-wrap" v-html="highlightText(faq.answer)"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="!isLoading && filteredFaqs.length === 0"
        class="py-10 text-center text-lg text-[#968677]">
        找不到與「{{ searchQuery }}」相關的問題喔！
      </div>
    </div>
  </div>
</template>
