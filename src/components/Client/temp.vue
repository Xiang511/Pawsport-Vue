<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import service from '@/utils/request' // 💡 確保引入你的 Axios 實例

const route = useRoute()
const router = useRouter()

// === 狀態管理 ===
const article = ref(null)
const isLoading = ref(true)
const isError = ref(false)

// === 取得後端詳細資料 ===
const fetchArticleDetail = async () => {
  isLoading.value = true
  isError.value = false

  // 💡 從路由網址列拿到文章 id (例如 /community/article/5)
  const articleId = route.params.id

  try {
    // 💡 精準對接你的 UserController HttpGet("articles/{id}") 路由
    // 註：如果你的 Controller 有設 [Route("api/[controller]")]，前面可能要補上 /User
    const response = await request.get('/Articles/' + articleId)
    // 💡 關鍵：對應 Success 封裝的雙層 .data
    article.value = response.data.data
  } catch (error) {
    console.error('撈取文章詳細失敗:', error)
    isError.value = true
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchArticleDetail()
})

const goBack = () => {
  router.push({ name: 'community-home' }) // 💡 換成你社群首頁的路由名稱
}
</script>

<template>
  <div class="min-h-screen bg-[#f9f6f4] py-8">
    <div class="container mx-auto max-w-4xl px-4">
      <button
        @click="goBack"
        class="mb-4 flex items-center gap-2 text-sm text-stone-500 transition-colors hover:text-stone-800">
        🔙 返回社群首頁
      </button>

      <div v-if="isLoading" class="py-20 text-center text-stone-500">⏳ 載入文章中，請稍候...</div>
      <div v-else-if="isError || !article" class="py-20 text-center text-red-500">
        ❌ 找不到文章或系統異常。
      </div>

      <article v-else class="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm md:p-8">
        <header class="border-b border-stone-100 pb-4">
          <span
            class="inline-block rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600">
            {{ article.categoryName }}
          </span>
          <h1 class="mt-2 text-2xl font-bold text-stone-800 md:text-3xl">
            {{ article.title }}
          </h1>

          <div class="mt-4 flex flex-wrap items-center gap-4 text-xs text-stone-400">
            <span>✍️ 作者：{{ article.userName }}</span>
            <span>📅 發表於：{{ article.createAt }}</span>
            <span>👁️ 點閱數：{{ article.viewCount }} 次</span>
            <span>🔖 收藏數：{{ article.bookmarkCount }}</span>
          </div>

          <div v-if="article.tags && article.tags.length" class="mt-3 flex flex-wrap gap-2">
            <span
              v-for="tag in article.tags"
              :key="tag"
              class="rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-500">
              #{{ tag }}
            </span>
          </div>
        </header>

        <main
          class="prose article-content max-w-none py-6 text-stone-700"
          v-html="article.content"></main>
      </article>
    </div>
  </div>
</template>

<style scoped>
/* 💡 針對 v-html 渲染出來的富文本內容做全域樣式保護 */
.article-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 12px auto;
  display: block;
}

.article-content :deep(p) {
  line-height: 1.7;
  margin-bottom: 1em;
}
</style>
