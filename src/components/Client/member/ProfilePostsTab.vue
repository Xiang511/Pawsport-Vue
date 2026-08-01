<script setup>
import { Plus, FileText, Clock, Users, ChevronRight } from 'lucide-vue-next'
import { useMemberPosts } from '@/composables/Client/member/useMemberPosts'
import { useMemberUtils } from '@/composables/Client/member/useMemberUtils'

const props = defineProps({
  myPosts: { type: Array, default: () => [] },
  postsLoading: { type: Boolean, default: false },
})

const { postStatusLabel, postStatusClass } = useMemberPosts()
const { formatDate } = useMemberUtils()
</script>

<template>
  <div class="space-y-5">
    <div class="flex items-center justify-between">
      <h2 class="font-fredoka text-2xl font-black text-[#445944]">我的文章</h2>
      <router-link
        to="/create-article"
        class="flex items-center gap-1.5 rounded-xl border-2 border-[#445944] bg-[#FAE4AE] px-4 py-2 text-sm font-bold text-[#445944] shadow-[2px_2px_0px_#445944] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#445944]">
        <Plus :size="15" />
        寫文章
      </router-link>
    </div>

    <!-- 載入中 -->
    <div v-if="postsLoading" class="flex items-center justify-center py-16 text-[#445944]">
      <span class="animate-pulse text-sm font-bold">文章載入中...</span>
    </div>

    <template v-else>
      <div class="space-y-4">
        <router-link
          v-for="post in myPosts"
          :key="post.id"
          :to="{ name: 'article-detail', params: { id: post.id } }"
          class="group block overflow-hidden rounded-3xl border-4 border-[#445944] bg-white shadow-[4px_4px_0px_#445944] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#445944]">
          <!-- 封面圖 -->
          <div v-if="post.mainImage" class="aspect-[3/1] overflow-hidden bg-gray-100">
            <img
              :src="post.mainImage"
              :alt="post.title"
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              @error="(e) => (e.target.parentElement.style.display = 'none')" />
          </div>

          <div class="p-5">
            <!-- 標籤列 -->
            <div class="mb-2 flex flex-wrap items-center gap-2">
              <span
                class="rounded-full border-2 px-2.5 py-0.5 text-xs font-bold"
                :class="postStatusClass(post.status)">
                {{ postStatusLabel(post.status) }}
              </span>
              <span
                class="rounded-full border-2 border-[#445944] bg-[#D4E6D0] px-2.5 py-0.5 text-xs font-bold text-[#445944]">
                {{ post.tag }}
              </span>
              <span
                v-for="t in post.tags.slice(0, 2)"
                :key="t"
                class="rounded-full border border-gray-300 bg-gray-50 px-2 py-0.5 text-xs text-gray-500">
                # {{ t }}
              </span>
            </div>

            <h3
              class="font-fredoka mb-1 line-clamp-2 text-lg font-black text-gray-800 group-hover:text-[#445944]">
              {{ post.title }}
            </h3>
            <p class="mb-3 line-clamp-2 text-sm text-gray-500">{{ post.summary }}</p>

            <div class="flex items-center justify-between text-xs text-gray-400">
              <span class="flex items-center gap-1">
                <Clock :size="12" />
                {{ formatDate(post.date) }}
              </span>
              <span class="flex items-center gap-1">
                👁 {{ post.viewCount.toLocaleString() }} 次瀏覽
              </span>
            </div>
          </div>
        </router-link>

        <!-- 空狀態 -->
        <div
          v-if="myPosts.length === 0"
          class="rounded-3xl border-4 border-dashed border-[#445944] bg-[#FCF4E5] py-16 text-center">
          <FileText :size="40" class="mx-auto mb-3 text-[#445944]/30" />
          <p class="font-bold text-gray-400">還沒有發表文章，來分享你的毛孩日常吧！</p>
          <router-link
            to="/create-article"
            class="mt-4 inline-flex items-center gap-1.5 rounded-xl border-2 border-[#445944] bg-[#FAE4AE] px-4 py-2 text-sm font-bold text-[#445944]">
            <Plus :size="14" />
            寫第一篇文章
          </router-link>
        </div>
      </div>

      <router-link
        to="/community-home"
        class="flex items-center justify-center gap-2 rounded-2xl border-2 border-[#445944] bg-[#FAE4AE] py-3 text-sm font-bold text-[#445944] shadow-[3px_3px_0px_#445944] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_#445944]">
        <Users :size="18" />
        前往社群首頁
        <ChevronRight :size="16" />
      </router-link>
    </template>
  </div>
</template>
