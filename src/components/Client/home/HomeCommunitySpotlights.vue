<script setup>
import { ChevronRight, Eye, ThumbsUp } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

defineProps({
  articles: {
    type: Array,
    default: () => [],
  },
})

const router = useRouter()
</script>

<template>
  <section class="bg-[#FCF4E5] py-20">
    <div class="mx-auto w-[90%] max-w-7xl">
      <div class="mb-12 flex flex-col justify-between md:flex-row md:items-end">
        <div>
          <span
            class="mb-3 inline-block rounded-full bg-[#7a6856] px-3 py-1 text-xs font-extrabold tracking-wider text-[#FCF4E5]">
            COMMUNITY TOPICS
          </span>
          <h2 class="text-3xl font-black text-[#445944] md:text-4xl">社群熱門話題 & 交流</h2>
        </div>
        <router-link
          to="/community-home"
          class="mt-4 flex items-center gap-1 text-sm font-bold text-[#7a6856] hover:underline md:mt-0">
          前往社群專區
          <ChevronRight :size="16" />
        </router-link>
      </div>

      <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div
          v-for="article in articles"
          :key="article.id"
          @click="router.push({ name: 'article-detail' })"
          class="group cursor-pointer overflow-hidden rounded-2xl border-2 border-[#445944] bg-white shadow-[4px_4px_0px_#445944] transition-shadow hover:border-[#7a6856] hover:shadow-[#7a6856]">
          <div class="relative h-44 overflow-hidden bg-gray-100">
            <span
              class="absolute top-3 left-3 z-10 rounded-full border border-[#445944] bg-[#FCF4E5] px-2.5 py-1 text-[10px] font-bold text-[#445944]">
              {{ article.categoryname }}
            </span>
            <img
              :src="article.image"
              :alt="article.title"
              class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
          </div>
          <div class="p-5">
            <h3
              class="mb-2 line-clamp-1 text-base font-extrabold text-[#445944] transition-colors group-hover:text-[#7a6856] md:text-lg">
              {{ article.title }}
            </h3>
            <p class="mb-4 line-clamp-2 text-xs leading-relaxed text-gray-500">
              {{ article.summary }}
            </p>
            <div class="flex items-center justify-between border-t border-gray-100 pt-3">
              <div class="flex items-center gap-2">
                <div
                  class="flex h-6 w-6 items-center justify-center rounded-full border border-[#445944] bg-[#FAE4AE] text-[10px] font-bold">
                  {{ article.author[0] }}
                </div>
                <span class="text-xs font-bold text-[#445944]">{{ article.author }}</span>
              </div>
              <div class="flex items-center gap-3 text-gray-400">
                <span class="flex items-center gap-0.5 text-[10px]">
                  <Eye :size="11" />
                  {{ article.views }}
                </span>
                <span class="flex items-center gap-0.5 text-[10px]">
                  <ThumbsUp :size="11" />
                  {{ article.likes }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
