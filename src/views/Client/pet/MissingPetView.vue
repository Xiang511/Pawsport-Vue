<script setup>
import { ref, reactive, computed } from 'vue'
import { SquarePlus } from 'lucide-vue-next'

// 1. 篩選狀態
const filters = reactive({
  type: '狗', // 預設狗
  gender: '', // 公/母
  city: '', // 新增：縣市
  district: '', // 新增：地區
  variety: '', // 品種
  keyword: '', // 晶片/特徵
})

// 2. 模擬遺失寵物資料 (對應原始碼中的 losePets)
const lostPets = ref([
  {
    id: 1,
    breed: '可愛小笨狗',
    gender: '母',
    city: '台北市',
    district: '大安區',
    lostTime: '2024-05-15',
    lostPlace: '嘉義市東區中山路',
    chipId: '900111000123***',
    feature: '身上穿著藍色胸背帶，對陌生人害羞但不會攻擊。',
    photo:
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 2,
    breed: '米克斯',
    gender: '公',
    city: '嘉義市',
    district: '東區',
    lostTime: '2024-05-12',
    lostPlace: '台南市永康區',
    chipId: '無',
    feature: '左耳有剪耳標記，尾巴末端有一點勾勾。',
    photo:
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400',
  },
])

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
  // ... 其他縣市可以依此類推
}
// 取得當前選中縣市的地區清單
const availableDistricts = computed(() => {
  return cityData[filters.city] || []
})

// 當縣市改變時，重置地區
const onCityChange = () => {
  filters.district = ''
}

// 3. 搜尋方法
const handleSearch = () => {
  console.log('執行篩選：', filters)
  // 這裡之後串接 API
}
</script>

<template>
  <div class="min-h-screen bg-[#F7F3F1] pb-20">
    <section class="mb-8 bg-white px-6 py-10 text-center shadow-sm">
      <h1 class="mb-2 text-3xl font-bold text-[#9C6D6D]">遺失啟事</h1>
      <p class="text-gray-500">希望能幫助每個毛孩找到回家的路</p>
      <div
        class="mt-4 inline-block rounded-full bg-orange-50 px-4 py-1 text-sm font-medium text-orange-600">
        尋獲寵物後，請記得辦理撤銷申報唷！
      </div>
    </section>

    <div class="mx-auto max-w-6xl px-4">
      <div class="mb-8 rounded-3xl bg-white p-6 shadow-sm">
        <div class="mb-6 flex items-center gap-2 border-b pb-4">
          <i class="fa-solid fa-filter text-[#9C6D6D]"></i>
          <h2 class="text-lg font-bold text-gray-700">篩選條件</h2>
        </div>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label class="mb-2 block text-sm text-gray-500">動物類別</label>
            <div class="flex gap-4">
              <button
                v-for="t in ['狗', '貓', '其他']"
                :key="t"
                @click="filters.type = t"
                :class="
                  filters.type === t ? 'bg-[#9C6D6D] text-white' : 'bg-gray-100 text-gray-500'
                "
                class="rounded-full px-6 py-2 text-sm shadow-sm transition">
                {{ t }}
              </button>
            </div>
          </div>

          <div>
            <label class="mb-2 block text-sm text-gray-500">性別</label>
            <div class="flex gap-4">
              <button
                v-for="g in ['公', '母', '不限']"
                :key="g"
                @click="filters.gender = g"
                :class="
                  filters.gender === g
                    ? 'border-[#9C6D6D] text-[#9C6D6D]'
                    : 'border-gray-200 text-gray-400'
                "
                class="flex-1 rounded-xl border-2 py-2 text-sm transition">
                {{ g }}
              </button>
            </div>
          </div>

          <div>
            <label class="mb-2 block text-sm text-gray-500">遺失縣市</label>
            <div class="relative">
              <select
                v-model="filters.city"
                @change="onCityChange"
                class="w-full cursor-pointer appearance-none rounded-xl border-none bg-gray-50 p-3 text-gray-700 outline-none focus:ring-2 focus:ring-[#9C6D6D]">
                <option value="">請選擇縣市</option>
                <option v-for="(districts, city) in cityData" :key="city" :value="city">
                  {{ city }}
                </option>
              </select>
              <i
                class="fa-solid fa-chevron-down pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-xs text-gray-400"></i>
            </div>
          </div>

          <div>
            <label class="mb-2 block text-sm text-gray-500">行政地區</label>
            <div class="relative">
              <select
                v-model="filters.district"
                :disabled="!filters.city"
                class="w-full cursor-pointer appearance-none rounded-xl border-none bg-gray-50 p-3 text-gray-700 outline-none focus:ring-2 focus:ring-[#9C6D6D] disabled:cursor-not-allowed disabled:opacity-50">
                <option value="">{{ filters.city ? '請選擇地區' : '請先選擇縣市' }}</option>
                <option v-for="dist in availableDistricts" :key="dist" :value="dist">
                  {{ dist }}
                </option>
              </select>
              <i
                class="fa-solid fa-chevron-down pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-xs text-gray-400"></i>
            </div>
          </div>

          <div class="lg:col-span-2">
            <label class="mb-2 block text-sm text-gray-500">關鍵字搜尋</label>
            <input
              v-model="filters.keyword"
              type="text"
              placeholder="晶片號碼 / 特徵描述 / 遺失地點"
              class="w-full rounded-xl border-none bg-gray-50 p-3 outline-none focus:ring-2 focus:ring-[#9C6D6D]" />
          </div>

          <div class="flex items-end">
            <button
              @click="handleSearch"
              class="w-full rounded-xl bg-[#B59891] py-3 font-bold text-white shadow-md transition hover:bg-[#9C6D6D]">
              執行篩選
            </button>
          </div>
        </div>
      </div>

      <div class="mb-6 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-list-ul text-[#9C6D6D]"></i>
          <h2 class="text-xl font-bold text-gray-700">最新遺失啟事</h2>
        </div>

        <router-link
          :to="{ name: 'missing-report-create' }"
          class="flex items-center gap-2 rounded-full bg-[#9C6D6D] px-5 py-2 text-sm font-bold text-white shadow-md transition hover:bg-[#855a5a]">
          <SquarePlus />
          刊登遺失協尋
        </router-link>
      </div>

      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="pet in lostPets"
          :key="pet.id"
          class="group overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md">
          <div class="relative h-48 overflow-hidden">
            <img
              :src="pet.photo"
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div
              class="absolute top-3 left-3 rounded-md bg-red-500 px-2 py-1 text-xs text-white shadow-sm">
              LOST 遺失中
            </div>
          </div>

          <div class="p-4">
            <h3 class="mb-3 text-lg font-bold text-gray-800">{{ pet.breed }}</h3>

            <ul class="mb-4 space-y-2 text-sm text-gray-600">
              <li class="flex gap-2">
                <span class="shrink-0 font-bold text-gray-400">毛色：</span>
                {{ pet.color }}
              </li>
              <li class="flex gap-2">
                <span class="shrink-0 font-bold text-gray-400">時間：</span>
                {{ pet.lostTime }}
              </li>
              <li class="flex gap-2">
                <span class="shrink-0 font-bold text-gray-400">地點：</span>
                {{ pet.lostPlace }}
              </li>
              <li class="flex gap-2">
                <span class="shrink-0 font-bold text-gray-400">晶片：</span>
                {{ pet.chipId }}
              </li>
            </ul>

            <p
              class="mb-4 min-h-[60px] rounded-xl bg-[#FBF9F8] p-3 text-xs leading-relaxed text-gray-500">
              {{ pet.feature }}
            </p>

            <router-link
              :to="{ name: 'missing-report-detail', params: { id: pet.id } }"
              class="block w-full text-center rounded-lg border-2 border-[#B59891] py-2 text-sm font-bold text-[#B59891] transition hover:bg-[#B59891] hover:text-white">
              查看詳細內容
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
