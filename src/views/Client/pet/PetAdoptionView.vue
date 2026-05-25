<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import request from '@/api/axios'
import { useAuthStore } from '@/stores/auth'
import { Dog, Sparkles } from 'lucide-vue-next'

// 1. 狀態定義
const loading = ref(true)
const rawPets = ref([]) // 存放 API 回傳的原始資料

// 篩選條件狀態
const filters = reactive({
  search: '',
  gender: '', // 'male', 'female'
  ageRange: '', // '0,1', '1,3', '3,8', '8,40'
  sizeRange: '', // '0,12', '12,25', '25,200'
  goodWith: [], // ['kids', 'dogs', 'cats']
  sortBy: 'latest', // 'latest'
})

// 2. API 請求
const fetchPets = async () => {
  try {
    loading.value = true
    // 銜接你的 API 格式
    const response = await request.get('/users/pet/adoption')
    const { success, data } = response.data
    if (success) {
      rawPets.value = data.map((pet) => {
        // 計算年齡
        let age = 0
        if (pet.birthDate) {
          const birth = new Date(pet.birthDate)
          const today = new Date()
          age = today.getFullYear() - birth.getFullYear()
          const m = today.getMonth() - birth.getMonth()
          if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--
          }
        }

        // 將體型大小 (Size: 1, 2, 3) 轉換為模擬體重以搭配前端的篩選條件
        let weight = 0
        if (pet.size === 1) weight = 5
        else if (pet.size === 2) weight = 15
        else if (pet.size === 3) weight = 30

        // 解析適合相處條件
        const goodWith = pet.behavioralTraits
          ? pet.behavioralTraits.split(',').map((t) => t.trim().toLowerCase())
          : []

        return {
          id: pet.petId,
          name: pet.name,
          imageUrl: pet.photo,
          nickname: pet.note,
          gender: pet.gender === 1 ? 'male' : 'female',
          age,
          color: pet.coatColor,
          weight,
          goodWith,
          createdDate: pet.createdAt,
        }
      })
    }
  } catch (error) {
    console.error('無法取得寵物資料:', error)
  } finally {
    loading.value = false
  }
}

// 3. 核心過濾邏輯 (Computed)
const filteredPets = computed(() => {
  return rawPets.value
    .filter((pet) => {
      // 名字搜尋
      const matchSearch = pet.name.toLowerCase().includes(filters.search.toLowerCase())

      // 性別篩選
      const matchGender = !filters.gender || pet.gender === filters.gender

      // 年齡篩選 (假設後端 pet.age 是數字)
      let matchAge = true
      if (filters.ageRange) {
        const [min, max] = filters.ageRange.split(',').map(Number)
        matchAge = pet.age >= min && pet.age < max
      }

      // 體型篩選 (假設後端 pet.weight 是數字)
      let matchSize = true
      if (filters.sizeRange) {
        const [min, max] = filters.sizeRange.split(',').map(Number)
        matchSize = pet.weight >= min && pet.weight < max
      }

      // Good With 複選邏輯 (假設 pet.goodWith 是陣列或逗號字串)
      const matchGoodWith = filters.goodWith.every((condition) => pet.goodWith?.includes(condition))

      return matchSearch && matchGender && matchAge && matchSize && matchGoodWith
    })
    .sort((a, b) => {
      if (filters.sortBy === 'latest') {
        return new Date(b.createdDate) - new Date(a.createdDate)
      }
      return 0
    })
})

// 重置篩選
const resetFilters = () => {
  filters.search = ''
  filters.gender = ''
  filters.ageRange = ''
  filters.sizeRange = ''
  filters.goodWith = []
}

onMounted(() => {
  fetchPets()
})
</script>

<template>
  <div class="page-container min-h-screen bg-[#FDF9F3] text-gray-800 antialiased font-fredoka">
    <!-- HERO SECTION -->
    <header class="hero-container relative overflow-hidden bg-[#FCF4E5] border-b-4 border-[#445944] pt-8 pb-16 lg:py-24">
      <!-- Background floating ornaments -->
      <div class="pointer-events-none absolute inset-0 z-0 opacity-15">
        <svg
          class="animate-float absolute top-12 left-10 h-24 w-24 text-[#445944]"
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
          class="animate-float-delayed absolute right-16 bottom-16 h-32 w-32 text-[#9C6D6D]"
          viewBox="0 0 100 100">
          <path
            fill="currentColor"
            d="M10,40 C10,30 20,20 30,20 C45,20 50,35 50,35 C50,35 55,20 70,20 C80,20 90,30 90,40 C90,65 50,85 50,85 C50,85 10,65 10,40 Z" />
        </svg>
      </div>

      <div class="relative z-10 mx-auto grid w-[90%] max-w-7xl grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
        <!-- Hero Left Info -->
        <div class="hero-left flex flex-col justify-center lg:col-span-6">
          <div
            class="font-fredoka mb-6 inline-flex w-max items-center gap-2 rounded-full bg-[#7a6856] px-4 py-1.5 text-sm font-semibold tracking-wider text-white shadow-sm">
            <Sparkles :size="16" class="animate-spin-slow" />
            PETMILY ADOPTION
          </div>
          <h2 class="mb-6 text-4xl leading-tight font-black text-[#445944] md:text-5xl lg:text-6xl">
            我們幫你一起養！
            <br class="hidden md:block" />
            <span class="relative z-10 inline-block px-2 text-[#7a6856]">
              狗狗領養津貼
              <span
                class="absolute right-0 bottom-1.5 left-0 -z-10 h-3 -rotate-1 transform rounded bg-[#FAE4AE] md:h-5"></span>
            </span>
            熱烈上路
          </h2>
          <p class="mb-8 max-w-xl text-base leading-relaxed text-gray-700 md:text-lg">
            經過預備學校社會化的狗狗，更能融入人類家庭。
            <br />
            現在領養還有見面禮—價值近一萬一千元的大禮包！給牠一個家，就是給自己最真摯的幸福。
          </p>
          <div class="flex flex-col gap-4 sm:flex-row">
            <button
              class="group flex items-center justify-center gap-2 rounded-2xl border-2 border-[#445944] bg-[#445944] px-8 py-4 text-lg font-bold text-white transition-all hover:translate-x-[3px] hover:translate-y-[3px]">
              <Dog :size="22" class="group-hover:bounce" />
              我要領養
            </button>
          </div>
        </div>

        <!-- Hero Right Illustration -->
        <div class="hero-right lg:col-span-6 flex justify-center items-center">
          <div class="relative rounded-3xl border-4 border-[#445944] bg-white p-4 shadow-[8px_8px_0px_#445944] overflow-hidden max-w-md w-full">
            <img src="/images/carousel/carousel-02.png" alt="狗狗領養津貼" class="w-full h-64 md:h-80 object-cover rounded-2xl border-2 border-[#445944]" />
          </div>
        </div>
      </div>
    </header>

    <!-- MAIN BODY -->
    <main class="mx-auto max-w-7xl w-[90%] px-4 py-12">
      <!-- Title & CTA Button -->
      <div class="mb-10 flex flex-col items-center justify-between gap-6 md:flex-row">
        <h1 class="text-4xl font-black text-[#445944]">領養狗狗</h1>

        <router-link
          :to="{ name: 'pet-adoption-add' }"
          class="flex items-center gap-2 rounded-2xl border-2 border-[#445944] bg-[#445944] px-8 py-4 text-lg font-bold text-white shadow-[4px_4px_0px_#445944] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#445944]">
          <span>🐾</span>
          我要刊登送養
        </router-link>
      </div>

      <!-- Info Buttons -->
      <div class="mb-12 flex flex-wrap justify-center gap-4">
        <button
          class="flex items-center gap-2 rounded-2xl border-2 border-[#445944] bg-white px-6 py-3 font-bold text-[#445944] shadow-[4px_4px_0px_#445944] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#445944]">
          <span>🏠</span>
          為什麼要領養Petmily？
        </button>
        <button
          class="flex items-center gap-2 rounded-2xl border-2 border-[#445944] bg-white px-6 py-3 font-bold text-[#445944] shadow-[4px_4px_0px_#445944] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#445944]">
          <span>❓</span>
          領養流程
        </button>
      </div>

      <!-- Filters Card -->
      <div class="mb-10 rounded-3xl border-4 border-[#445944] bg-white p-6 shadow-[6px_6px_0px_#445944] md:p-8">
        <div class="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <!-- Search Input -->
          <div class="lg:col-span-1">
            <label class="mb-2 block text-sm font-black text-[#445944]">以名字搜尋</label>
            <div class="relative">
              <input
                v-model="filters.search"
                type="text"
                placeholder="輸入狗狗名字..."
                class="w-full rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] px-4 py-2.5 font-bold text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#445944] text-sm" />
            </div>
          </div>

          <!-- Select & Button Groups -->
          <div class="grid grid-cols-1 gap-6 md:grid-cols-3 lg:col-span-3">
            <!-- Gender Filter -->
            <div>
              <h5 class="mb-3 text-sm font-black text-[#445944]">性別</h5>
              <div class="flex gap-2">
                <button
                  @click="filters.gender = 'male'"
                  :class="
                    filters.gender === 'male'
                      ? 'bg-[#445944] text-white border-[#445944]'
                      : 'bg-[#FCF4E5] text-[#445944] border-[#445944] hover:bg-white'
                  "
                  class="rounded-2xl border-2 px-6 py-2.5 text-sm font-bold transition duration-200">
                  弟弟
                </button>
                <button
                  @click="filters.gender = 'female'"
                  :class="
                    filters.gender === 'female'
                      ? 'bg-[#445944] text-white border-[#445944]'
                      : 'bg-[#FCF4E5] text-[#445944] border-[#445944] hover:bg-white'
                  "
                  class="rounded-2xl border-2 px-6 py-2.5 text-sm font-bold transition duration-200">
                  妹妹
                </button>
              </div>
            </div>

            <!-- Age Filter -->
            <div>
              <h5 class="mb-3 text-sm font-black text-[#445944]">
                年齡
                <small class="font-bold text-gray-500">(歲)</small>
              </h5>
              <select
                v-model="filters.ageRange"
                class="w-full rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] text-sm font-bold text-gray-800 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#445944]">
                <option value="">全部年齡</option>
                <option value="0,1">幼犬 (0-1)</option>
                <option value="1,3">青少年 (1-3)</option>
                <option value="3,8">成犬 (3-8)</option>
                <option value="8,40">老犬 (8+)</option>
              </select>
            </div>

            <!-- Size Filter -->
            <div>
              <h5 class="mb-3 text-sm font-black text-[#445944]">
                體型
                <small class="font-bold text-gray-500">(kg)</small>
              </h5>
              <select
                v-model="filters.sizeRange"
                class="w-full rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] text-sm font-bold text-gray-800 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#445944]">
                <option value="">全部體型</option>
                <option value="0,12">小型犬 (under 12)</option>
                <option value="12,25">中型犬 (12-25)</option>
                <option value="25,200">大型犬 (25+)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Checkboxes & Reset -->
        <div class="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t-2 border-[#445944] pt-6">
          <div class="flex flex-wrap items-center gap-6">
            <span class="text-sm font-black text-[#445944]">適合相處：</span>
            <label class="inline-flex items-center text-sm font-bold text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                v-model="filters.goodWith"
                value="kids"
                class="mr-2 h-5 w-5 rounded-lg border-2 border-[#445944] text-[#445944] focus:ring-0 bg-white" />
              小孩
            </label>
            <label class="inline-flex items-center text-sm font-bold text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                v-model="filters.goodWith"
                value="dogs"
                class="mr-2 h-5 w-5 rounded-lg border-2 border-[#445944] text-[#445944] focus:ring-0 bg-white" />
              其他狗狗
            </label>
          </div>
          <button
            @click="resetFilters"
            class="text-sm font-black text-gray-500 transition hover:text-[#9C6D6D] flex items-center gap-1">
            🔄 重置篩選條件
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20 gap-4">
        <div class="h-16 w-16 animate-spin rounded-full border-4 border-dashed border-[#445944]"></div>
        <p class="text-[#445944] font-black animate-pulse">載入可愛毛孩中...</p>
      </div>

      <!-- Pet Cards Grid -->
      <div v-else class="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <div
          v-for="pet in filteredPets"
          :key="pet.id"
          class="group overflow-hidden rounded-3xl border-4 border-[#445944] bg-white shadow-[6px_6px_0px_#445944] transition-all duration-300 hover:-translate-y-1 hover:shadow-[10px_10px_0px_#445944]">
          
          <!-- Image Section -->
          <div class="relative aspect-square overflow-hidden bg-gray-100 border-b-4 border-[#445944]">
            <img
              :src="pet.imageUrl"
              :alt="pet.name"
              class="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
            
            <!-- Nickname Badge -->
            <span
              class="absolute top-3 left-3 rounded-full border-2 border-[#445944] bg-[#9C6D6D] px-3 py-1 text-xs font-black text-white shadow-[2px_2px_0px_#445944]">
              {{ pet.nickname || '精選夥伴' }}
            </span>

            <!-- Hover overlay with stylish neo-brutalist button -->
            <div
              class="bg-black/20 absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <router-link
                :to="{ name: 'pet-adoption-detail', params: { id: pet.id } }"
                class="translate-y-4 transform rounded-2xl border-2 border-[#445944] bg-[#FAE4AE] px-6 py-2.5 text-center font-black text-[#445944] opacity-0 shadow-[4px_4px_0px_#445944] transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#445944]">
                狗狗檔案
              </router-link>
            </div>
          </div>

          <!-- Card Body Info -->
          <div class="p-5 bg-[#FCF4E5]">
            <div class="mb-3 flex items-center justify-between">
              <h3 class="text-xl font-black text-[#445944] truncate">{{ pet.name }}</h3>
              
              <!-- Gender Badge -->
              <span
                v-if="pet.gender === 'male'"
                class="inline-flex shrink-0 text-[#3b82f6]"
                title="男生">
                <svg
                  class="h-5 w-5 stroke-[3]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <circle cx="10" cy="14" r="5" />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M14 10l6-6M15 4h5v5" />
                </svg>
              </span>
              <span v-else class="inline-flex shrink-0 text-[#ec4899]" title="女生">
                <svg
                  class="h-5 w-5 stroke-[3]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <circle cx="12" cy="9" r="5" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 14v7M9 18h6" />
                </svg>
              </span>
            </div>

            <!-- Pet details -->
            <div class="flex flex-wrap items-center gap-1.5 text-xs font-black text-gray-700">
              <span class="rounded bg-white px-2 py-0.5 border-2 border-[#445944] shadow-[1px_1px_0px_#445944]">
                {{ pet.color || '米克斯' }}
              </span>
              <span class="rounded bg-white px-2 py-0.5 border-2 border-[#445944] shadow-[1px_1px_0px_#445944]">
                {{ pet.age }} 歲
              </span>
              <span class="rounded bg-white px-2 py-0.5 border-2 border-[#445944] shadow-[1px_1px_0px_#445944]">
                {{ pet.weight }} kg
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && filteredPets.length === 0" class="py-16 text-center max-w-md mx-auto rounded-3xl border-4 border-dashed border-[#445944] bg-[#FCF4E5] p-8 shadow-[6px_6px_0px_#445944]">
        <span class="text-5xl block mb-4">🐶</span>
        <h3 class="text-xl font-black text-[#445944] mb-2">找不到符合條件的狗狗</h3>
        <p class="text-sm font-bold text-gray-600">嘗試調整一下篩選條件，或許命定的夥伴就在那裡喔！</p>
      </div>
    </main>
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
