<script setup>
import { ref, onMounted, watch, computed } from 'vue'
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
  Hourglass,
  Sparkles,
  Undo2,
} from 'lucide-vue-next'

import { useDateTime } from '@/composables/useDateTime'
import Article_CommentSection from '@/components/Client/Article_CommentSection.vue'
import ScrollToTopButton from '@/components/Client/ScrollToTopButton.vue'
import { useArticleComments } from '@/composables/useArticleComments'

import request from '@/api/axios'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const route = useRoute()
const router = useRouter()
const articleId = computed(() => Number(route.params.id))

const {
  comments,
  commentText,
  isCommentLoading,
  isCommentError,
  isSubmittingComment,
  fetchComments,
  submitComment,
} = useArticleComments(articleId)

const { formatLocalDate, timeAgo } = useDateTime()

const articleDetail = ref(null)
const isLoading = ref(false)
const isError = ref(false)

// 取得文章詳細資料
const fetchArticleDetail = async () => {
  isLoading.value = true
  isError.value = false

  try {
    const response = await request.get(`/Users/articles/${articleId.value}`)
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

onMounted(async () => {
  await fetchArticleDetail()
  await fetchComments()
})
</script>

<template>
  <!-- 外層對齊暖沙背景與 Fredoka 字型 -->
  <div class="font-fredoka min-h-screen bg-[#FCF4E5] pt-6 pb-12 text-slate-800 antialiased">
    <!-- 讀取狀態 -->
    <div v-if="isLoading" class="animate-pulse py-24 text-center text-lg font-black text-[#445944]">
      <div
        class="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#445944] border-t-transparent"></div>
      <div>⏳ 尋找文章內容中...</div>
    </div>

    <!-- 錯誤狀態 -->
    <div v-else-if="isError" class="py-24 text-center text-lg font-black text-red-500">
      ❌ 文章載入失敗
      <button
        @click="goBack"
        class="mx-auto mt-6 flex items-center gap-1.5 rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] px-4 py-2 font-black text-[#445944] shadow-[3px_3px_0px_#445944] transition hover:bg-[#445944] hover:text-white active:translate-y-[1px]">
        <Undo2 :size="16" />
        返回社群首頁
      </button>
    </div>

    <div v-else-if="articleDetail" class="">
      <!-- BREADCRUMBS NAVIGATION -->
      <nav
        class="container mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-4 py-4 text-sm font-bold text-[#445944]">
        <button @click="goToHome" class="flex items-center gap-0.5 hover:underline">首頁</button>
        <span class="font-bold text-gray-400">></span>
        <button @click="goBack" class="flex items-center gap-0.5 hover:underline">社群</button>
        <span class="font-bold text-gray-400">></span>
        <span
          class="rounded-md border border-[#445944] bg-[#FCF4E5] px-2.5 py-0.5 text-xs text-[#445944] shadow-[1px_1px_0px_#445944]">
          {{ articleDetail.categoryName }}
        </span>
        <span class="font-bold text-gray-400">></span>
        <span class="line-clamp-1 max-w-xs font-medium text-gray-500">
          {{ articleDetail.title }}
        </span>
      </nav>

      <div class="container mx-auto w-full max-w-6xl px-4">
        <!-- 左右分欄：行動版為 Main 在上，Aside 在下 -->
        <div class="flex flex-col gap-6 py-4 md:flex-row">
          <!-- Main Content Column -->
          <main class="order-1 w-full md:order-2 md:w-3/4">
            <!-- ARTICLE CARD -->
            <article
              class="mb-6 overflow-hidden rounded-3xl border-4 border-[#445944] bg-white shadow-[6px_6px_0px_#445944]">
              <!-- HEADER SECTION -->
              <header class="border-b-4 border-[#445944] bg-[#FCF4E5] p-6 md:p-8">
                <div class="mb-4 flex flex-wrap items-center gap-2.5">
                  <span
                    class="rounded-xl border-2 border-[#445944] bg-amber-400 px-3 py-1 text-xs font-black text-[#445944] shadow-[2px_2px_0px_#445944]">
                    {{ articleDetail.categoryName }}
                  </span>

                  <div class="flex gap-2">
                    <span
                      v-for="tag in articleDetail.tags || []"
                      :key="tag"
                      class="cursor-pointer rounded-xl border-2 border-[#445944] bg-white px-2.5 py-0.5 text-xs font-black text-[#445944] shadow-[2px_2px_0px_#445944] hover:underline">
                      #{{ tag }}
                    </span>
                  </div>
                </div>

                <h1 class="md:text-3.5xl text-2xl leading-tight font-black text-[#445944]">
                  {{ articleDetail.title }}
                </h1>
              </header>

              <!-- CONTENT SECTION (Rich HTML) -->
              <section class="px-6 py-8 md:px-10">
                <div
                  v-html="articleDetail.content"
                  class="prose prose-slate max-w-none leading-relaxed font-bold text-[#445944] [&_.ql-align-center]:text-center [&_.ql-align-center_img]:mx-auto [&_.ql-align-right_img]:mr-0 [&_.ql-align-right_img]:ml-auto [&_.ql-size-large]:text-2xl [&_.ql-size-large]:font-black [&_img]:my-6 [&_img]:mr-auto [&_img]:ml-0 [&_img]:block [&_img]:h-auto [&_img]:max-h-[480px] [&_img]:max-w-full [&_img]:rounded-2xl [&_img]:border-4 [&_img]:border-[#445944] [&_img]:object-contain [&_img]:shadow-[4px_4px_0px_#445944] [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-6 [&_span[style*='background-color']]:rounded [&_span[style*='background-color']]:px-1 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6"></div>
              </section>

              <!-- FOOTER ROW -->
              <footer
                class="flex items-center justify-between border-t-4 border-[#445944] bg-[#FCF4E5] px-6 py-4">
                <div class="flex items-center gap-4">
                  <button
                    class="flex items-center gap-1.5 rounded-xl border-2 border-[#445944] bg-white px-3.5 py-1.5 text-[#445944] shadow-[2px_2px_0px_#445944] transition hover:bg-[#445944] hover:text-white active:translate-y-[1px]">
                    <ChevronUp class="h-5 w-5" />
                    <span class="text-sm font-black">{{ articleDetail.likeCount ?? 0 }}</span>
                  </button>
                  <button
                    class="flex items-center gap-1.5 rounded-xl border-2 border-[#445944] bg-white px-3.5 py-1.5 text-[#445944] shadow-[2px_2px_0px_#445944] transition hover:bg-[#445944] hover:text-white active:translate-y-[1px]">
                    <MessageSquare class="h-4 w-4" />
                    <span class="text-sm font-black">{{ comments.length }}</span>
                  </button>
                </div>

                <div class="flex items-center gap-2">
                  <button
                    class="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-[#445944] bg-white text-[#445944] shadow-[2px_2px_0px_#445944] transition hover:bg-[#445944] hover:text-white active:translate-y-[1px]"
                    title="收藏">
                    <Bookmark class="h-5 w-5" />
                  </button>
                  <button
                    class="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-[#445944] bg-white text-[#445944] shadow-[2px_2px_0px_#445944] transition hover:bg-[#445944] hover:text-white active:translate-y-[1px]"
                    title="分享">
                    <Link2 class="h-5 w-5" />
                  </button>
                </div>
              </footer>
            </article>

            <!-- COMMENTS SECTION -->
            <Article_CommentSection
              v-model:commentText="commentText"
              :comments="comments"
              :is-comment-loading="isCommentLoading"
              :is-comment-error="isCommentError"
              :is-submitting-comment="isSubmittingComment"
              @submit-comment="submitComment" />
          </main>

          <!-- Aside Profile / Stats Column -->
          <aside class="order-2 w-full md:order-1 md:w-1/4">
            <div class="sticky top-30 flex flex-col gap-6">
              <!-- AUTHOR PROFILE CARD -->
              <div
                class="overflow-hidden rounded-3xl border-4 border-[#445944] bg-white shadow-[6px_6px_0px_#445944]">
                <!-- 上方柔和色塊 -->
                <div class="h-18 border-b-4 border-[#445944] bg-[#FCF4E5]"></div>

                <div class="px-5 pb-6">
                  <!-- 頭像 -->
                  <div class="-mt-9 mb-3 flex justify-center">
                    <div class="rounded-full border-4 border-[#445944] bg-white p-1 shadow-md">
                      <img
                        :src="articleDetail.userPhoto || 'https://placecats.com/g/100/100'"
                        class="h-20 w-20 rounded-full object-cover" />
                    </div>
                  </div>

                  <!-- 作者資訊 -->
                  <div class="text-center">
                    <p class="mb-1 text-xs font-black tracking-wide text-amber-600">文章作者</p>

                    <h3 class="text-lg font-black text-[#445944]">
                      {{ articleDetail.userName }}
                    </h3>

                    <button
                      class="mt-4 w-full rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] py-2.5 text-sm font-black text-[#445944] shadow-[3px_3px_0px_#445944] transition-all hover:bg-[#445944] hover:text-white active:translate-y-[1px]">
                      + 追蹤作者
                    </button>
                  </div>
                </div>
              </div>

              <!-- ARTICLE STATS CARD -->
              <div
                class="rounded-3xl border-4 border-[#445944] bg-white p-5 shadow-[6px_6px_0px_#445944]">
                <h4
                  class="mb-4 flex items-center gap-1 border-b-2 border-[#445944]/10 pb-2 text-sm font-black text-[#445944]">
                  <Sparkles :size="14" class="animate-spin-slow text-amber-500" />
                  文章數據
                </h4>
                <div class="space-y-3.5 text-sm font-bold text-gray-700">
                  <div class="flex items-center justify-between">
                    <span class="flex items-center gap-1.5 text-[#445944]/75">
                      <Eye class="h-4 w-4" />
                      閱讀數
                    </span>
                    <span class="font-mono font-black text-[#445944]">
                      {{ articleDetail.viewCount }}
                    </span>
                  </div>

                  <div class="flex items-center justify-between">
                    <span class="flex items-center gap-1.5 text-[#445944]/75">
                      <Bookmark class="h-4 w-4" />
                      收藏數
                    </span>
                    <span class="font-mono font-black text-[#445944]">
                      {{ articleDetail.bookmarkCount }}
                    </span>
                  </div>

                  <div class="flex items-center justify-between ">
                    <span class="flex items-center gap-1.5 text-[#445944]/75">
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
</style>
