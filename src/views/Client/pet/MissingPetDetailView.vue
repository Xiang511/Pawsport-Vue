<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Undo2, MapPin, Copy, Heart, Calendar, User, Sparkles } from 'lucide-vue-next'
import request from '@/api/axios'

const route = useRoute()
const router = useRouter()

// 寵物詳細資料 (與 API 對接)
const pet = ref(null)
const loading = ref(false)

const DEFAULT_PET_IMAGE = 'https://placehold.co/600x600?text=Petmily'

const handleImageError = (e) => {
  e.target.src = DEFAULT_PET_IMAGE
}

const fetchPetDetail = async (id) => {
  loading.value = true
  try {
    const response = await request.get(`/users/missing-pets/${id}`)
    pet.value = response.data.data || response.data
  } catch (error) {
    console.error('取得寵物詳細資料失敗:', error)
    alert('找不到這筆遺失紀錄或已被撤銷')
    router.back()
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const id = route.params.id
  if (id) {
    fetchPetDetail(id)
  }
})

const goBack = () => {
  router.back()
}

const clipboard = (text) => {
  navigator.clipboard.writeText(text)
  alert('已複製到剪貼簿！')
}
</script>

<template>
  <div
    class="page-container font-fredoka min-h-screen bg-[#FCF4E5] pb-20 text-gray-800 antialiased">
    <!-- HERO SECTION -->
    <header
      class="hero-container relative overflow-hidden bg-[#FCF4E5] pt-8 pb-12 text-center lg:py-16">
      <!-- Background floating ornaments -->
      <div class="pointer-events-none absolute inset-0 z-0 opacity-15">
        <svg
          class="animate-float absolute top-8 left-10 h-20 w-20 text-[#445944]"
          viewBox="0 0 100 100">
          <path
            fill="currentColor"
            d="M30,50 C30,35 40,25 50,25 C60,25 70,35 70,50 C70,65 60,75 50,75 C40,75 30,65 30,50 Z" />
          <circle cx="25" cy="30" r="10" fill="currentColor" />
          <circle cx="42" cy="15" r="10" fill="currentColor" />
          <circle cx="62" cy="15" r="10" fill="currentColor" />
          <circle cx="78" cy="30" r="10" fill="currentColor" />
        </svg>
        <svg
          class="animate-float-delayed absolute right-16 bottom-8 h-24 w-24 text-[#9C6D6D]"
          viewBox="0 0 100 100">
          <path
            fill="currentColor"
            d="M10,40 C10,30 20,20 30,20 C45,20 50,35 50,35 C50,35 55,20 70,20 C80,20 90,30 90,40 C90,65 50,85 50,85 C50,85 10,65 10,40 Z" />
        </svg>
      </div>

      <div class="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-4">
        <div
          class="font-fredoka animate-pulse-slow mb-4 inline-flex w-max items-center gap-2 rounded-full bg-[#7a6856] px-4 py-1.5 text-xs font-semibold tracking-wider text-white shadow-sm">
          <Sparkles :size="14" class="animate-spin-slow" />
          MISSING REPORT DETAILS
        </div>
        <h1 class="mb-4 text-4xl leading-tight font-black text-[#445944] md:text-5xl">
          遺失協尋
          <span class="relative z-10 inline-block px-2 text-[#7a6856]">
            詳細啓事
            <span
              class="absolute right-0 bottom-1.5 left-0 -z-10 h-3 -rotate-1 transform rounded bg-[#FAE4AE] md:h-4"></span>
          </span>
        </h1>
        <p class="mb-6 max-w-xl text-base font-bold text-gray-600">
          尋獲及領回寵物的飼主，請至登記站辦理尋獲及領回的登記！
          <br />
          讓我們攜手幫助毛孩回家。
        </p>
      </div>
    </header>

    <!-- MAIN BODY -->
    <div v-if="pet" class="mx-auto mt-12 w-[90%] max-w-7xl px-4">
      <div class="flex flex-col gap-8 lg:flex-row">
        <!-- Left Side Column: Photo Box Card -->
        <aside class="w-full lg:w-1/3">
          <div
            class="sticky top-30 rounded-3xl border-4 border-[#445944] bg-white p-5 shadow-[6px_6px_0px_#445944]">
            <div
              class="mb-4 flex items-center justify-center gap-2 border-b-2 border-[#445944] pb-3">
              <span class="text-xl">📸</span>
              <h3 class="text-center text-lg font-black text-[#445944]">寵物照片</h3>
            </div>

            <div
              class="overflow-hidden rounded-2xl border-4 border-[#445944] bg-[#FCF4E5] shadow-md">
              <img
                :src="pet.photo || DEFAULT_PET_IMAGE"
                @error="handleImageError"
                class="w-full object-cover transition-transform duration-700 hover:scale-105"
                :alt="pet.breed" />
            </div>

            <button
              @click="goBack"
              class="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#445944] bg-[#FAE4AE] py-3 text-sm font-black text-[#445944] shadow-[3px_3px_0px_#445944] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#445944]">
              <Undo2 class="h-4 w-4" />
              返回列表
            </button>
          </div>
        </aside>

        <!-- Right Side Column: Data Block Card -->
        <div class="w-full lg:w-2/3">
          <div
            class="overflow-hidden rounded-3xl border-4 border-[#445944] bg-white shadow-[6px_6px_0px_#445944]">
            <!-- Pet Information -->
            <div class="border-b-4 border-[#445944]">
              <div
                class="flex items-center gap-3 border-b-2 border-[#445944] bg-[#FCF4E5] px-6 py-4 text-[#445944]">
                <Heart class="h-5 w-5 fill-[#445944]" />
                <h3 class="text-lg font-black">寵物基本資訊</h3>
              </div>

              <ul class="divide-y-2 divide-[#445944] bg-white px-6 text-sm font-bold text-gray-700">
                <li class="flex items-center py-4">
                  <p class="w-32 font-black text-[#445944]">寵物名 / 品種</p>
                  <p class="text-base font-extrabold text-gray-800">{{ pet.breed }}</p>
                </li>
                <li class="flex items-center py-4">
                  <p class="w-32 font-black text-[#445944]">晶片號碼</p>
                  <p
                    class="rounded-xl border-2 border-[#445944] bg-[#FCF4E5] px-2.5 py-1 font-mono text-xs font-black text-gray-800 shadow-[1.5px_1.5px_0px_#445944]">
                    {{ pet.chipId || '無晶片資料' }}
                  </p>
                </li>
                <li class="flex items-center py-4">
                  <p class="w-32 font-black text-[#445944]">性別 / 動物類別</p>
                  <p class="text-gray-800">{{ pet.gender }} / {{ pet.species }}</p>
                </li>
                <li class="flex items-center py-4">
                  <p class="w-32 font-black text-[#445944]">毛色</p>
                  <p class="text-gray-800">{{ pet.color }}</p>
                </li>
                <li class="flex items-start py-4">
                  <p class="w-32 shrink-0 font-black text-[#445944]">特徵描述</p>
                  <p
                    class="flex-1 rounded-2xl border-2 border-dashed border-[#445944] bg-[#FDF9F3] p-4 text-xs leading-relaxed text-gray-800">
                    {{ pet.feature || '無特徵描述。' }}
                  </p>
                </li>
              </ul>
            </div>

            <!-- Lost Information -->
            <div class="border-b-4 border-[#445944]">
              <div
                class="flex items-center gap-3 border-b-2 border-[#445944] bg-[#FCF4E5] px-6 py-4 text-[#445944]">
                <Calendar class="h-5 w-5" />
                <h3 class="text-lg font-black">走失詳情</h3>
              </div>

              <ul class="divide-y-2 divide-[#445944] bg-white px-6 text-sm font-bold text-gray-700">
                <li class="flex items-center py-4">
                  <p class="w-32 font-black text-[#445944]">遺失時間</p>
                  <p class="font-extrabold text-gray-800">{{ pet.lostTime }}</p>
                </li>
                <li class="flex items-center py-4">
                  <p class="w-32 font-black text-[#445944]">申報時間</p>
                  <p class="text-gray-800">{{ pet.addDate }}</p>
                </li>
                <li class="flex items-center py-4">
                  <p class="w-32 font-black text-[#445944]">遺失地點</p>
                  <div class="flex flex-wrap items-center gap-3 text-gray-800">
                    <span class="font-extrabold">
                      {{ pet.city }}{{ pet.district }}{{ pet.lostPlace }}
                    </span>
                    <a
                      :href="
                        'https://www.google.com.tw/maps/search/' +
                        pet.city +
                        pet.district +
                        pet.lostPlace +
                        '/'
                      "
                      target="_blank"
                      class="inline-flex items-center gap-1 rounded-xl border-2 border-[#445944] bg-[#FAE4AE] px-3 py-1 text-xs font-black text-[#445944] shadow-[1.5px_1.5px_0px_#445944] transition-all duration-150 hover:bg-white">
                      <MapPin class="h-3.5 w-3.5" />
                      開啟地圖
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            <!-- Contact Information -->
            <div>
              <div
                class="flex items-center gap-3 border-b-2 border-[#445944] bg-[#FCF4E5] px-6 py-4 text-[#445944]">
                <User class="h-5 w-5" />
                <h3 class="text-lg font-black">聯絡人方式</h3>
              </div>

              <ul class="divide-y-2 divide-[#445944] bg-white px-6 text-sm font-bold text-gray-700">
                <li class="flex items-center py-4">
                  <p class="w-32 font-black text-[#445944]">發布人</p>
                  <p class="text-base font-extrabold text-gray-800">{{ pet.reporterName }}</p>
                </li>
                <li class="flex items-center py-4">
                  <p class="w-32 font-black text-[#445944]">聯絡電話</p>
                  <div class="flex items-center gap-2.5 text-gray-800">
                    <span class="font-extrabold">{{ pet.contactPhone }}</span>
                    <button
                      @click="clipboard(pet.contactPhone)"
                      class="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-[#445944]"
                      title="點擊複製電話">
                      <Copy class="h-4 w-4" />
                    </button>
                  </div>
                </li>
                <li class="flex items-center py-4">
                  <p class="w-32 font-black text-[#445944]">E-mail</p>
                  <div class="flex items-center gap-2.5 text-gray-800">
                    <span class="font-extrabold">{{ pet.contactEmail }}</span>
                    <button
                      @click="clipboard(pet.contactEmail)"
                      class="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-[#445944]"
                      title="點擊複製 E-mail">
                      <Copy class="h-4 w-4" />
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State with Premium Neo-Brutalist Skeleton Detailed Loader -->
    <div
      v-else
      class="mx-auto mt-12 flex w-[90%] max-w-7xl animate-pulse flex-col gap-8 px-4 lg:flex-row">
      <!-- Left Column skeleton photo box card -->
      <aside class="w-full lg:w-1/3">
        <div
          class="rounded-3xl border-4 border-[#445944]/30 bg-white p-5 shadow-[6px_6px_0px_rgba(68,89,68,0.1)]">
          <div class="mb-4 h-6 w-1/3 rounded-xl bg-[#445944]/20"></div>
          <div
            class="flex aspect-square w-full items-center justify-center rounded-2xl border-4 border-[#445944]/20 bg-[#FCF4E5]">
            <span class="text-4xl opacity-20">🚨</span>
          </div>
          <div class="mt-6 h-12 w-full rounded-xl bg-[#445944]/20"></div>
        </div>
      </aside>
      <!-- Right Column skeleton data block card -->
      <div class="w-full lg:w-2/3">
        <div
          class="space-y-6 rounded-3xl border-4 border-[#445944]/30 bg-white p-8 shadow-[6px_6px_0px_rgba(68,89,68,0.1)]">
          <div class="h-8 w-1/4 rounded-xl bg-[#445944]/20"></div>
          <div class="space-y-4">
            <div
              v-for="j in 4"
              :key="j"
              class="flex gap-4 border-b border-dashed border-gray-200 pb-2">
              <div class="h-5 w-1/4 rounded-lg bg-[#445944]/15"></div>
              <div class="h-5 w-1/2 rounded-lg bg-[#445944]/15"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&family=Quicksand:wght@300..700&display=swap');

.font-fredoka {
  font-family: 'Fredoka', 'GenJyuu', sans-serif;
}

.font-quicksand {
  font-family: 'Quicksand', 'GenJyuu', sans-serif;
}

/* Animations */
@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-10px) rotate(3deg);
  }
}

@keyframes float-delayed {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(8px) rotate(-3deg);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 7s ease-in-out infinite;
  animation-delay: 1.5s;
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

.animate-pulse-slow {
  animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse-slow {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.9;
    transform: scale(0.98);
  }
}

.group:hover .group-hover\:bounce {
  animation: bounce 0.6s ease infinite alternate;
}

@keyframes bounce {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-4px);
  }
}
</style>
