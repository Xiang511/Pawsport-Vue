<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import ArticleCard from '@/components/Client/ArticleCard.vue'

//===假資料===

// 1. 模擬「分類 DTO」清單 (通常這會是另一個 API 回傳的)
const categories = ref([
  { categoryid: 0, categoryname: '全部' },
  { categoryid: 1, categoryname: '版規' },
  { categoryid: 2, categoryname: '寵物知識' },
  { categoryid: 3, categoryname: '專業科普' },
])

// 2. 模擬「文章 DTO」清單
const articleData = ref([
  {
    id: 1,
    categoryid: 2,
    categoryname: '寵物知識',
    title: '如何照顧幼貓？',
    summary: '幼貓需要特別的營養與耐心...',
    author: '貓奴A',
    date: '2026-05-11',
  },
  {
    id: 2,
    categoryid: 2,
    categoryname: '寵物知識',
    title: '柴犬個性分析',
    summary: '很多人說柴犬很固執，其實...',
    author: '柴大師',
    date: '2026-05-10',
    image: 'https://placecats.com/120/80',
  },
  {
    id: 3,
    categoryid: 3,
    categoryname: '專業科普',
    title: '犬貓鮮食推薦',
    summary: '市面上鮮食如此多種，到底該如何選擇...',
    author: '鮮味小姐',
    date: '2026-04-22',
    image: 'https://placecats.com/millie/120/80',
  },
  {
    id: 4,
    categoryid: 3,
    categoryname: '專業科普',
    title: '寵物星座圖鑑',
    summary: '不只是人類，其實動物們也因為星座...',
    author: '寵物星座國師',
    date: '2025-11-4',
    image: 'https://placecats.com/g/120/80',
  },
  {
    id: 5,
    categoryid: 1,
    categoryname: '版規',
    title: '版規更新',
    summary: '親愛的會員們，由於我們的隱私政策更新...',
    author: '管理員',
    date: '2025-5-14',
  },
])

//===function===
//設0=全部文章
const currentCategory = ref(0)
//篩選文章
const filteredArticles = computed(() => {
  if (currentCategory.value === 0) {
    return articleData.value
  }
  return articleData.value.filter((a) => a.categoryid === currentCategory.value)
})

// // 模擬 API 呼叫
// const isLoading = ref(false)
// const fetchData = async () => {
//   isLoading.value = true
//   // 模擬網路延遲 0.5 秒
//   await new Promise((resolve) => setTimeout(resolve, 500))
//   isLoading.value = false
// }

// onMounted(() => {
//   fetchData()
// })
</script>

<template>
  <!-- 頁面最外層：只寫背景顏色 -->
  <div class="min-h-screen bg-[#FCF8F2]">
    <!-- 內容區：最大1280px -->
    <div class="container mx-auto w-full max-w-7xl px-4">
      <!-- 左右分邊容器，flex -->
      <div class="flex flex-col gap-6 py-8 md:flex-row">
        <!-- 左邊30% -->
        <aside class="w-full md:w-[20%]">
          <div class="rounded-lg bg-white p-4 shadow">
            <h2 class="mb-4 font-bold">個人資料</h2>
            <!-- 這裡可以放你的分類、標籤等 -->
          </div>
        </aside>
        <!-- 右邊70% -->
        <main class="w-full md:w-[80%]">
          <div class="mb-8">
            <!-- 分類切換按鈕 -->
            <h1 class="mb-4 text-2xl text-[#433D3C]">分類</h1>
            <div class="mb-6 flex gap-4 border-b border-stone-700 pb-2">
              <button
                v-for="c in categories"
                :key="c.categoryid"
                @click="currentCategory = c.categoryid"
                :class="[
                  'rounded-full px-5 py-2 shadow-sm transition-all',
                  currentCategory === c.categoryid
                    ? 'bg-brand-success-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100',
                ]">
                {{ c.categoryname }}
              </button>
            </div>
          </div>

          <div class="space-y-6">
            <h1 class="mb-4 text-2xl text-[#433D3C]">熱門文章</h1>
            <!-- 卡片列表 -->
            <div class="article-list bg-olive-300">
              <ArticleCard
                v-for="article in filteredArticles"
                :key="article.id"
                :title="article.title"
                :image="article.image"
                :summary="article.summary"
                :author="article.author"
                :date="article.date" />
              <!-- 如果沒文章時的提示 -->
              <p v-if="filteredArticles.length === 0" class="text-gray-400">
                目前沒有相關分類的文章喔！
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
