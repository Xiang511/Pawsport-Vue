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
  <div class="min-h-screen bg-[#FCF4E5] px-4 py-12 font-sans">
    <div class="mx-auto w-11/12 lg:w-[95%] xl:w-10/12">
      <SupportHeader />
      <LineBotFloat />
      <AiChatFloat />

      <div class="mb-12 flex justify-center border-b-2 border-[#e8dccb]/60 pb-px">
        <div class="flex gap-8 lg:gap-12">
          <button
            v-for="cat in categories"
            :key="cat"
            @click="activeCategory = cat"
            :class="[
              'relative pb-4 text-base font-bold transition-all duration-300 lg:text-lg',
              activeCategory === cat ? 'text-[#7a6856]' : 'text-[#968677] hover:text-[#7a6856]',
            ]">
            {{ cat }}
            <span
              v-if="activeCategory === cat"
              class="absolute bottom-0 left-0 h-1 w-full rounded-full bg-[#7a6856]"></span>
          </button>
        </div>
      </div>

      <div v-if="isLoading" class="py-12 text-center text-xl text-[#968677]">
        正在為您遞送最新毛孩情報... 🐾
      </div>

      <div v-else class="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        <article
          v-for="enews in filteredEnews"
          :key="enews.newsLetterId"
          class="group flex cursor-pointer flex-col overflow-hidden rounded-3xl border-2 border-[#e8dccb] bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
          <div
            class="relative flex h-52 w-full items-center justify-center overflow-hidden bg-[#e8dccb]/40">
            <template v-if="enews.image">
              <img
                :src="enews.image"
                class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                alt="電子報封面" />
            </template>
            <template v-else>
              <ImageIcon class="h-12 w-12 text-[#d8ccbb]" />
            </template>

            <span
              class="absolute top-4 left-4 rounded-full bg-[#FAE4AE] px-4 py-1.5 text-sm font-bold text-[#755e44] shadow-sm">
              {{ enews.category }}
            </span>
          </div>

          <div class="flex flex-grow flex-col p-6 lg:p-8">
            <h2
              class="mb-3 line-clamp-2 text-xl font-bold text-[#7a6856] transition-colors group-hover:text-[#5c4e40]">
              {{ enews.title }}
            </h2>

            <p class="mb-6 line-clamp-3 flex-grow text-base text-[#968677]">
              {{ enews.summary }}
            </p>

            <div
              class="mt-auto flex items-center justify-between border-t-2 border-dashed border-[#e8dccb] pt-4">
              <div class="flex items-center gap-2 text-sm text-[#968677]">
                <Calendar class="h-4 w-4" />
                <span>{{ formatDate(enews.publishDate) }}</span>
              </div>

              <router-link
                :to="{ name: 'Client-enewsletter-detail', params: { id: enews.newsLetterId } }"
                class="flex cursor-pointer items-center gap-1 font-bold text-[#755e44] transition-transform group-hover:translate-x-1">
                閱讀更多
                <ArrowRight class="h-4 w-4" />
              </router-link>
            </div>
          </div>
        </article>
      </div>

      <div
        v-if="!isLoading && filteredEnews.length === 0"
        class="py-12 text-center text-lg text-[#968677]">
        這個分類目前還沒有電子報喔！
      </div>
    </div>
  </div>
</template>

<style scoped></style>
