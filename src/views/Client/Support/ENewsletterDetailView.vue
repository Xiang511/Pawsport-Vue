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
  <div class="min-h-screen bg-[#FCF4E5] px-4 py-12 font-sans">
    <div class="mx-auto max-w-4xl">
      
      <div class="mb-6 flex items-center justify-between px-2">
        <button
          @click="router.back()"
          class="group flex items-center gap-2 text-sm font-bold text-[#968677] transition-colors hover:text-[#755e44]">
          <ArrowLeft class="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          返回專欄列表
        </button>
        <div class="flex gap-4 text-[#b4a496]">
          <Share2 class="h-5 w-5 cursor-pointer hover:text-[#755e44]" />
        </div>
      </div>

      <div v-if="enews" class="overflow-hidden rounded-[2.5rem] border-2 border-[#e8dccb] bg-white shadow-xl">
        
        <header class="bg-[#fbf6ef]/50 px-8 pt-10 pb-8 text-center lg:px-16">
          <div class="mb-6 flex justify-center">
            <span class="inline-flex items-center gap-1 rounded-full bg-[#FAE4AE] px-5 py-1.5 text-sm font-black text-[#755e44] shadow-sm">
              <Hash class="h-3 w-3" />
              {{ enews.category }}
            </span>
          </div>
          
          <h1 class="mb-6 text-3xl font-extrabold leading-tight text-[#7a6856] lg:text-4xl">
            {{ enews.title }}
          </h1>

          <div class="flex items-center justify-center gap-6 text-sm font-medium text-[#b4a496]">
            <div class="flex items-center gap-1.5">
              <Clock class="h-4 w-4" />
              {{ enews.publishDate?.split('T')[0] }}
            </div>
            <div class="h-1 w-1 rounded-full bg-[#e8dccb]"></div>
            <div>Petmily 編輯部</div>
          </div>
        </header>

        <div class="px-8 lg:px-16">
          <div class="relative aspect-[21/9] w-full overflow-hidden rounded-3xl border-2 border-[#e8dccb]/30 bg-[#e8dccb]/20 shadow-inner">
            <img 
              v-if="enews.image" 
              :src="enews.image" 
              class="h-full w-full object-cover" 
              alt="電子報封面圖片" 
            />
            <div v-else class="flex h-full w-full flex-col items-center justify-center gap-2 text-[#d8ccbb]">
              <ImageIcon class="h-16 w-16" />
              <span class="text-xs font-black tracking-[0.2em]">PETMILY EDITION</span>
            </div>
          </div>
        </div>

        <main class="px-8 py-12 lg:px-20 lg:py-16">
          <div v-if="enews.summary" class="mb-10 rounded-2xl border-l-4 border-[#FAE4AE] bg-[#fbf6ef] p-6 text-lg italic leading-relaxed text-[#968677]">
            「 {{ enews.summary }} 」
          </div>

          <div class="prose prose-stone max-w-none prose-headings:text-[#755e44] prose-p:text-lg prose-p:leading-[1.8] prose-p:text-[#6a5a4a]">
            <div v-html="enews.content"></div>
          </div>

          <div class="mt-16 flex flex-col items-center gap-6 border-t-2 border-dashed border-[#e8dccb] pt-12">
            <div class="text-center">
              <p class="mb-2 font-bold text-[#b4a496]">喜歡這篇文章嗎？</p>
              <p class="text-sm text-[#d8ccbb]">歡迎分享給更多愛毛孩的朋友 🐾</p>
            </div>
            <button 
              @click="router.back()"
              class="rounded-full bg-[#755e44] px-8 py-3 font-bold text-white transition-all hover:bg-[#5c4e40] hover:shadow-lg">
              閱讀更多精彩文章
            </button>
          </div>
        </main>
      </div>

      <div v-else class="flex min-h-[400px] flex-col items-center justify-center gap-4 py-12 text-[#968677]">
        <div class="h-12 w-12 animate-bounce rounded-full bg-[#FAE4AE] flex items-center justify-center">
           🐾
        </div>
        <p class="font-bold tracking-widest">正在為您翻閱最新情報...</p>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* 深度作用選擇器，確保 v-html 內的內容也能被美化 */
:deep(.prose img) {
  border-radius: 1.5rem;
  margin: 2rem auto;
  border: 1px solid #e8dccb;
}
:deep(.prose h2) {
  margin-top: 2.5rem;
  font-weight: 800;
}
</style>