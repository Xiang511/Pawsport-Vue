<script setup>
import { ref, computed } from 'vue'
import MedicalTab from '@/components/Client/MedicalTab.vue'
import VaccineTab from '@/components/Client/VaccineTab.vue'
import ImageTab from '@/components/Client/ImageTab.vue'
import WeightTab from '@/components/Client/WeightTab.vue'
import { useRouter } from 'vue-router'
import { SquarePlus, SquarePen } from 'lucide-vue-next'

const router = useRouter()

// 1. 整合資料：把該寵物的紀錄直接放在 pets 物件裡（模擬 API 回傳的一對多資料）
const pets = ref([
  {
    id: 101,
    name: 'Toast',
    age: '8個月',
    photo: 'toast.jpg',
    medicalRecords: [
      {
        medicalDetailId: 1,
        disease: '腸胃炎',
        diseaseTreatment: '口服藥物',
        location: '嘉大醫院',
        time: '2024-05-10',
      },
    ],
    vaccinations: [
      {
        historyId: 1,
        type: '狂犬病',
        location: '嘉大醫院',
        time: '2024-01-15',
        forecast: '2025-01-15',
      },
    ],
    weightRecords: [
      { id: 1, date: '2024-01-10', weight: 5.2 },
      { id: 2, date: '2024-02-15', weight: 5.5 },
      { id: 3, date: '2024-03-12', weight: 5.8 },
      { id: 4, date: '2024-04-18', weight: 5.6 },
      { id: 5, date: '2024-05-10', weight: 6.0 },
    ],
  },
  {
    id: 102,
    name: 'LeeOn',
    age: '5歲5個月',
    photo: 'leeon.jpg',
    medicalRecords: [], // 這隻沒資料，測試「尚無紀錄」狀態
    vaccinations: [],
  },
  { id: 103, name: 'Duck', age: '2歲', photo: 'duck.jpg', medicalRecords: [], vaccinations: [] },
])

const activePetId = ref(101)
const activeTab = ref('醫療史')
const tabs = ['醫療史', '疫苗', '影像', '體重']

// 核心邏輯：當 activePetId 變，currentPet 就變，底下的子組件就會自動重新渲染
const currentPet = computed(() => {
  return pets.value.find((p) => p.id === activePetId.value)
})

const addNewPet = () => router.push({ name: 'pet-health-passport-add' })
const goToEditPage = (PetId) => {
  router.push({ name: 'pet-health-passport-edit', params: { id: PetId } })
}
</script>

<template>
  <div class="min-h-screen bg-[#F7F3F1] pb-20">
    <!-- 標題區塊 (參考 MissingPetView) -->
    <section class="mb-8 bg-white px-6 py-10 text-center shadow-sm">
      <h1 class="mb-2 text-3xl font-bold text-[#9C6D6D]">毛孩護照</h1>
      <p class="text-gray-500">記錄毛孩的健康點滴</p>
    </section>

    <div class="relative mx-auto max-w-6xl px-4">
      <!-- 新增寵物按鈕 -->
      <button
        @click="addNewPet"
        class="absolute -top-16 right-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#9C6D6D] shadow-sm transition hover:bg-[#9C6D6D] hover:text-white lg:right-4">
        <SquarePlus />
      </button>

      <div class="flex flex-col gap-6 lg:flex-row">
        <!-- 左側：寵物資料與切換 -->
        <div class="w-full lg:w-1/3">
          <div class="sticky top-6 rounded-3xl bg-white p-6 shadow-sm">
            <div class="mb-6 flex flex-col items-center text-center">
              <div class="relative mb-4 h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-gray-200 shadow-lg">
                <img :src="currentPet.photo" class="h-full w-full object-cover" />
              </div>
              <h2 class="flex items-center gap-2 text-2xl font-bold text-gray-800">
                {{ currentPet.name }}
                <SquarePen
                  @click="goToEditPage(currentPet.id)"
                  class="h-5 w-5 cursor-pointer text-gray-400 hover:text-[#9C6D6D]" />
              </h2>
              <p class="text-sm text-gray-500">{{ currentPet.age }}</p>
            </div>

            <!-- 切換毛孩 -->
            <div class="border-t pt-4">
              <h3 class="mb-3 text-sm font-bold text-gray-400">切換毛孩</h3>
              <div class="flex flex-wrap gap-3 justify-center">
                <div
                  v-for="pet in pets"
                  :key="pet.id"
                  @click="activePetId = pet.id"
                  class="h-12 w-12 cursor-pointer overflow-hidden rounded-full border-2 shadow-sm transition-all duration-300"
                  :class="
                    activePetId === pet.id ? 'scale-110 border-[#9C6D6D]' : 'border-white opacity-60'
                  ">
                  <img :src="pet.photo" class="h-full w-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右側：功能 Tab 與內容 -->
        <div class="w-full lg:w-2/3">
          <!-- Tab 選單 -->
          <div class="mb-6 flex justify-center rounded-full bg-gray-200 p-1">
            <button
              v-for="tab in tabs"
              :key="tab"
              @click="activeTab = tab"
              :class="[
                'flex-1 rounded-full px-4 py-2 text-sm font-bold transition-all duration-300',
                activeTab === tab
                  ? 'bg-[#9C6D6D] text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100',
              ]">
              {{ tab }}
            </button>
          </div>

          <!-- 內容區塊 -->
          <div class="min-h-[400px] rounded-2xl bg-white p-6 shadow-sm">
            <MedicalTab v-if="activeTab === '醫療史'" :records="currentPet.medicalRecords" />
            <VaccineTab v-if="activeTab === '疫苗'" :vaccines="currentPet.vaccinations" />
            
            <div v-if="activeTab === '影像'">
              <ImageTab :passportRecords="[]" />
            </div>

            <WeightTab v-if="activeTab === '體重'" :records="currentPet.weightRecords" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
