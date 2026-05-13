<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import axios from 'axios'

// 假設這是你已有的組件與工具
// import PageBreadcrumb from '@/components/PageBreadcrumb.vue';
// import { formatDate } from '@/utils/format';

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
    const response = await axios.get('https://localhost:7048/api/Pet')
    const { success, data } = response.data
    if (success) {
      rawPets.value = data
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
  <div class="min-h-screen bg-gray-50">
    <section class="relative overflow-hidden bg-black text-white">
      <div class="container mx-auto flex flex-col items-center md:flex-row">
        <div class="z-10 w-full p-8 md:w-1/2 md:p-16">
          <h2 class="mb-4 text-3xl font-bold md:text-5xl">
            我們幫你一起養！
            <br />
            狗狗領養津貼上路
          </h2>
          <p class="mb-8 leading-relaxed text-gray-300">
            經過預備學校社會化的狗狗，更能融入人類家庭。
            <br />
            現在領養還有見面禮—價值近一萬一千元的大禮包！
          </p>
          <button
            class="rounded-full bg-orange-500 px-8 py-3 font-bold text-white transition hover:bg-orange-600">
            我要領養
          </button>
        </div>
        <div class="relative h-64 w-full md:h-[500px] md:w-1/2">
          <!-- <img
            src="/images/banner/dog-hero.jpg"
            alt="Hero"
            class="absolute inset-0 h-full w-full object-cover opacity-80" /> -->
        </div>
      </div>
    </section>

    <main class="container mx-auto px-4 py-12">
      <h1 class="mb-12 text-center text-4xl font-black text-gray-800">領養狗狗</h1>

      <div class="mb-12 flex flex-wrap justify-center gap-4">
        <button
          class="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 shadow-sm transition hover:shadow-md">
          <span class="text-orange-500">🏠</span>
          為什麼要領養巴克幫？
        </button>
        <button
          class="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 shadow-sm transition hover:shadow-md">
          <span class="text-orange-500">❓</span>
          領養流程
        </button>
      </div>

      <div class="mb-10 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:p-10">
        <div class="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div class="lg:col-span-1">
            <label class="mb-2 block text-sm font-bold text-gray-700">以名字搜尋</label>
            <div class="relative">
              <input
                v-model="filters.search"
                type="text"
                placeholder="輸入狗狗名字..."
                class="w-full rounded-full border-gray-200 px-4 py-2 focus:border-orange-500 focus:ring-orange-500" />
            </div>
          </div>

          <div class="grid grid-cols-1 gap-6 md:grid-cols-3 lg:col-span-3">
            <div>
              <h5 class="mb-3 font-bold">性別</h5>
              <div class="flex gap-2">
                <button
                  @click="filters.gender = 'male'"
                  :class="
                    filters.gender === 'male'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-600'
                  "
                  class="rounded-full px-4 py-2 text-sm transition">
                  弟弟
                </button>
                <button
                  @click="filters.gender = 'female'"
                  :class="
                    filters.gender === 'female'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-600'
                  "
                  class="rounded-full px-4 py-2 text-sm transition">
                  妹妹
                </button>
              </div>
            </div>

            <div>
              <h5 class="mb-3 font-bold">
                年齡
                <small class="font-normal text-gray-400">(歲)</small>
              </h5>
              <select v-model="filters.ageRange" class="w-full rounded-lg border-gray-200 text-sm">
                <option value="">全部年齡</option>
                <option value="0,1">幼犬 (0-1)</option>
                <option value="1,3">青少年 (1-3)</option>
                <option value="3,8">成犬 (3-8)</option>
                <option value="8,40">老犬 (8+)</option>
              </select>
            </div>

            <div>
              <h5 class="mb-3 font-bold">
                體型
                <small class="font-normal text-gray-400">(kg)</small>
              </h5>
              <select v-model="filters.sizeRange" class="w-full rounded-lg border-gray-200 text-sm">
                <option value="">全部體型</option>
                <option value="0,12">小型犬 (under 12)</option>
                <option value="12,25">中型犬 (12-25)</option>
                <option value="25,200">大型犬 (25+)</option>
              </select>
            </div>
          </div>
        </div>

        <div class="mt-8 flex items-center justify-between border-t border-gray-50 pt-6">
          <div class="flex items-center gap-4">
            <span class="text-sm font-bold text-gray-500">適合相處：</span>
            <label class="inline-flex items-center text-sm">
              <input
                type="checkbox"
                v-model="filters.goodWith"
                value="kids"
                class="mr-2 rounded text-orange-500" />
              小孩
            </label>
            <label class="inline-flex items-center text-sm">
              <input
                type="checkbox"
                v-model="filters.goodWith"
                value="dogs"
                class="mr-2 rounded text-orange-500" />
              其他狗狗
            </label>
          </div>
          <button
            @click="resetFilters"
            class="text-sm text-gray-400 transition hover:text-orange-500">
            🔄 重置篩選條件
          </button>
        </div>
      </div>

      <div v-if="loading" class="flex justify-center py-20">
        <div class="h-12 w-12 animate-spin rounded-full border-b-2 border-orange-500"></div>
      </div>

      <div v-else class="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
        <div
          v-for="pet in filteredPets"
          :key="pet.id"
          class="group transform overflow-hidden rounded-3xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div class="relative aspect-square overflow-hidden">
            <img
              :src="pet.imageUrl"
              :alt="pet.name"
              class="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
            <div
              class="bg-opacity-0 group-hover:bg-opacity-20 absolute inset-0 flex items-center justify-center bg-black transition-all">
              <button
                class="translate-y-4 transform rounded-full bg-white px-6 py-2 font-bold text-gray-800 opacity-0 shadow-lg transition-all group-hover:translate-y-0 group-hover:opacity-100">
                狗狗檔案
              </button>
            </div>
          </div>

          <div class="p-6">
            <div
              class="mb-2 inline-block rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-600">
              {{ pet.nickname || '精選夥伴' }}
            </div>
            <h3 class="mb-1 text-xl font-bold text-gray-800">{{ pet.name }}</h3>
            <p class="text-sm leading-relaxed text-gray-500">
              {{ pet.gender === 'female' ? '妹妹' : '弟弟' }} • {{ pet.age }}歲 •
              <br />
              {{ pet.color }} • {{ pet.weight }}kg
            </p>
          </div>
        </div>
      </div>

      <div v-if="!loading && filteredPets.length === 0" class="py-20 text-center">
        <p class="text-lg text-gray-400">找不到符合條件的狗狗，嘗試調整篩選條件吧！</p>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* 可以在這裡加入細微的漸層或特殊動畫 */
.aspect-square {
  aspect-ratio: 1 / 1;
}
</style>
