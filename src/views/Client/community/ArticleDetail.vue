<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Heart,
  ChevronUp,
  MessageSquare,
  Bookmark,
  Link2,
  ChevronLeft,
  Eye,
  Calendar,
} from 'lucide-vue-next'
import { useDateTime } from '@/composables/useDateTime'
import request from '@/api/axios'

const route = useRoute()
const router = useRouter()

const articleDetail = ref(null)
const isLoading = ref(false)
const isError = ref(false)

const { formatLocalDate, timeAgo } = useDateTime()
// 取得文章詳細資料
const fetchArticleDetail = async () => {
  isLoading.value = true
  isError.value = false

  try {
    const articleId = route.params.id
    // 對應你的 UserController 路由
    const response = await request.get(`/Users/articles/${articleId}`)

    // 對接 C# Success 封裝的雙層 .data
    articleDetail.value = response.data.data
  } catch (error) {
    console.error('取得文章詳細失敗:', error)
    isError.value = true
  } finally {
    isLoading.value = false
  }
}

const goBack = () => {
  router.push({
    name: 'community-home',
    query: {
      page: route.query.fromPage || 1,
      parent: route.query.fromParent || undefined,
      sub: route.query.fromSub || undefined,
      keyword: route.query.fromKeyword || undefined,
    },
  })
}

const goToHome = () => {
  router.push({ name: 'home' })
}

onMounted(() => {
  fetchArticleDetail()
})
</script>

<template>
  <div class="min-h-screen bg-[#f9f6f4] pt-6 pb-12 text-slate-800">
    <div v-if="isLoading" class="py-20 text-center text-slate-500">
      <div
        class="mb-2 inline-block h-6 w-6 animate-spin rounded-full border-2 border-orange-500 border-t-transparent"></div>
      <div>⏳ 文章讀取中...</div>
    </div>

    <div v-else-if="isError" class="py-20 text-center text-red-500">
      ❌ 文章載入失敗
      <button @click="goBack" class="mx-auto mt-4 block text-sm text-slate-500 hover:underline">
        返回首頁
      </button>
    </div>

    <div v-else-if="articleDetail">
      <nav
        class="container mx-auto flex max-w-6xl items-center gap-2 px-4 py-3 text-sm text-slate-500">
        <button @click="goToHome" class="flex items-center gap-0.5 hover:text-orange-600">
          首頁
        </button>
        <span>></span>
        <button @click="goBack" class="flex items-center gap-0.5 hover:text-orange-600">
          社群
        </button>
        <span>></span>
        <span class="font-medium text-orange-600">{{ articleDetail.categoryName }}</span>
        <span>></span>
        <span class="line-clamp-1 max-w-xs">{{ articleDetail.title }}</span>
      </nav>

      <div class="container mx-auto w-full max-w-6xl px-4">
        <div class="flex flex-col gap-6 py-4 md:flex-row">
          <main class="order-1 w-full md:order-2 md:w-3/4">
            <article class="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
              <header class="border-b border-slate-100 p-6 md:p-8">
                <div class="mb-3 flex items-center gap-2">
                  <span class="rounded bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-600">
                    {{ articleDetail.categoryName }}
                  </span>
                  <div class="flex gap-2">
                    <span
                      v-for="tag in articleDetail.tags"
                      :key="tag"
                      class="cursor-pointer text-xs text-blue-500 hover:underline">
                      #{{ tag }}
                    </span>
                  </div>
                </div>
                <h1 class="text-2xl leading-tight font-black text-slate-800 md:text-3xl">
                  {{ articleDetail.title }}
                </h1>
              </header>

              <section class="px-6 py-8 md:px-10">
                <div
                  v-html="articleDetail.content"
                  class="prose prose-slate max-w-none leading-relaxed text-slate-700 [&_.ql-align-center]:text-center [&_.ql-size-large]:text-2xl [&_.ql-size-large]:font-bold [&_img]:mx-auto [&_img]:my-6 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-xl [&_img]:shadow-sm [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-6 [&_span[style*='background-color']]:rounded [&_span[style*='background-color']]:px-1 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6"></div>
              </section>

              <footer
                class="flex items-center justify-between border-t border-slate-50 bg-slate-50/50 px-6 py-4">
                <div class="flex items-center gap-4">
                  <button
                    class="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-slate-500 transition hover:bg-orange-100 hover:text-orange-600">
                    <ChevronUp class="h-5 w-5" />
                    <span class="text-sm font-bold">{{ articleDetail.likes ?? 0 }}</span>
                  </button>
                  <button
                    class="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-slate-500 transition hover:bg-slate-200">
                    <MessageSquare class="h-4 w-4" />
                    <span class="text-sm font-bold">2</span>
                  </button>
                </div>

                <div class="flex items-center gap-2">
                  <button
                    class="rounded-lg p-2 text-slate-400 transition hover:bg-slate-200 hover:text-amber-500"
                    title="收藏">
                    <Bookmark class="h-5 w-5" />
                  </button>
                  <button
                    class="rounded-lg p-2 text-slate-400 transition hover:bg-slate-200 hover:text-blue-500"
                    title="分享">
                    <Link2 class="h-5 w-5" />
                  </button>
                </div>
              </footer>
            </article>

            <section class="mt-6 space-y-4">
              <div class="flex items-center justify-between px-2">
                <h3 class="text-lg font-bold">全部回覆 (2)</h3>
                <select
                  class="rounded border border-slate-200 bg-transparent px-2 py-1 text-sm text-slate-600 outline-none">
                  <option>熱門排序</option>
                  <option>最新優先</option>
                </select>
              </div>

              <div
                class="rounded-xl border border-l-4 border-slate-100 border-slate-300 border-l-slate-300 bg-white p-6 shadow-sm">
                <div class="flex items-start gap-4">
                  <img
                    src="https://placecats.com/g/50/50"
                    class="h-10 w-10 rounded-full object-cover" />
                  <div class="flex-1">
                    <div class="mb-1 flex items-center justify-between">
                      <span class="text-sm font-bold text-slate-700">二樓路人甲</span>
                      <span class="text-xs text-slate-400">B2 | 2026-05-12 11:20</span>
                    </div>
                    <p class="text-sm text-slate-600">
                      這篇分析好專業！推一個，我家貓咪真的很愛盯著海鮮看。
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </main>

          <aside class="order-2 w-full md:order-1 md:w-1/4">
            <div class="sticky top-6 flex flex-col gap-4">
              <div class="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
                <div class="h-16 bg-linear-to-r from-orange-400 to-amber-500"></div>
                <div class="px-4 pb-6">
                  <div class="-mt-8 mb-3 flex justify-center">
                    <img
                      :src="articleDetail.userPhoto || 'https://placecats.com/g/100/100'"
                      class="h-20 w-20 rounded-full border-4 border-white object-cover shadow-sm" />
                  </div>
                  <div class="text-center">
                    <h3 class="text-lg font-bold text-slate-800">{{ articleDetail.userName }}</h3>
                    <p class="text-xs text-slate-400">Lv.99 貓咪觀察員</p>
                    <button
                      class="mt-4 w-full rounded-full bg-slate-900 py-2 text-sm font-medium text-white transition hover:bg-slate-700">
                      + 追蹤
                    </button>
                  </div>
                </div>
              </div>

              <div class="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                <h4 class="mb-3 flex items-center gap-1 text-sm font-bold text-slate-400">
                  文章數據
                </h4>
                <div class="space-y-2.5 text-sm text-slate-600">
                  <div class="flex items-center justify-between">
                    <span class="flex items-center gap-1.5 text-slate-500">
                      <Eye class="h-4 w-4" />
                      閱讀數
                    </span>
                    <span class="font-mono font-bold text-slate-700">
                      {{ articleDetail.viewCount }}
                    </span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="flex items-center gap-1.5 text-slate-500">
                      <Bookmark class="h-4 w-4" />
                      收藏數
                    </span>
                    <span class="font-mono font-bold text-slate-700">
                      {{ articleDetail.bookmarkCount }}
                    </span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="flex items-center gap-1.5 text-slate-500">
                      <Calendar class="h-4 w-4" />
                      發表日期
                    </span>
                    <span class="font-mono text-xs text-slate-700">
                      {{ formatLocalDate(articleDetail.createAt) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
