<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, ImageIcon, Clock, Hash, Share2 } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const enewsId = route.params.id
const enews = ref(null)

onMounted(async () => {
  try {
    const response = await fetch(`https://localhost:7048/api/ENewsletter/${enewsId}`)
    if (response.ok) {
      const result = await response.json()
      enews.value = result.data
    }
  } catch (error) {
    console.error('撈取電子報失敗:', error)
  }
})
</script>

<template>
  <div
    class="page-container min-h-screen bg-[#FDF9F3] px-4 py-12 font-sans text-gray-800 antialiased">
    <div class="mx-auto max-w-4xl">
      <div class="mb-6 flex items-center justify-between px-2">
        <button
          @click="router.back()"
          class="group flex items-center gap-2 text-sm font-bold text-[#7a6856] transition-colors hover:text-[#445944]">
          <ArrowLeft class="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          返回專欄列表
        </button>
        <div class="flex gap-4 text-[#7a6856]">
          <Share2 class="h-5 w-5 cursor-pointer transition-colors hover:text-[#445944]" />
        </div>
      </div>

      <div
        v-if="enews"
        class="overflow-hidden rounded-3xl border-4 border-[#445944] bg-white shadow-[8px_8px_0px_#445944] transition-all hover:shadow-[10px_10px_0px_#445944]">
        <header
          class="border-b-4 border-[#445944] bg-[#FCF4E5] px-8 pt-12 pb-10 text-center lg:px-16">
          <div class="mb-6 flex justify-center">
            <span
              class="font-fredoka inline-flex items-center gap-1 rounded-full bg-[#7a6856] px-4 py-1.5 text-xs font-semibold tracking-wider text-white shadow-sm">
              <Hash class="h-3 w-3" />
              {{ enews.category }}
            </span>
          </div>

          <h1 class="mb-6 text-3xl leading-tight font-black text-[#445944] lg:text-4xl">
            {{ enews.title }}
          </h1>

          <div class="flex items-center justify-center gap-6 text-sm font-extrabold text-[#7a6856]">
            <div class="flex items-center gap-1.5">
              <Clock class="h-4 w-4" />
              {{ enews.publishDate?.split('T')[0] }}
            </div>
            <div class="h-1.5 w-1.5 rounded-full bg-[#7a6856]/40"></div>
            <div>Petmily 編輯部</div>
          </div>
        </header>

        <div class="px-8 pt-8 lg:px-16 lg:pt-10">
          <div
            class="relative aspect-[21/9] w-full overflow-hidden rounded-2xl border-4 border-[#445944] bg-[#FCF4E5] shadow-md">
            <img
              v-if="enews.image"
              :src="enews.image"
              class="h-full w-full object-cover"
              alt="電子報封面圖片" />
            <div
              v-else
              class="flex h-full w-full flex-col items-center justify-center gap-2 text-[#7a6856]/60">
              <ImageIcon class="h-16 w-16" />
              <span class="text-xs font-black tracking-[0.2em]">PETMILY EDITION</span>
            </div>
          </div>
        </div>

        <main class="px-8 py-12 lg:px-20 lg:py-16">
          <div
            v-if="enews.summary"
            class="mb-10 rounded-2xl border-4 border-[#7a6856] bg-[#FCF4E5] p-6 text-lg leading-relaxed font-bold text-[#7a6856] italic shadow-[4px_4px_0px_#7a6856]">
            「 {{ enews.summary }} 」
          </div>

          <div
            class="prose prose-stone prose-headings:text-[#445944] prose-headings:font-black prose-p:text-lg prose-p:leading-[1.8] prose-p:text-gray-700 max-w-none">
            <div v-html="enews.content"></div>
          </div>

          <div
            class="mt-16 flex flex-col items-center gap-6 border-t-4 border-dashed border-[#7a6856]/30 pt-12">
            <div class="text-center">
              <p class="mb-2 text-lg font-extrabold text-[#7a6856]">喜歡這篇文章嗎？</p>
              <p class="text-sm font-bold text-[#7a6856]/60">歡迎分享給更多愛毛孩的朋友 🐾</p>
            </div>
            <button
              @click="router.back()"
              class="group flex items-center justify-center gap-2 rounded-2xl border-2 border-[#445944] bg-[#445944] px-8 py-3 text-lg font-black text-white shadow-[4px_4px_0px_#445944] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#445944] active:translate-y-[4px] active:shadow-[0px_0px_0px_#445944]">
              閱讀更多精彩文章
            </button>
          </div>
        </main>
      </div>

      <div
        v-else
        class="flex min-h-[400px] flex-col items-center justify-center gap-4 py-12 text-[#7a6856]">
        <div
          class="flex h-16 w-16 animate-bounce items-center justify-center rounded-2xl border-4 border-[#445944] bg-[#FAE4AE] text-2xl shadow-[4px_4px_0px_#445944]">
          🐾
        </div>
        <p class="font-extrabold tracking-widest text-[#445944]">正在為您翻閱最新情報...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 深度作用選擇器，確保 v-html 內的內容也能被美化 */
:deep(.prose img) {
  border-radius: 1rem;
  margin: 2.5rem auto;
  border: 4px solid #445944;
  box-shadow: 4px 4px 0px #445944;
}
:deep(.prose h2) {
  margin-top: 2.5rem;
  font-weight: 900;
  color: #445944;
}
</style>
