<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ChevronLeft, ChevronRight, Sparkles, Plus } from 'lucide-vue-next'

// 自己做的卡片樣式
import Article_ListCard from '@/components/Client/Article_ListCard.vue'
import { useCommunityHome } from '@/composables/Client/useCommunityHome'
import ScrollToTopButton from '@/components/Client/ScrollToTopButton.vue'

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
  sortType,
} = useCommunityHome()

const recentViewedArticles = ref([])
const searchInput = ref('')
const recentSearchedTags = ref([])

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

  if (!tagText) return

  saveRecentSearchedTag(tagText)

  selectedTag.value = tagText
  searchInput.value = `#${tagText}`
  searchQuery.value = ''
  currentParentId.value = 0
  currentSubId.value = 0
  currentPage.value = 1

  await fetchData('', tagText)
}

const saveRecentSearchedTag = (tag) => {
  const tagText = String(tag || '')
    .replace(/^#/, '')
    .trim()
  if (!tagText) return

  const key = 'recentSearchedTags'
  const oldData = JSON.parse(localStorage.getItem(key)) || []

  const filtered = oldData.filter((item) => item !== tagText)
  const updated = [tagText, ...filtered].slice(0, 8)

  localStorage.setItem(key, JSON.stringify(updated))
  recentSearchedTags.value = updated
}

const clearSearch = async () => {
  searchInput.value = ''
  searchQuery.value = ''
  selectedTag.value = ''
  currentPage.value = 1

  await fetchData()
}

const clearRecentSearchedTags = () => {
  localStorage.removeItem('recentSearchedTags')
  recentSearchedTags.value = []
}

const handleSelectParent = async (id) => {
  const parentId = Number(id)

  // 按「全部」時，清除搜尋與標籤，重新撈全部文章
  if (parentId === 0) {
    searchInput.value = ''
    searchQuery.value = ''
    selectedTag.value = ''
    currentParentId.value = 0
    currentSubId.value = 0
    currentPage.value = 1

    await fetchData()
    return
  }

  selectParent(parentId)
}

const handleSortChange = () => {
  currentPage.value = 1
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
  recentSearchedTags.value = JSON.parse(localStorage.getItem('recentSearchedTags')) || []
})
</script>

<template>
  <!-- 頁面最外層：對齊 warm sand 背景與 Fredoka 字型 -->
  <div class="font-fredoka min-h-screen bg-[#FCF4E5] text-gray-800 antialiased">
    <!-- HERO BANNER SECTION -->
    <section class="relative overflow-hidden bg-[#FCF4E5] px-6 pt-12 pb-8 md:pt-16 md:pb-12">
      <!-- Floating Background Ornaments -->
      <div class="animate-float pointer-events-none absolute top-10 left-10 opacity-20">
        <span class="text-4xl">🐾</span>
      </div>
      <div
        class="animate-float delay-2s pointer-events-none absolute right-20 bottom-10 opacity-20">
        <span class="text-4xl">💬</span>
      </div>
      <div class="animate-float delay-4s pointer-events-none absolute top-24 right-1/4 opacity-20">
        <span class="text-4xl">✨</span>
      </div>

      <div class="mx-auto max-w-7xl">
        <div class="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          <!-- Title Text Block -->
          <div class="text-center md:text-left">
            <div
              class="mb-4 inline-flex items-center gap-1.5 rounded-full bg-[#7a6856] px-3.5 py-1 text-sm font-black tracking-wider text-white uppercase">
              <Sparkles :size="12" class="animate-spin-slow text-amber-500" />
              PETMILY FORUM
            </div>
            <h1
              class="mb-4 text-4xl font-black tracking-tight text-[#445944] md:text-5xl lg:text-6xl">
              社群專區
            </h1>
            <p class="max-w-md text-base leading-relaxed font-bold text-gray-600 md:text-lg">
              歡迎來到我們的寵物社群！
              <br />
              在這裡，你可以與全台的毛家長交流經驗、分享溫馨故事與實用知識。
            </p>
          </div>

          <!-- Premium Banner Image Framed Card -->
          <div class="relative w-full max-w-md shrink-0">
            <div
              class="relative overflow-hidden rounded-3xl border-4 border-[#445944] bg-white p-2 shadow-[8px_8px_0px_#445944] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[4px_4px_0px_#445944]">
              <img
                src="/images/banner/dogs-playing-together-stockcake.jpg"
                alt="Petmily Community Banner"
                class="h-56 w-full rounded-2xl object-cover object-center" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 內容區：最大1280px -->
    <div class="container mx-auto w-full max-w-7xl px-4">
      <!-- 左右分邊容器，flex -->
      <div class="flex flex-col gap-6 py-8 md:flex-row">
        <!-- 左邊 70%：文章與分類區 -->
        <main class="flex w-full flex-col gap-8 md:w-3/4">
          <!-- 今日焦點焦點告示 -->
          <div
            class="flex items-center gap-3 rounded-2xl border-4 border-[#445944] bg-[#FCF4E5] px-4 py-3.5 shadow-[4px_4px_0px_#445944]">
            <span
              class="animate-bounce-slow flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-[#445944] bg-amber-400 text-lg shadow-[2px_2px_0px_#445944]">
              📢
            </span>
            <p class="text-sm leading-relaxed font-bold text-gray-800">
              <span class="font-black text-[#445944]">今日焦點：</span>
              歡迎來到 Petmily！本週六將舉辦「線上毛孩鮮食講座」，詳情請密切注意官方消息。
            </p>
          </div>

          <div class="flex flex-col gap-6">
            <!-- 大分類區塊 -->
            <section
              class="rounded-3xl border-4 border-[#445944] bg-white p-6 shadow-[6px_6px_0px_#445944]">
              <h2
                class="mb-4 flex items-center gap-2 text-lg font-black tracking-wide text-[#445944]">
                <span
                  class="inline-block h-5 w-2.5 rounded-full border border-[#445944] bg-amber-400"></span>
                分類主題瀏覽
              </h2>

              <div
                class="flex flex-wrap gap-2.5 rounded-2xl border-2 border-dashed border-[#445944]/30 bg-[#FDF9F3] p-4">
                <button
                  v-for="c in parentCategories"
                  :key="c.categoryid"
                  @click="handleSelectParent(c.categoryid)"
                  :class="[
                    'rounded-xl border-2 border-[#445944] px-4 py-2 text-sm font-black transition-all',
                    Number(currentParentId) === Number(c.categoryid)
                      ? 'bg-[#445944] text-white shadow-[2px_2px_0px_#445944]'
                      : 'bg-white text-[#445944] shadow-[2px_2px_0px_#445944] hover:bg-[#FCF4E5] active:translate-y-[1px]',
                  ]">
                  {{ c.categoryname }}
                </button>
              </div>
            </section>

            <!-- 小分類區塊：選全部時完全不出現 -->
            <section
              v-if="Number(currentParentId) !== 0 && subCategories.length > 0"
              class="rounded-3xl border-4 border-[#445944] bg-white p-6 shadow-[6px_6px_0px_#445944]">
              <h2
                class="mb-4 flex items-center gap-2 text-lg font-black tracking-wide text-[#445944]">
                <span
                  class="inline-block h-5 w-2.5 rounded-full border border-[#445944] bg-[#445944]"></span>
                子主題分類
              </h2>

              <div
                class="flex flex-wrap gap-2 rounded-2xl border-2 border-dashed border-[#445944]/30 bg-[#FDF9F3] p-4">
                <button
                  @click="selectSub(0)"
                  :class="[
                    'rounded-xl border-2 border-[#445944] px-3 py-1.5 text-xs font-black transition-all',
                    Number(currentSubId) === 0
                      ? 'bg-[#445944] text-white shadow-[2px_2px_0px_#445944]'
                      : 'bg-white text-[#445944] shadow-[2px_2px_0px_#445944] hover:bg-[#FCF4E5] active:translate-y-[1px]',
                  ]">
                  全部小分類
                </button>

                <button
                  v-for="sc in subCategories"
                  :key="sc.categoryid"
                  @click="selectSub(sc.categoryid)"
                  :class="[
                    'rounded-xl border-2 border-[#445944] px-3 py-1.5 text-xs font-black transition-all',
                    Number(currentSubId) === Number(sc.categoryid)
                      ? 'bg-[#445944] text-white shadow-[2px_2px_0px_#445944]'
                      : 'bg-white text-[#445944] shadow-[2px_2px_0px_#445944] hover:bg-[#FCF4E5] active:translate-y-[1px]',
                  ]">
                  {{ sc.categoryname }}
                </button>
              </div>
            </section>

            <!-- 文章列表 -->
            <section
              class="rounded-3xl border-4 border-[#445944] bg-white p-6 shadow-[6px_6px_0px_#445944]">
              <!-- 文章列表 Header + 排序 -->
              <div class="mb-6 flex items-center justify-between border-b-4 border-[#445944] pb-4">
                <div>
                  <h3 class="text-lg font-black tracking-wide text-[#445944]">文章列表</h3>
                  <p class="text-xs font-bold text-gray-400">可依發文時間或觀看數排序</p>
                </div>

                <select
                  v-model="sortType"
                  class="cursor-pointer appearance-none rounded-xl border-2 border-[#445944] bg-[#FCF4E5] px-3.5 py-2 text-sm font-black text-[#445944] shadow-[2px_2px_0px_#445944] focus:border-[#445944] focus:ring-0 focus:outline-none"
                  @change="handleSortChange">
                  <option value="newest">最新發文</option>
                  <option value="oldest">最早發文</option>
                  <option value="mostViewed">最多觀看</option>
                </select>
              </div>

              <!-- 載入與錯誤狀態 -->
              <div
                v-if="isLoading"
                class="animate-pulse py-16 text-center text-lg font-black text-[#445944]">
                ⏳ 尋找貼文知識中...
              </div>

              <div v-else-if="isError" class="py-16 text-center text-lg font-black text-red-500">
                ❌ 系統異常，請稍後再試。
              </div>

              <!-- 渲染列表 -->
              <div v-else class="space-y-4">
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
                  class="cursor-pointer hover:bg-[#FCF4E5]" />

                <!-- 查無資料時顯示 -->
                <div
                  v-if="pagedArticles.length === 0"
                  class="rounded-2xl border-2 border-dashed border-[#445944]/30 bg-[#FDF9F3] py-16 text-center font-bold text-gray-400">
                  🐾 找不到相關的文章喔！
                </div>
              </div>
            </section>

            <!-- 分頁列 -->
            <div v-if="totalPages > 1" class="mt-4 flex items-center justify-center gap-2">
              <button
                @click="currentPage = 1"
                :disabled="currentPage === 1"
                class="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-[#445944] bg-white font-black text-[#445944] shadow-[2px_2px_0px_#445944] transition hover:bg-[#FCF4E5] disabled:cursor-not-allowed disabled:opacity-40">
                <ChevronLeft :size="18" class="-mr-1.5" />
                <ChevronLeft :size="18" />
              </button>

              <button
                @click="currentPage--"
                :disabled="currentPage === 1"
                class="rounded-xl border-2 border-[#445944] bg-white px-3 py-1.5 text-xs font-black text-[#445944] shadow-[2px_2px_0px_#445944] transition hover:bg-[#FCF4E5] disabled:cursor-not-allowed disabled:opacity-40">
                上一頁
              </button>

              <span
                class="mx-2 rounded-xl border-2 border-[#445944] bg-[#FCF4E5] px-3.5 py-1.5 text-sm font-black text-[#445944] shadow-[2px_2px_0px_#445944]">
                第 {{ currentPage }} / {{ totalPages }} 頁
              </span>

              <button
                @click="currentPage++"
                :disabled="currentPage === totalPages"
                class="rounded-xl border-2 border-[#445944] bg-white px-3 py-1.5 text-xs font-black text-[#445944] shadow-[2px_2px_0px_#445944] transition hover:bg-[#FCF4E5] disabled:cursor-not-allowed disabled:opacity-40">
                下一頁
              </button>

              <button
                @click="currentPage = totalPages"
                :disabled="currentPage === totalPages"
                class="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-[#445944] bg-white font-black text-[#445944] shadow-[2px_2px_0px_#445944] transition hover:bg-[#FCF4E5] disabled:cursor-not-allowed disabled:opacity-40">
                <ChevronRight :size="18" />
                <ChevronRight :size="18" class="-ml-1.5" />
              </button>
            </div>
          </div>
        </main>

        <!-- 右邊 30%：側邊欄 (Aside Column) -->
        <aside class="flex w-full flex-col gap-6 md:w-1/4">
          <!-- 搜尋文章卡片 -->
          <div
            class="rounded-3xl border-4 border-[#445944] bg-white p-5 shadow-[6px_6px_0px_#445944]">
            <label class="mb-2 block text-sm font-black text-[#445944]">搜尋貼文</label>

            <div class="flex flex-col gap-2">
              <input
                v-model="searchInput"
                type="text"
                placeholder="搜尋標題、內容或作者..."
                class="w-full rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] px-4 py-2.5 text-sm font-bold text-gray-800 placeholder-gray-400 shadow-[2px_2px_0px_#445944] focus:border-[#445944] focus:ring-0 focus:outline-none"
                @keyup.enter="handleSearch" />

              <button
                type="button"
                class="w-full rounded-2xl border-2 border-[#445944] bg-[#445944] py-2.5 text-sm font-black text-white shadow-[2px_2px_0px_#445944] transition-all hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#445944]"
                @click="handleSearch">
                搜尋貼文
              </button>
            </div>

            <button
              v-if="searchInput.trim() || searchQuery.trim() || selectedTag.trim()"
              type="button"
              class="mt-3 block w-full text-center text-xs font-black text-amber-600 hover:underline"
              @click="clearSearch">
              ✕ 清除搜尋條件
            </button>
          </div>

          <!-- 新增貼文按鈕卡片 -->
          <div
            class="rounded-3xl border-4 border-[#445944] bg-white p-5 shadow-[6px_6px_0px_#445944]">
            <button
              @click="goToCreatePage"
              class="flex w-full items-center justify-center gap-1.5 rounded-2xl border-2 border-[#445944] bg-amber-400 py-3 text-base font-black text-[#445944] shadow-[4px_4px_0px_#445944] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#445944] active:translate-y-1">
              <Plus :size="20" class="stroke-[3]" />
              撰寫新貼文
            </button>
          </div>

          <!-- 最近搜尋 & 最近瀏覽區 -->
          <div
            class="space-y-6 rounded-3xl border-4 border-[#445944] bg-white p-5 shadow-[6px_6px_0px_#445944]">
            <!-- 最近搜尋的標籤 -->
            <div>
              <div
                class="mb-3 flex items-center justify-between border-b-2 border-[#445944]/10 pb-2">
                <h3 class="text-sm font-black text-[#445944]">最近搜尋標籤</h3>

                <button
                  v-if="recentSearchedTags.length > 0"
                  type="button"
                  class="text-xs font-bold text-gray-400 hover:text-amber-600"
                  @click="clearRecentSearchedTags">
                  清除 ✕
                </button>
              </div>

              <div v-if="recentSearchedTags.length > 0" class="flex flex-wrap gap-2">
                <button
                  v-for="tag in recentSearchedTags"
                  :key="tag"
                  type="button"
                  class="group rounded-xl border-2 border-[#445944] bg-[#FCF4E5] px-2.5 py-1 text-xs font-black text-[#445944] shadow-[2px_2px_0px_#445944] transition-all hover:bg-white active:translate-y-[1px]"
                  @click="handleTagSearch(tag)">
                  <span class="text-amber-500">#</span>
                  {{ tag }}
                </button>
              </div>

              <div
                v-else
                class="rounded-xl border-2 border-dashed border-[#445944]/20 bg-[#FDF9F3] px-4 py-4 text-center text-xs font-bold text-gray-400">
                尚無搜尋標籤
              </div>
            </div>

            <!-- 最近瀏覽 -->
            <div>
              <div
                class="mb-3 flex items-center justify-between border-b-2 border-[#445944]/10 pb-2">
                <h3 class="text-sm font-black text-[#445944]">最近瀏覽紀錄</h3>

                <button
                  v-if="recentViewedArticles.length > 0"
                  class="text-xs font-bold text-gray-400 hover:text-amber-600"
                  @click="clearRecentViewed">
                  清除 ✕
                </button>
              </div>

              <ul
                v-if="recentViewedArticles.length > 0"
                class="space-y-2 divide-y divide-[#445944]/10">
                <li
                  v-for="(article, idx) in recentViewedArticles"
                  :key="article.articleId"
                  :class="idx > 0 ? 'pt-2' : ''">
                  <RouterLink
                    :to="{ name: 'article-detail', params: { id: article.articleId } }"
                    class="group block rounded-xl border-2 border-transparent p-2 transition-all hover:border-[#445944] hover:bg-[#FCF4E5]">
                    <p class="line-clamp-2 text-xs font-black text-[#445944]">
                      {{ article.title }}
                    </p>
                    <p class="mt-1 text-[10px] font-bold text-gray-400">
                      {{ article.categoryName }}
                    </p>
                  </RouterLink>
                </li>
              </ul>

              <div
                v-else
                class="rounded-xl border-2 border-dashed border-[#445944]/20 bg-[#FDF9F3] px-4 py-4 text-center text-xs font-bold text-gray-400">
                尚無最近瀏覽紀錄
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
    <ScrollToTopButton />
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&family=Quicksand:wght@300..700&display=swap');

.font-fredoka {
  font-family: 'Fredoka', 'GenJyuu', sans-serif;
}

.animate-spin-slow {
  animation: spin 12s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-bounce-slow {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.delay-2s {
  animation-delay: 2s;
}

.delay-4s {
  animation-delay: 4s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-10px) rotate(3deg);
  }
}
</style>
