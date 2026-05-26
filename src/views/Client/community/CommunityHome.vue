<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

// 自己做的卡片樣式
import Article_ListCard from '@/components/Client/Article_ListCard.vue'
import { useCommunityHome } from '@/composables/useCommunityHome'

const router = useRouter()
const route = useRoute()

const {
  parentCategories,
  subCategories,
  isLoading,
  isError,
  currentParentId,
  currentSubId,
  searchQuery,
  currentPage,
  totalPages,
  pagedArticles, // 改用分頁後的文章
  selectParent,
  selectSub,
  fetchData,
  saveRecentViewedArticle,
  selectedTag,
} = useCommunityHome()

const recentViewedArticles = ref([])
const searchInput = ref('')

// 跳轉
const goToArticleDetail = (article) => {
  const articleId = article.articleId

  if (!articleId) {
    console.error('錯誤：沒有拿到有效的文章 ID')
    return
  }

  saveRecentViewedArticle(article)

  recentViewedArticles.value = JSON.parse(localStorage.getItem('recentViewedArticles')) || []

  router.push({
    name: 'article-detail',
    params: { id: articleId },
    query: {
      fromPage: currentPage.value,
      fromParent: currentParentId.value || undefined,
      fromSub: currentSubId.value || undefined,
      fromKeyword: searchQuery.value.trim() || undefined,
    },
  })
}

const goToCreatePage = () => {
  router.push({ name: 'create-article' })
}

const clearRecentViewed = () => {
  localStorage.removeItem('recentViewedArticles')
  recentViewedArticles.value = []
}

const handleSearch = async () => {
  const keyword = searchInput.value.trim()

  selectedTag.value = ''
  searchQuery.value = keyword
  currentParentId.value = 0
  currentSubId.value = 0
  currentPage.value = 1

  await fetchData(keyword)
}

const handleTagSearch = async (tag) => {
  const tagText = String(tag || '')
    .replace(/^#/, '')
    .trim()

  console.log('點到 tag =', tag)
  console.log('送給後端的 tagText =', tagText)

  if (!tagText) return

  selectedTag.value = tagText
  searchInput.value = `#${tagText}`
  searchQuery.value = ''
  currentParentId.value = 0
  currentSubId.value = 0
  currentPage.value = 1

  await fetchData('', tagText)
}

const clearSearch = async () => {
  searchInput.value = ''
  searchQuery.value = ''
  selectedTag.value = ''
  currentPage.value = 1

  await fetchData()
}

watch(
  [currentPage, currentParentId, currentSubId, searchQuery, selectedTag],
  ([page, parent, sub, keyword, tag]) => {
    router.replace({
      name: 'community-home',
      query: {
        page: page || 1,
        parent: parent || undefined,
        sub: sub || undefined,
        keyword: keyword?.trim() || undefined,
        tag: tag?.trim() || undefined,
      },
    })
  },
)

watch(searchQuery, () => {
  currentPage.value = 1
})

watch(searchInput, async (newValue) => {
  if (
    newValue.trim() === '' &&
    (searchQuery.value.trim() !== '' || selectedTag.value.trim() !== '')
  ) {
    searchQuery.value = ''
    selectedTag.value = ''
    currentPage.value = 1

    await fetchData()
  }
})

watch(totalPages, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value
  }

  if (currentPage.value < 1) {
    currentPage.value = 1
  }
})

onMounted(async () => {
  const pageFromQuery = Number(route.query.page)
  const parentFromQuery = Number(route.query.parent)
  const subFromQuery = Number(route.query.sub)
  const keywordFromQuery = route.query.keyword
  const tagFromQuery = route.query.tag

  searchQuery.value = typeof keywordFromQuery === 'string' ? keywordFromQuery : ''
  selectedTag.value = typeof tagFromQuery === 'string' ? tagFromQuery : ''

  if (selectedTag.value) {
    searchInput.value = `#${selectedTag.value}`
  } else {
    searchInput.value = searchQuery.value
  }

  await fetchData(searchQuery.value, selectedTag.value)

  currentParentId.value = Number.isNaN(parentFromQuery) ? 0 : parentFromQuery
  currentSubId.value = Number.isNaN(subFromQuery) ? 0 : subFromQuery

  if (!Number.isNaN(pageFromQuery) && pageFromQuery > 0) {
    currentPage.value = pageFromQuery
  } else {
    currentPage.value = 1
  }

  recentViewedArticles.value = JSON.parse(localStorage.getItem('recentViewedArticles')) || []
})
</script>

<template>
  <!-- 頁面最外層：只寫背景顏色 -->
  <div class="min-h-screen bg-[#f9f6f4]">
    <section
      class="relative flex min-h-64 items-center overflow-hidden bg-[#9C6D6D] text-white md:min-h-125">
      <!-- 1. 圖片作為絕對定位，直接鋪滿整個 section 的上下左右 -->
      <div class="absolute inset-0 h-full w-full">
        <img
          src="/images/banner/dogs-playing-together-stockcake.jpg"
          alt="Petmily Community Banner"
          class="h-full w-full object-cover object-[center_65%]" />
        <!-- 💡 加上一層淡淡的黑色半透明遮罩，可以防止圖片太亮導致白字看不清楚 -->
        <div class="absolute inset-0 bg-black/30"></div>
      </div>

      <!-- 2. 原本的內層容器，加上 z-10 讓它完全浮在背景圖片之上 -->
      <div class="z-10 container mx-auto flex max-w-6xl flex-col items-start px-8 py-8 md:py-0">
        <!-- 文字區塊，寬度可以自由調整（例如 md:w-2/3 或 max-w-xl），讓畫面更舒適 -->
        <div class="w-full max-w-xl md:-mt-40">
          <h2 class="mb-4 text-3xl font-bold drop-shadow-md md:text-5xl">社群專區</h2>
          <p
            p
            class="line-clamp-1 text-sm leading-relaxed text-gray-100 drop-shadow-sm md:line-clamp-none md:text-lg">
            歡迎來到我們的社群專區！在這裡，你可以分享你的經驗與知識。
          </p>
        </div>
      </div>
    </section>
    <!-- 內容區：最大1280px -->
    <div class="container mx-auto w-full max-w-7xl px-4">
      <!-- 左右分邊容器，flex -->
      <div class="flex flex-col gap-6 py-8 md:flex-row">
        <!-- 右邊70% -->
        <main class="flex w-full flex-col gap-8 md:w-3/4">
          <div
            class="flex items-center gap-3 rounded-xl border border-orange-100 bg-orange-50 px-4 py-3">
            <span
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-500 text-base">
              📢
            </span>
            <p class="text-sm leading-relaxed text-orange-900">
              <span class="font-bold">今日焦點：</span>
              歡迎來到 Petmily！本週六將舉辦「線上毛孩鮮食講座」，詳情請密切注意官方消息。
            </p>
          </div>
          <div class="flex flex-col gap-4">
            <!-- 大分類區塊 -->
            <section class="rounded-xl border border-stone-100 bg-white p-6 shadow-sm">
              <h2 class="mb-5 flex items-center gap-2 text-xl font-bold text-[#433D3C]">
                <span class="bg-brand-success-600 inline-block h-5 w-1.5 rounded-full"></span>
                分類瀏覽
              </h2>

              <div class="mb-3 flex items-center justify-between">
                <h3 class="text-sm font-semibold text-stone-700">大分類</h3>
                <span class="text-xs text-stone-400">選擇文章主題</span>
              </div>

              <div class="flex flex-wrap gap-2 rounded-2xl bg-stone-50 p-4">
                <button
                  v-for="c in parentCategories"
                  :key="c.categoryid"
                  @click="selectParent(c.categoryid)"
                  :class="[
                    'rounded-full px-4 py-1.5 text-sm shadow-sm transition-all duration-200',
                    Number(currentParentId) === Number(c.categoryid)
                      ? 'bg-brand-success-600 scale-105 font-medium text-white'
                      : 'bg-white text-stone-600 hover:bg-stone-100',
                  ]">
                  {{ c.categoryname }}
                </button>
              </div>
            </section>

            <!-- 小分類區塊：選全部時完全不出現 -->
            <section
              v-if="Number(currentParentId) !== 0 && subCategories.length > 0"
              class="rounded-xl border border-stone-100 bg-white p-6 shadow-sm">
              <div class="mb-3 flex items-center justify-between">
                <h3 class="text-sm font-semibold text-stone-700">小分類</h3>
              </div>

              <div class="flex flex-wrap gap-2 rounded-2xl bg-stone-50 p-4">
                <button
                  @click="selectSub(0)"
                  :class="[
                    'rounded-full border px-3 py-1 text-xs transition-all',
                    Number(currentSubId) === 0
                      ? 'border-brand-success-400 bg-brand-success-600/10 text-brand-success-700 font-medium'
                      : 'hover:border-brand-success-300 hover:text-brand-success-600 border-stone-200 bg-white text-stone-500',
                  ]">
                  全部小分類
                </button>

                <button
                  v-for="sc in subCategories"
                  :key="sc.categoryid"
                  @click="selectSub(sc.categoryid)"
                  :class="[
                    'rounded-full border px-3 py-1 text-xs transition-all',
                    Number(currentSubId) === Number(sc.categoryid)
                      ? 'border-brand-success-400 bg-brand-success-600/10 text-brand-success-700 font-medium'
                      : 'hover:text-brand-success-400 hover:border-brand-success-300 border-stone-200 bg-white text-stone-500',
                  ]">
                  {{ sc.categoryname }}
                </button>
              </div>
            </section>
          </div>

          <div class="flex min-h-[720px] flex-col gap-4">
            <div v-if="isLoading" class="py-12 text-center text-stone-500">⏳ 資料讀取中...</div>
            <div v-else-if="isError" class="py-12 text-center text-red-500">
              ❌ 系統異常，請稍後再試。
            </div>

            <div v-else class="flex flex-col gap-4">
              <Article_ListCard
                v-for="article in pagedArticles"
                :key="article.articleId"
                :id="article.articleId"
                :title="article.title"
                :summary="article.summary"
                :author="article.userName"
                :date="article.createAt"
                :image="article.mainImageUrl || 'https://placehold.co/400x260'"
                :categoryid="article.categoryId"
                :category="article.categoryName"
                :tags="article.tagNames"
                :viewCount="article.viewCount"
                :bookmarkCount="article.bookmarkCount ?? 0"
                :isBookmarked="article.isBookmarked ?? false"
                :comment-count="article.commentCount ?? 0"
                @click-card="() => goToArticleDetail(article)"
                @click-tag="handleTagSearch"
                @toggle-bookmark="(id) => console.log('收藏文章：', id)"
                class="cursor-pointer transition-transform hover:-translate-y-0.5" />

              <div
                v-if="pagedArticles.length === 0"
                class="min-h-[360px] rounded-xl border border-dashed border-stone-200 bg-white py-12 text-center text-stone-400">
                🐾 找不到相關的文章喔！
              </div>

              <div v-if="totalPages > 1" class="mt-4 flex items-center justify-center gap-2">
                <!-- 第一頁 -->
                <button
                  @click="currentPage = 1"
                  :disabled="currentPage === 1"
                  class="bg-brand-success-200 text-white- hover:bg-brand-success-50 rounded-lg px-3 py-1 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40">
                  <ChevronLeft :size="18" />
                </button>
                <button
                  @click="currentPage--"
                  :disabled="currentPage === 1"
                  class="rounded-lg border border-stone-300 bg-white px-3 py-1 text-sm hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40">
                  上一頁
                </button>
                <span class="text-sm text-stone-600">
                  第 {{ currentPage }} / {{ totalPages }} 頁
                </span>
                <button
                  @click="currentPage++"
                  :disabled="currentPage === totalPages"
                  class="rounded-lg border border-stone-300 bg-white px-3 py-1 text-sm hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40">
                  下一頁
                </button>
                <!-- 最後一頁 -->
                <button
                  @click="currentPage = totalPages"
                  :disabled="currentPage === totalPages"
                  class="bg-brand-success-200 text-white- hover:bg-brand-success-50 rounded-lg px-3 py-1 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40">
                  <ChevronRight :size="18" />
                </button>
              </div>
            </div>
          </div>
        </main>

        <!-- 左邊30% -->
        <aside class="flex w-full flex-col gap-4 md:w-1/4">
          <div class="rounded-2xl border border-stone-100 bg-white p-4 shadow-sm">
            <label class="mb-2 block text-sm font-semibold text-stone-700">搜尋文章</label>

            <div class="flex gap-2">
              <input
                v-model="searchInput"
                type="text"
                placeholder="搜尋標題、內容、分類或作者..."
                class="focus:ring-brand-success-400 min-w-0 flex-1 rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm shadow-sm focus:ring-2 focus:outline-none"
                @keyup.enter="handleSearch" />

              <button
                type="button"
                class="bg-brand-success-600 hover:bg-brand-success-700 rounded-xl px-4 py-2 text-sm text-white"
                @click="handleSearch">
                搜尋
              </button>
            </div>

            <button
              v-if="searchInput.trim() || searchQuery.trim()"
              type="button"
              class="mt-2 text-xs text-stone-400 hover:text-amber-600"
              @click="clearSearch">
              清除搜尋
            </button>
          </div>
          <div class="flex flex-col gap-4 rounded-lg bg-white p-4 shadow">
            <button
              @click="goToCreatePage"
              class="bg-brand-success-600 hover:bg-brand-success-700 w-fit rounded-full px-5 py-2 text-white shadow-sm">
              新增貼文
            </button>
          </div>
          <div class="flex flex-col gap-4 rounded-lg bg-white p-4 shadow">
            <div class="flex flex-col gap-2">
              <h3>熱門標籤</h3>
              <div class="flex flex-row flex-wrap gap-x-2 gap-y-2">
                <button
                  class="w-fit rounded-full bg-orange-50 px-3 py-1 text-sm whitespace-nowrap text-orange-600">
                  # 鮮食
                </button>
                <button class="w-fit rounded-full bg-[#f2b29b] px-3 py-1 text-sm whitespace-nowrap">
                  # 寵物健康
                </button>
                <button class="w-fit rounded-full bg-[#f2b29b] px-3 py-1 text-sm whitespace-nowrap">
                  # 訓練技巧
                </button>
              </div>
            </div>
            <div class="rounded-2xl p-4">
              <div class="mb-3 flex items-center justify-between">
                <h3 class="text-base font-semibold text-stone-800">最近瀏覽</h3>

                <button
                  v-if="recentViewedArticles.length > 0"
                  class="text-xs text-stone-400 hover:text-amber-600"
                  @click="clearRecentViewed">
                  清除
                </button>
              </div>

              <ul
                v-if="recentViewedArticles.length > 0"
                class="flex flex-col divide-y divide-stone-100">
                <li v-for="article in recentViewedArticles" :key="article.articleId" class="py-2">
                  <RouterLink
                    :to="{ name: 'article-detail', params: { id: article.articleId } }"
                    class="group block rounded-lg px-2 py-1 transition-colors hover:bg-amber-50">
                    <p
                      class="line-clamp-2 text-sm font-medium text-stone-700 group-hover:text-amber-700">
                      {{ article.title }}
                    </p>

                    <p class="mt-1 text-xs text-stone-400">
                      {{ article.categoryName }}
                    </p>
                  </RouterLink>
                </li>
              </ul>

              <div
                v-else
                class="rounded-xl bg-stone-50 px-4 py-6 text-center text-sm text-stone-400">
                尚無最近瀏覽紀錄
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
