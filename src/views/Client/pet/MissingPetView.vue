<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { SquarePlus, Sparkles } from 'lucide-vue-next'
import request from '@/api/axios'

// 1. 篩選狀態
const filters = reactive({
  type: '不限', // 預設不限
  gender: '不限', // 公/母/不限
  city: '', // 縣市
  district: '', // 地區
  keyword: '', // 關鍵字
})

// 2. 遺失寵物資料 (從 API 取得)
const lostPets = ref([])
const loading = ref(false)

const DEFAULT_PET_IMAGE = 'https://placehold.co/600x600?text=Petmily'

const handleImageError = (e) => {
  e.target.src = DEFAULT_PET_IMAGE
}

const fetchMissingPets = async () => {
  loading.value = true
  try {
    const response = await request.get('/users/missing-pets')
    // 若後端封裝在 response.data.data 中，請根據實際攔截器調整
    lostPets.value = response.data.data || response.data || []
  } catch (error) {
    console.error('獲取遺失寵物列表失敗:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchMissingPets()
})

const cityData = {
  台北市: [
    '中正區',
    '大同區',
    '中山區',
    '松山區',
    '大安區',
    '萬華區',
    '信義區',
    '士林區',
    '北投區',
    '內湖區',
    '南港區',
    '文山區',
  ],
  新北市: [
    '板橋區',
    '三重區',
    '中和區',
    '永和區',
    '新莊區',
    '新店區',
    '土城區',
    '蘆洲區',
    '樹林區',
    '汐止區',
  ],
  桃園市: ['桃園區', '中壢區', '平鎮區', '八德區', '楊梅區', '蘆竹區'],
  台中市: [
    '中區',
    '東區',
    '南區',
    '西區',
    '北區',
    '北屯區',
    '西屯區',
    '南屯區',
    '太平區',
    '大里區',
  ],
  台南市: ['中西區', '東區', '南區', '北區', '安平區', '安南區', '永康區', '歸仁區'],
  高雄市: ['新興區', '前金區', '苓雅區', '左營區', '楠梓區', '三民區', '鼓山區', '鳳山區'],
  嘉義市: ['東區', '西區'],
}

// 取得當前選中縣市的地區清單
const availableDistricts = computed(() => {
  return cityData[filters.city] || []
})

// 當縣市改變時，重置地區
const onCityChange = () => {
  filters.district = ''
}

// 3. 搜尋方法 (前端過濾)
const filteredPets = computed(() => {
  return lostPets.value.filter((pet) => {
    // 類別篩選
    if (filters.type && filters.type !== '不限') {
      if (filters.type === '其他') {
        if (pet.species === '狗' || pet.species === '貓') return false
      } else {
        if (pet.species !== filters.type) return false
      }
    }

    // 性別篩選
    if (filters.gender && filters.gender !== '不限' && pet.gender !== filters.gender) return false

    // 地區篩選
    if (filters.city && pet.city !== filters.city) return false
    if (filters.district && pet.district !== filters.district) return false

    // 關鍵字篩選
    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase()
      const matchFeature = pet.feature?.toLowerCase().includes(kw)
      const matchBreed = pet.breed?.toLowerCase().includes(kw)
      const matchChip = pet.chipId?.toLowerCase().includes(kw)
      const matchPlace = pet.lostPlace?.toLowerCase().includes(kw)
      if (!matchFeature && !matchBreed && !matchChip && !matchPlace) return false
    }

    return true
  })
})

const handleSearch = () => {
  // computed 已經自動響應，此處可保留做未來擴充 (如發送 API 搜尋)
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
          HELP US FIND THEM
        </div>
        <h1 class="mb-4 text-4xl leading-tight font-black text-[#445944] md:text-5xl">
          遺失協尋
          <span class="relative z-10 inline-block px-2 text-[#7a6856]">
            啓事列表
            <span
              class="absolute right-0 bottom-1.5 left-0 -z-10 h-3 -rotate-1 transform rounded bg-[#FAE4AE] md:h-4"></span>
          </span>
        </h1>
        <p class="mb-6 max-w-xl text-base font-bold text-gray-600">
          凝聚社群力量，守護毛孩回家防線。
          <br />
          希望能幫助每個走失的寶貝早日回到溫暖的避風港。
        </p>
        <div
          class="inline-flex items-center gap-2 rounded-2xl border-2 border-[#445944] bg-[#FAE4AE] px-5 py-2.5 text-sm font-black text-[#445944] shadow-[3px_3px_0px_#445944]">
          <span>📢</span>
          尋獲寵物後，請記得辦理撤銷申報喲！
        </div>
      </div>
    </header>

    <!-- MAIN BODY -->
    <div class="mx-auto mt-12 w-[90%] max-w-7xl px-4">
      <!-- Filters Card -->
      <div
        class="mb-10 rounded-3xl border-4 border-[#445944] bg-white p-6 shadow-[6px_6px_0px_#445944] md:p-8">
        <div class="mb-6 flex items-center gap-2 border-b-2 border-[#445944] pb-4">
          <span class="text-xl text-[#445944]">🔍</span>
          <h2 class="text-xl font-black text-[#445944]">篩選條件</h2>
        </div>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <!-- Animal Type Filter -->
          <div>
            <label class="mb-2 block text-sm font-black text-[#445944]">動物類別</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="t in ['不限', '狗', '貓', '其他']"
                :key="t"
                @click="filters.type = t"
                :class="
                  filters.type === t
                    ? 'border-[#445944] bg-[#445944] text-white'
                    : 'border-[#445944] bg-[#FCF4E5] text-[#445944] hover:bg-white'
                "
                class="rounded-2xl border-2 px-4 py-2 text-sm font-black transition duration-200">
                {{ t }}
              </button>
            </div>
          </div>

          <!-- Gender Filter -->
          <div>
            <label class="mb-2 block text-sm font-black text-[#445944]">性別</label>
            <div class="flex gap-2">
              <button
                v-for="g in ['公', '母', '不限']"
                :key="g"
                @click="filters.gender = g"
                :class="
                  filters.gender === g
                    ? 'border-[#445944] bg-[#445944] text-white'
                    : 'border-[#445944] bg-[#FCF4E5] text-[#445944] hover:bg-white'
                "
                class="flex-1 rounded-2xl border-2 py-2 text-sm font-black transition duration-200">
                {{ g }}
              </button>
            </div>
          </div>

          <!-- City Dropdown -->
          <div>
            <label class="mb-2 block text-sm font-black text-[#445944]">遺失縣市</label>
            <div class="relative">
              <select
                v-model="filters.city"
                @change="onCityChange"
                class="w-full cursor-pointer appearance-none rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] p-3 text-sm font-bold text-gray-800 focus:ring-2 focus:ring-[#445944] focus:outline-none">
                <option value="">請選擇縣市</option>
                <option v-for="(districts, city) in cityData" :key="city" :value="city">
                  {{ city }}
                </option>
              </select>
              <i
                class="fa-solid fa-chevron-down pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-xs text-gray-600"></i>
            </div>
          </div>

          <!-- District Dropdown -->
          <div>
            <label class="mb-2 block text-sm font-black text-[#445944]">行政地區</label>
            <div class="relative">
              <select
                v-model="filters.district"
                :disabled="!filters.city"
                class="w-full cursor-pointer appearance-none rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] p-3 text-sm font-bold text-gray-800 focus:ring-2 focus:ring-[#445944] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50">
                <option value="">{{ filters.city ? '請選擇地區' : '請先選擇縣市' }}</option>
                <option v-for="dist in availableDistricts" :key="dist" :value="dist">
                  {{ dist }}
                </option>
              </select>
              <i
                class="fa-solid fa-chevron-down pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-xs text-gray-600"></i>
            </div>
          </div>

          <!-- Keyword Input -->
          <div class="lg:col-span-2">
            <label class="mb-2 block text-sm font-black text-[#445944]">關鍵字搜尋</label>
            <input
              v-model="filters.keyword"
              type="text"
              placeholder="晶片號碼 / 特徵描述 / 遺失地點..."
              class="w-full rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] px-4 py-3 text-sm font-bold text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-[#445944] focus:outline-none" />
          </div>

          <!-- Search Button -->
          <!-- <div class="flex items-end">
            <button
              @click="handleSearch"
              class="w-full rounded-2xl border-2 border-[#445944] bg-[#445944] py-3 text-sm font-black text-white shadow-[4px_4px_0px_#445944] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#445944]">
              🔍 執行篩選
            </button>
          </div> -->
        </div>
      </div>

      <!-- Title & CTA Button -->
      <div class="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
        <div class="flex items-center gap-2.5">
          <span class="text-2xl text-[#445944]">📋</span>
          <h2 class="text-2xl font-black text-[#445944]">最新遺失啓事</h2>
        </div>

        <router-link
          :to="{ name: 'missing-report-create' }"
          class="flex items-center gap-2 rounded-2xl border-2 border-[#445944] bg-[#445944] px-6 py-3 text-base font-bold text-white shadow-[4px_4px_0px_#445944] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#445944]">
          <SquarePlus :size="18" />
          刊登遺失協尋
        </router-link>
      </div>

      <!-- Loading State with Premium Neo-Brutalist Skeleton Cards -->
      <div
        v-if="loading"
        class="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <div
          v-for="i in 8"
          :key="i"
          class="animate-pulse overflow-hidden rounded-3xl border-4 border-[#445944]/30 bg-white shadow-[6px_6px_0px_rgba(68,89,68,0.1)]">
          <!-- Image Skeleton -->
          <div
            class="relative flex h-48 items-center justify-center border-b-4 border-[#445944]/20 bg-[#FCF4E5]">
            <span class="text-4xl opacity-25">🚨</span>
          </div>
          <!-- Info Body Skeleton -->
          <div class="space-y-4 bg-[#FCF4E5]/40 p-5">
            <div class="h-6 w-2/3 rounded-xl bg-[#445944]/20"></div>
            <div class="space-y-2">
              <div class="h-4 w-full rounded-lg bg-[#445944]/15"></div>
              <div class="h-4 w-5/6 rounded-lg bg-[#445944]/15"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cards Grid -->
      <div v-else class="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        <div
          v-for="pet in filteredPets"
          :key="pet.id"
          class="group overflow-hidden rounded-3xl border-4 border-[#445944] bg-white shadow-[6px_6px_0px_#445944] transition-all duration-300 hover:-translate-y-1 hover:shadow-[10px_10px_0px_#445944]">
          <!-- Image Section -->
          <div class="relative h-48 overflow-hidden border-b-4 border-[#445944] bg-gray-100">
            <img
              :src="pet.photo || DEFAULT_PET_IMAGE"
              @error="handleImageError"
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div
              class="absolute top-3 left-3 rounded-full border-2 border-red-500 bg-red-500 px-3 py-1 text-xs font-black text-white">
              🚨 LOST 協尋中
            </div>
          </div>

          <!-- Card Info Body -->
          <div class="bg-[#FCF4E5] p-5">
            <h3 class="mb-3 truncate text-xl font-black text-[#445944]">{{ pet.breed }}</h3>

            <ul class="mb-4 space-y-2 text-xs font-bold text-gray-700">
              <li class="flex items-center gap-1.5">
                <span class="rounded border border-gray-300 bg-white px-2 py-0.5">毛色</span>
                <span class="truncate">{{ pet.color || '未填寫' }}</span>
              </li>
              <li class="flex items-center gap-1.5">
                <span class="rounded border border-gray-300 bg-white px-2 py-0.5">時間</span>
                <span class="truncate">{{ pet.lostTime || '未知' }}</span>
              </li>
              <li class="flex items-center gap-1.5">
                <span class="rounded border border-gray-300 bg-white px-2 py-0.5">地點</span>
                <span class="truncate" :title="pet.lostPlace">{{ pet.lostPlace || '未知' }}</span>
              </li>
              <li class="flex items-center gap-1.5">
                <span class="rounded border border-gray-300 bg-white px-2 py-0.5">晶片</span>
                <span class="truncate">{{ pet.chipId || '無晶片或未填' }}</span>
              </li>
            </ul>

            <!-- Features Highlights Description Box -->
            <p
              class="mb-4 line-clamp-3 min-h-[72px] rounded-2xl border-2 border-[#445944] bg-[#FDF9F3] p-3 text-[11px] leading-relaxed font-bold text-gray-600">
              {{ pet.feature || '無特徵描述。' }}
            </p>

            <!-- Card details link -->
            <router-link
              :to="{ name: 'missing-report-detail', params: { id: pet.id } }"
              class="block w-full rounded-2xl border-2 border-[#445944] bg-[#FAE4AE] py-2.5 text-center text-sm font-black text-[#445944] shadow-[3px_3px_0px_#445944] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#445944]">
              🔍 査看詳細啓事
            </router-link>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="filteredPets.length === 0 && !loading"
        class="mx-auto max-w-md rounded-3xl border-4 border-dashed border-[#445944] bg-[#FCF4E5] p-8 py-16 text-center shadow-[6px_6px_0px_#445944]">
        <span class="mb-4 block text-5xl">😿</span>
        <h3 class="mb-2 text-xl font-black text-[#445944]">找不到符合條件的遺失毛孩</h3>
        <p class="text-sm font-bold text-gray-600">
          嘗試調整一下篩選條件，或許命定毛孩就在下方唷！
        </p>
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
