<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Undo2, MapPin, Phone, Mail, Heart, Calendar, User, Copy, Image } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

// 模擬從 API 取得的資料，欄位名稱參考自範例
const pet = ref({
  id: 1,
  PETNAME: '小笨狗',
  ANIM: '狗',
  L_BREEDNAME: '米克斯',
  L_TWPetSEX: '母',
  HAIRCOLOR: '棕黃色',
  HAIRNAME: '短毛',
  L_TIME: '2024-05-15',
  AddDate: '2024-05-16',
  L_PLACE: '嘉義市東區中山路 123 號附近',
  CHIPID: '900111000123***',
  petFeature: '身上穿著藍色胸背帶，左耳有剪耳，對陌生人害羞但不會攻擊。喜歡吃肉乾。',
  photo:
    'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=600',
  FDRNAME: '張先生',
  L_HTEL: '0912-345-678',
  L_EMAIL: 'owner@example.com',
})

onMounted(() => {
  const id = route.params.id
  console.log('取得寵物 ID:', id)
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
    <!-- 標題區塊 (參考 chapter-title) -->
    <section class="mb-8 bg-white px-6 py-10 text-center shadow-sm">
      <h1 class="mb-2 text-3xl font-bold text-[#9C6D6D]">遺失啟事</h1>
      <p class="text-gray-500">尋獲及領回寵物的飼主，請至登記站辦理尋獲及領回的登記！</p>
    </section>

    <div class="mx-auto max-w-6xl px-4">
      <!-- 佈局區塊 (參考 card-wrap with-nav) -->
      <div class="flex flex-col gap-6 lg:flex-row">
        <!-- 左側：照片區塊 (參考 aside.card-aside) -->
        <aside class="w-full lg:w-1/3">
          <div class="sticky top-6 rounded-3xl bg-white p-4 shadow-sm">
            <h3 class="mb-4 text-center text-lg font-bold text-[#9C6D6D]">寵物照片</h3>
            <div class="overflow-hidden rounded-2xl">
              <img
                :src="pet.photo"
                class="w-full transition-transform duration-700 hover:scale-105"
                :alt="pet.PETNAME" />
            </div>
            <!-- 返回按鈕 -->
            <button
              @click="goBack"
              class="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#9C6D6D] py-2 text-sm font-bold text-[#9C6D6D] transition hover:bg-[#9C6D6D] hover:text-white">
              <Undo2 class="h-4 w-4" />
              返回列表
            </button>
          </div>
        </aside>

        <!-- 右側：資料區塊 (參考 card-data) -->
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
                  <p class="text-gray-800">{{ pet.PETNAME }}</p>
                </li>
                <li class="flex items-center py-3">
                  <p class="w-32 font-bold text-gray-400">晶片號碼</p>
                  <p class="font-mono text-gray-800">{{ pet.CHIPID }}</p>
                </li>
                <li class="flex items-center py-3">
                  <p class="w-32 font-bold text-gray-400">性別 / 動物類別</p>
                  <p class="text-gray-800">{{ pet.L_TWPetSEX }} / {{ pet.ANIM }}</p>
                </li>
                <li class="flex items-center py-3">
                  <p class="w-32 font-bold text-gray-400">品種</p>
                  <p class="text-gray-800">{{ pet.L_BREEDNAME }}</p>
                </li>
                <li class="flex items-center py-3">
                  <p class="w-32 font-bold text-gray-400">毛色 / 外觀</p>
                  <p class="text-gray-800">{{ pet.HAIRCOLOR }} / {{ pet.HAIRNAME }}</p>
                </li>
                <li class="flex items-start py-3">
                  <p class="w-32 font-bold text-gray-400 shrink-0">特徵</p>
                  <p class="text-gray-800 leading-relaxed">{{ pet.petFeature }}</p>
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
                  <p class="text-gray-800">{{ pet.L_TIME }}</p>
                </li>
                <li class="flex items-center py-3">
                  <p class="w-32 font-bold text-gray-400">申報時間</p>
                  <p class="text-gray-800">{{ pet.AddDate }}</p>
                </li>
                <li class="flex items-center py-3">
                  <p class="w-32 font-bold text-gray-400">遺失地點</p>
                  <div class="flex items-center gap-2 text-gray-800">
                    {{ pet.L_PLACE }}
                    <a
                      :href="'https://www.google.com.tw/maps/search/' + pet.L_PLACE + '/'"
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
                  <p class="w-32 font-bold text-gray-400">飼主姓名</p>
                  <p class="text-gray-800">{{ pet.FDRNAME }}</p>
                </li>
                <li class="flex items-center py-3">
                  <p class="w-32 font-bold text-gray-400">聯絡電話</p>
                  <div class="flex items-center gap-2 text-gray-800">
                    {{ pet.L_HTEL }}
                    <button
                      @click="clipboard(pet.L_HTEL)"
                      class="text-gray-400 hover:text-[#9C6D6D]"
                      title="點擊複製電話">
                      <Copy class="h-4 w-4" />
                    </button>
                  </div>
                </li>
                <li class="flex items-center py-3">
                  <p class="w-32 font-bold text-gray-400">E-mail</p>
                  <div class="flex items-center gap-2 text-gray-800">
                    {{ pet.L_EMAIL }}
                    <button
                      @click="clipboard(pet.L_EMAIL)"
                      class="text-gray-400 hover:text-[#9C6D6D]"
                      title="點擊複製 E-mail">
                      <Copy class="h-4 w-4" />
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <!-- 底部功能 (參考 captureHandler) -->
          <div class="mt-4 text-right">
            <button
              class="inline-flex items-center gap-2 rounded-xl bg-[#9C6D6D] px-4 py-2 text-sm font-bold text-white shadow-md transition hover:bg-[#855a5a]">
              <Image class="h-4 w-4" />
              頁面存成圖檔
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 保持乾淨，主要使用 Tailwind */
</style>
