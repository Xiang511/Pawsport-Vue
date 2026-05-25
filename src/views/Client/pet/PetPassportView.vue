<script setup>
import { ref, computed, onMounted } from 'vue'
import MedicalTab from '@/components/Client/MedicalTab.vue'
import VaccineTab from '@/components/Client/VaccineTab.vue'
import ImageTab from '@/components/Client/ImageTab.vue'
import WeightTab from '@/components/Client/WeightTab.vue'
import { useRouter } from 'vue-router'
import { SquarePlus, SquarePen } from 'lucide-vue-next'
import request from '@/api/axios'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(true)
const pets = ref([])
const activePetId = ref(null)
const activeTab = ref('醫療史')
const tabs = ['醫療史', '疫苗', '影像', '體重']

const currentPet = computed(() => {
  return pets.value.find((p) => p.id === activePetId.value) || null
})

const fetchPassports = async () => {
  try {
    loading.value = true
    const userId = authStore.userInfo?.userId || authStore.userInfo?.id
    
    if (!userId) {
      console.warn('無法取得使用者 ID，請確認是否已登入')
      pets.value = []
      return
    }

    const response = await request.get(`/users/pet/passports?userId=${userId}`)
    const { success, data } = response.data
    if (success && data && data.length > 0) {
      pets.value = data
      activePetId.value = data[0].id
    } else {
      pets.value = []
    }
  } catch (error) {
    console.error('無法取得寵物健康護照資料:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPassports()
})

const addNewPet = () => router.push({ name: 'pet-health-passport-add' })
const goToEditPage = (PetId) => {
  router.push({ name: 'pet-health-passport-edit', params: { id: PetId } })
}

// Tab 新增按鈕路由跳轉
const onAddMedical = () => {
  router.push({ name: 'passport-add-medical', query: { passportId: currentPet.value?.id } })
}
const onAddVaccine = () => {
  router.push({ name: 'passport-add-vaccine', query: { passportId: currentPet.value?.id } })
}
const onAddImage = () => {
  router.push({ name: 'passport-add-image', query: { passportId: currentPet.value?.id } })
}
const onAddWeight = () => {
  router.push({ name: 'passport-add-weight', query: { passportId: currentPet.value?.id } })
}
</script>

<template>
  <div class="min-h-screen bg-[#F7F3F1] pb-20">
    <section class="mb-8 bg-white px-6 py-10 text-center shadow-sm">
      <h1 class="mb-2 text-3xl font-bold text-[#9C6D6D]">毛孩護照</h1>
      <p class="text-gray-500">記錄毛孩的健康點滴</p>
    </section>

    <div class="relative mx-auto max-w-6xl px-4">
      <button
        @click="addNewPet"
        class="absolute -top-16 right-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#9C6D6D] shadow-sm transition hover:bg-[#9C6D6D] hover:text-white lg:right-4">
        <SquarePlus />
      </button>

      <div v-if="loading" class="py-20 text-center text-gray-500">資料同步加載中...</div>

      <div v-else-if="pets.length === 0" class="rounded-3xl bg-white py-20 text-center shadow-sm">
        <p class="text-lg text-gray-400">目前尚無建檔的毛孩護照紀錄。</p>
      </div>

      <div v-else class="flex flex-col gap-6 lg:flex-row">
        <div class="w-full lg:w-1/3">
          <div class="sticky top-6 rounded-3xl bg-white p-6 shadow-sm">
            <div class="mb-6 flex flex-col items-center text-center" v-if="currentPet">
              <div
                class="relative mb-4 h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-gray-200 shadow-lg">
                <img :src="currentPet.photo" class="h-full w-full object-cover" />
              </div>
              <h2 class="flex items-center gap-2 text-2xl font-bold text-gray-800">
                {{ currentPet.name }}
                <SquarePen
                  @click="goToEditPage(currentPet.id)"
                  class="h-5 w-5 cursor-pointer text-gray-400 hover:text-[#9C6D6D]" />
              </h2>
              <p class="text-sm text-gray-500">
                {{ currentPet.age }} ({{
                  currentPet.gender === 1 ? '公' : currentPet.gender === 2 ? '母' : '未知'
                }})
              </p>
              <p
                class="mt-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                {{ currentPet.isDesex ? '已絕育' : '未絕育' }} · 最新體重 {{ currentPet.weight }} KG
              </p>
            </div>

            <div class="border-t pt-4">
              <h3 class="mb-3 text-sm font-bold text-gray-400">切換護照紀錄</h3>
              <div class="flex flex-wrap justify-center gap-3">
                <div
                  v-for="pet in pets"
                  :key="pet.id"
                  @click="activePetId = pet.id"
                  class="h-12 w-12 cursor-pointer overflow-hidden rounded-full border-2 shadow-sm transition-all duration-300"
                  :class="
                    activePetId === pet.id
                      ? 'scale-110 border-[#9C6D6D]'
                      : 'border-white opacity-60'
                  ">
                  <img :src="pet.photo" class="h-full w-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="w-full lg:w-2/3">
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

          <div class="min-h-[400px] rounded-2xl bg-white p-6 shadow-sm" v-if="currentPet">
            <MedicalTab v-if="activeTab === '醫療史'" :records="currentPet.medicalRecords" @add-medical="onAddMedical" />
            <VaccineTab v-if="activeTab === '疫苗'" :vaccines="currentPet.vaccinations" @add-vaccine="onAddVaccine" />
            <div v-if="activeTab === '影像'">
              <ImageTab :passportRecords="[currentPet]" @add-image="onAddImage" />
            </div>
            <WeightTab v-if="activeTab === '體重'" :records="currentPet.weightRecords" @add-weight="onAddWeight" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
