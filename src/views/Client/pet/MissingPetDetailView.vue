<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Undo2, MapPin, Phone, Mail, Heart, Calendar, User, Copy, Image } from 'lucide-vue-next'
import request from '@/api/axios'

const route = useRoute()
const router = useRouter()

// 寵物詳細資料 (與 API 對接)
const pet = ref(null)

const fetchPetDetail = async (id) => {
  try {
    const response = await request.get(`/users/missing-pets/${id}`)
    pet.value = response.data.data || response.data
  } catch (error) {
    console.error('取得寵物詳細資料失敗:', error)
    alert('找不到這筆遺失紀錄或已被撤銷')
    router.back()
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
  <div class="min-h-screen bg-[#F7F3F1] pb-20">
    <section class="mb-8 bg-white px-6 py-10 text-center shadow-sm">
      <h1 class="mb-2 text-3xl font-bold text-[#9C6D6D]">遺失啟事</h1>
      <p class="text-gray-500">尋獲及領回寵物的飼主，請至登記站辦理尋獲及領回的登記！</p>
    </section>

    <div v-if="pet" class="mx-auto max-w-6xl px-4">
      <div class="flex flex-col gap-6 lg:flex-row">
        <!-- 左側：照片區塊 -->
        <aside class="w-full lg:w-1/3">
          <div class="sticky top-6 rounded-3xl bg-white p-4 shadow-sm">
            <h3 class="mb-4 text-center text-lg font-bold text-[#9C6D6D]">寵物照片</h3>
            <div class="overflow-hidden rounded-2xl">
              <img
                :src="pet.photo"
                class="w-full transition-transform duration-700 hover:scale-105"
                :alt="pet.breed" />
            </div>
            <button
              @click="goBack"
              class="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#9C6D6D] py-2 text-sm font-bold text-[#9C6D6D] transition hover:bg-[#9C6D6D] hover:text-white">
              <Undo2 class="h-4 w-4" />
              返回列表
            </button>
          </div>
        </aside>

        <!-- 右側：資料區塊 -->
        <div class="w-full lg:w-2/3">
          <div class="rounded-3xl bg-white shadow-sm overflow-hidden">
            <!-- 寵物資訊 -->
            <div class="border-b">
              <div class="flex items-center gap-3 bg-[#FBF9F8] px-6 py-4 text-[#9C6D6D]">
                <Heart class="h-5 w-5" />
                <h3 class="text-lg font-bold">寵物資訊</h3>
              </div>
              <ul class="divide-y divide-gray-100 px-6 text-sm text-gray-600">
                <li class="flex items-center py-3">
                  <p class="w-32 font-bold text-gray-400">寵物名</p>
                  <p class="text-gray-800">{{ pet.breed }}</p>
                </li>
                <li class="flex items-center py-3">
                  <p class="w-32 font-bold text-gray-400">晶片號碼</p>
                  <p class="font-mono text-gray-800">{{ pet.chipId }}</p>
                </li>
                <li class="flex items-center py-3">
                  <p class="w-32 font-bold text-gray-400">性別 / 動物類別</p>
                  <p class="text-gray-800">{{ pet.gender }} / {{ pet.species }}</p>
                </li>
                <li class="flex items-center py-3">
                  <p class="w-32 font-bold text-gray-400">毛色</p>
                  <p class="text-gray-800">{{ pet.color }}</p>
                </li>
                <li class="flex items-start py-3">
                  <p class="w-32 font-bold text-gray-400 shrink-0">特徵描述</p>
                  <p class="text-gray-800 leading-relaxed">{{ pet.feature }}</p>
                </li>
              </ul>
            </div>

            <!-- 遺失資訊 -->
            <div class="border-b">
              <div class="flex items-center gap-3 bg-[#FBF9F8] px-6 py-4 text-[#9C6D6D]">
                <Calendar class="h-5 w-5" />
                <h3 class="text-lg font-bold">遺失資訊</h3>
              </div>
              <ul class="divide-y divide-gray-100 px-6 text-sm text-gray-600">
                <li class="flex items-center py-3">
                  <p class="w-32 font-bold text-gray-400">遺失時間</p>
                  <p class="text-gray-800">{{ pet.lostTime }}</p>
                </li>
                <li class="flex items-center py-3">
                  <p class="w-32 font-bold text-gray-400">申報時間</p>
                  <p class="text-gray-800">{{ pet.addDate }}</p>
                </li>
                <li class="flex items-center py-3">
                  <p class="w-32 font-bold text-gray-400">遺失地點</p>
                  <div class="flex items-center gap-2 text-gray-800">
                    {{ pet.city }}{{ pet.district }}{{ pet.lostPlace }}
                    <a
                      :href="'https://www.google.com.tw/maps/search/' + pet.city + pet.district + pet.lostPlace + '/'"
                      target="_blank"
                      class="text-[#9C6D6D] hover:underline flex items-center gap-1">
                      <MapPin class="h-4 w-4" />
                      地圖
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            <!-- 聯絡方式 -->
            <div>
              <div class="flex items-center gap-3 bg-[#FBF9F8] px-6 py-4 text-[#9C6D6D]">
                <User class="h-5 w-5" />
                <h3 class="text-lg font-bold">聯絡方式</h3>
              </div>
              <ul class="divide-y divide-gray-100 px-6 text-sm text-gray-600">
                <li class="flex items-center py-3">
                  <p class="w-32 font-bold text-gray-400">發布人</p>
                  <p class="text-gray-800">{{ pet.reporterName }}</p>
                </li>
                <li class="flex items-center py-3">
                  <p class="w-32 font-bold text-gray-400">聯絡電話</p>
                  <div class="flex items-center gap-2 text-gray-800">
                    {{ pet.contactPhone }}
                    <button
                      @click="clipboard(pet.contactPhone)"
                      class="text-gray-400 hover:text-[#9C6D6D]"
                      title="點擊複製電話">
                      <Copy class="h-4 w-4" />
                    </button>
                  </div>
                </li>
                <li class="flex items-center py-3">
                  <p class="w-32 font-bold text-gray-400">E-mail</p>
                  <div class="flex items-center gap-2 text-gray-800">
                    {{ pet.contactEmail }}
                    <button
                      @click="clipboard(pet.contactEmail)"
                      class="text-gray-400 hover:text-[#9C6D6D]"
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
    <div v-else class="flex items-center justify-center pt-20">
      <div class="text-xl font-bold text-gray-400">載入中...</div>
    </div>
  </div>
</template>
