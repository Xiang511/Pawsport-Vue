<script setup>
import { ref, onMounted, computed } from 'vue'
import { ArrowRight, Calendar, ImageIcon } from 'lucide-vue-next'
import SupportHeader from '@/components/Client/SupportHeader.vue'
import LineBotFloat from '@/views/Client/Support/LineBotView.vue'
import AiChatFloat from '@/views/Client/Support/AiChatFloatView.vue'

const enewsList = ref([])
const activeCategory = ref('全部')
const isLoading = ref(false)

const loadEnews = async () => {
  isLoading.value = true
  try {
    const response = await fetch('https://localhost:7048/api/ENewsletter?page=1&pageSize=100')
    if (response.ok) {
      const result = await response.json()
      const rawData = result.data?.items || result.items || result || []

      // 只保留狀態為已發送的電子報，擋掉預約發送的資料
      enewsList.value = rawData.filter((news) => news.status === '已發送')
    }
  } catch (error) {
    console.error('取得電子報失敗:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadEnews()
})

const categories = computed(() => {
  const types = enewsList.value.map((news) => news.category).filter(Boolean)
  return ['全部', ...new Set(types)]
})

const filteredEnews = computed(() => {
  if (activeCategory.value === '全部') return enewsList.value
  return enewsList.value.filter((news) => news.category === activeCategory.value)
})

// 日期格式化變成西元年-月-日"
const formatDate = (dateString) => {
  if (!dateString) return ''
  return dateString.split('T')[0].split(' ')[0]
}
</script>

<template>
  <div class="page-container min-h-screen bg-[#FDF9F3] text-gray-800 antialiased px-4 py-12 font-sans">
    <div class="mx-auto w-11/12 lg:w-[95%] xl:w-10/12">
      <SupportHeader />
      <LineBotFloat />
      <AiChatFloat />

      <!-- Category Filter Tabs -->
      <div class="mb-12 flex justify-center border-b-4 border-[#445944] pb-5">
        <div class="flex flex-wrap justify-center gap-3 sm:gap-4">
          <button
            v-for="cat in categories"
            :key="cat"
            @click="activeCategory = cat"
            :class="[
              'rounded-full px-5 py-2 text-sm font-black transition-all duration-300 lg:text-base border-2',
              activeCategory === cat 
                ? 'bg-[#445944] border-[#445944] text-white shadow-[2px_2px_0px_#445944]' 
                : 'bg-white border-[#445944]/40 text-[#7a6856] hover:border-[#445944] hover:text-[#445944]',
            ]">
            {{ cat }}
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="py-16 text-center text-[#7a6856]">
        <div class="mb-3 inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#445944] border-t-transparent"></div>
        <div class="font-extrabold tracking-wide">正在為您遞送最新毛孩情報... 🐾</div>
      </div>

      <!-- Newsletter Grid -->
      <div v-else class="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        <article
          v-for="enews in filteredEnews"
          :key="enews.newsLetterId"
          class="group flex cursor-pointer flex-col overflow-hidden rounded-3xl border-4 border-[#445944] bg-white shadow-[6px_6px_0px_#445944] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[10px_10px_0px_#445944]">
          
          <div
            class="relative flex h-52 w-full items-center justify-center overflow-hidden bg-[#FCF4E5] border-b-4 border-[#445944]">
            <template v-if="enews.image">
              <img
                :src="enews.image"
                class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                alt="電子報封面" />
            </template>
            <template v-else>
              <ImageIcon class="h-12 w-12 text-[#7a6856]/40" />
            </template>

            <span
              class="font-fredoka absolute top-4 left-4 rounded-full bg-[#7a6856] px-3.5 py-1 text-xs font-semibold tracking-wider text-white shadow-sm">
              {{ enews.category }}
            </span>
          </div>

          <div class="flex flex-grow flex-col p-6 lg:p-7">
            <h2
              class="mb-3 line-clamp-2 text-xl font-black text-[#445944] transition-colors group-hover:text-[#7a6856]">
              {{ enews.title }}
            </h2>

            <p class="mb-6 line-clamp-3 flex-grow text-sm font-semibold text-gray-600">
              {{ enews.summary }}
            </p>

            <div
              class="mt-auto flex items-center justify-between border-t-2 border-dashed border-[#7a6856]/30 pt-4">
              <div class="flex items-center gap-2 text-xs font-bold text-[#7a6856]">
                <Calendar class="h-4 w-4 text-[#7a6856]" />
                <span>{{ formatDate(enews.publishDate) }}</span>
              </div>

              <router-link
                :to="{ name: 'Client-enewsletter-detail', params: { id: enews.newsLetterId } }"
                class="flex cursor-pointer items-center gap-1 text-sm font-black text-[#445944] transition-all hover:text-[#7a6856] group-hover:translate-x-0.5">
                閱讀更多
                <ArrowRight class="h-4 w-4" />
              </router-link>
            </div>
          </div>
        </article>
      </div>

      <!-- Empty State -->
      <div
        v-if="!isLoading && filteredEnews.length === 0"
        class="mx-auto max-w-md rounded-2xl border-4 border-dashed border-[#7a6856]/40 bg-[#FCF4E5] py-12 text-center text-lg font-bold text-[#7a6856]">
        這個分類目前還沒有電子報喔！ 🐾
      </div>
    </div>
  </div>
</template>

<style scoped></style>
