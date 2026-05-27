<script setup>
import { ref, computed, onMounted } from 'vue'
import MedicalTab from '@/components/Client/MedicalTab.vue'
import VaccineTab from '@/components/Client/VaccineTab.vue'
import ImageTab from '@/components/Client/ImageTab.vue'
import WeightTab from '@/components/Client/WeightTab.vue'
import { useRouter } from 'vue-router'
import { SquarePlus, SquarePen, Sparkles } from 'lucide-vue-next'
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

const DEFAULT_PET_IMAGE = 'https://placehold.co/600x600?text=Petmily'

const getImageUrl = (url) => {
  if (!url) return DEFAULT_PET_IMAGE
  if (url.startsWith('/Images') || url.startsWith('/images')) {
    return `https://localhost:7048${url}`
  }
  return url
}

const handleImageError = (e) => {
  e.target.src = DEFAULT_PET_IMAGE
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
          PAWSPORT HEALTH RECORD
        </div>
        <h1 class="mb-6 text-4xl leading-tight font-black text-[#445944] md:text-5xl">
          健康護照
          <span class="relative z-10 inline-block px-2 text-[#7a6856]">
            毛孩 Pawsport
            <span
              class="absolute right-0 bottom-1.5 left-0 -z-10 h-3 -rotate-1 transform rounded bg-[#FAE4AE] md:h-4"></span>
          </span>
        </h1>
        <p class="mb-2 max-w-xl text-base font-bold text-gray-600">
          科學化記錄愛寵健康成長點滴，包含醫療史、疫苗接種、日常體重與醫療影像，
          <br />
          全方位守護寶貝健康。
        </p>
      </div>
    </header>

    <!-- MAIN BODY -->
    <div class="relative mx-auto mt-12 w-[90%] max-w-7xl px-4">
      <!-- Add New Pet Floating Action Item -->
      <button
        @click="addNewPet"
        class="absolute -top-16 right-4 z-10 flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-[#445944] bg-[#445944] text-white shadow-[3px_3px_0px_#445944] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#445944]">
        <SquarePlus :size="22" />
      </button>

      <!-- Loading State (Premium Neo-Brutalist Skeleton Detailed Loader) -->
      <div v-if="loading" class="flex animate-pulse flex-col gap-8 lg:flex-row">
        <!-- Left Side Column: Active Pet Card Skeleton -->
        <div class="w-full lg:w-1/3">
          <div
            class="flex flex-col items-center rounded-3xl border-4 border-[#445944]/30 bg-white p-6 text-center shadow-[6px_6px_0px_rgba(68,89,68,0.1)]">
            <!-- Avatar Image Circle Skeleton -->
            <div
              class="mb-4 flex h-32 w-32 items-center justify-center rounded-full border-4 border-[#445944]/20 bg-[#FCF4E5]">
              <span class="text-4xl opacity-20">🐾</span>
            </div>
            <!-- Name & Info Skeleton -->
            <div class="mb-3 h-8 w-1/2 rounded-xl bg-[#445944]/20"></div>
            <div class="mb-4 h-5 w-2/3 rounded-lg bg-[#445944]/15"></div>
            <div class="mb-6 h-8 w-3/4 rounded-xl bg-[#445944]/20"></div>

            <!-- Switch list circles skeleton -->
            <div class="w-full border-t-2 border-[#445944]/20 pt-4">
              <div class="mx-auto mb-3 h-4 w-1/3 rounded-lg bg-[#445944]/15"></div>
              <div class="flex justify-center gap-3">
                <div
                  v-for="j in 3"
                  :key="j"
                  class="h-12 w-12 rounded-full border-2 border-dashed border-[#445944]/20 bg-[#FCF4E5]/40"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side Column: Tab Selector and Content Tab Skeleton -->
        <div class="w-full space-y-6 lg:w-2/3">
          <!-- Neo-brutalist Tabs Bar Skeleton -->
          <div
            class="flex gap-2 rounded-2xl border-4 border-[#445944]/30 bg-[#FCF4E5]/50 p-1.5 shadow-[4px_4px_0px_rgba(68,89,68,0.1)]">
            <div v-for="t in 4" :key="t" class="h-10 flex-1 rounded-xl bg-[#445944]/20"></div>
          </div>
          <!-- Tabs Content Card Panel Skeleton -->
          <div
            class="h-[400px] space-y-6 rounded-3xl border-4 border-[#445944]/30 bg-white p-6 shadow-[6px_6px_0px_rgba(68,89,68,0.1)]">
            <div class="flex items-center justify-between border-b-2 border-[#445944]/20 pb-2">
              <div class="h-6 w-1/4 rounded-xl bg-[#445944]/20"></div>
              <div class="h-8 w-24 rounded-full bg-[#445944]/20"></div>
            </div>
            <div class="space-y-4">
              <div
                v-for="item in 2"
                :key="item"
                class="space-y-3 rounded-r-xl border-l-4 border-[#445944]/20 bg-gray-50/50 p-4">
                <div class="flex justify-between">
                  <div class="h-6 w-1/3 rounded-xl bg-[#445944]/20"></div>
                  <div class="h-5 w-16 rounded-lg bg-[#445944]/15"></div>
                </div>
                <div class="h-5 w-1/2 rounded-lg bg-[#445944]/15"></div>
                <div class="h-12 rounded-lg border border-gray-100 bg-white"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="pets.length === 0"
        class="mx-auto w-full rounded-3xl border-4 border-dashed border-[#445944] bg-[#FCF4E5] p-8 py-16 text-center shadow-[6px_6px_0px_#445944]">
        <span class="mb-4 block text-5xl">📖</span>
        <h3 class="mb-2 text-xl font-black text-[#445944]">尚無健康護照紀錄</h3>
        <p class="mb-6 text-sm font-bold text-gray-600">目前還沒有為您的毛孩建立護照紀錄唷！</p>
        <button
          @click="addNewPet"
          class="inline-flex items-center gap-2 rounded-2xl border-2 border-[#445944] bg-[#445944] px-6 py-3 font-bold text-white shadow-[4px_4px_0px_#445944] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#445944]">
          <SquarePlus :size="18" />
          立即建立第一份護照
        </button>
      </div>

      <!-- Main Layout columns -->
      <div v-else class="flex flex-col gap-8 lg:flex-row">
        <!-- Left Side Column: Active Pet Card -->
        <div class="w-full lg:w-1/3">
          <div
            class="sticky top-6 rounded-3xl border-4 border-[#445944] bg-white p-6 shadow-[6px_6px_0px_#445944]">
            <div class="mb-6 flex flex-col items-center text-center" v-if="currentPet">
              <div
                class="relative mb-4 h-32 w-32 overflow-hidden rounded-full border-4 border-[#445944] bg-gray-100 shadow-md">
                <img
                  :src="getImageUrl(currentPet.photo)"
                  @error="handleImageError"
                  class="h-full w-full object-cover" />
              </div>
              <h2 class="flex items-center justify-center gap-2 text-2xl font-black text-[#445944]">
                {{ currentPet.name }}
                <SquarePen
                  @click="goToEditPage(currentPet.id)"
                  class="h-5 w-5 cursor-pointer text-gray-500 transition-colors hover:text-[#9C6D6D]" />
              </h2>
              <p class="mt-1 text-sm font-bold text-gray-500">
                {{ currentPet.age }} ({{
                  currentPet.gender === 1 ? '公' : currentPet.gender === 2 ? '母' : '未知'
                }})
              </p>

              <p
                class="mt-3 rounded-2xl border-2 border-[#445944] bg-[#FAE4AE] px-4 py-1 text-xs font-black text-[#445944] shadow-[2px_2px_0px_#445944]">
                {{ currentPet.isDesex ? '已絕育' : '未絕育' }} · 最新體重 {{ currentPet.weight }} KG
              </p>
            </div>

            <!-- Passport Switch List -->
            <div class="mt-6 border-t-2 border-[#445944] pt-4">
              <h3 class="mb-3 text-center text-sm font-black text-[#445944]">切換護照紀錄</h3>
              <div class="flex flex-wrap justify-center gap-3">
                <div
                  v-for="pet in pets"
                  :key="pet.id"
                  @click="activePetId = pet.id"
                  class="h-12 w-12 cursor-pointer overflow-hidden rounded-full border-2 transition-all duration-300 hover:scale-105 hover:opacity-100"
                  :class="
                    activePetId === pet.id
                      ? 'scale-110 border-4 border-[#445944] opacity-100'
                      : 'border-gray-300 opacity-60'
                  ">
                  <img
                    :src="getImageUrl(pet.photo)"
                    @error="handleImageError"
                    class="h-full w-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side Column: Tab Selector and Content Tab -->
        <div class="w-full lg:w-2/3">
          <!-- Neo-brutalist Tabs Bar -->
          <div
            class="mb-6 flex flex-wrap justify-center gap-2 rounded-2xl border-4 border-[#445944] bg-[#FCF4E5] p-1.5 shadow-[4px_4px_0px_#445944]">
            <button
              v-for="tab in tabs"
              :key="tab"
              @click="activeTab = tab"
              :class="[
                'flex-1 rounded-xl px-4 py-2.5 text-sm font-black transition-all duration-200',
                activeTab === tab
                  ? 'border-2 border-[#445944] bg-[#445944] text-white'
                  : 'border-2 border-transparent text-gray-600 hover:text-[#445944]',
              ]">
              {{ tab }}
            </button>
          </div>

          <!-- Tabs Content Card Panel -->
          <div
            class="min-h-[400px] rounded-3xl border-4 border-[#445944] bg-white p-6 shadow-[6px_6px_0px_#445944]"
            v-if="currentPet">
            <MedicalTab
              v-if="activeTab === '醫療史'"
              :records="currentPet.medicalRecords"
              @add-medical="onAddMedical" />
            <VaccineTab
              v-if="activeTab === '疫苗'"
              :vaccines="currentPet.vaccinations"
              @add-vaccine="onAddVaccine" />
            <div v-if="activeTab === '影像'">
              <ImageTab :passportRecords="[currentPet]" @add-image="onAddImage" />
            </div>
            <WeightTab
              v-if="activeTab === '體重'"
              :records="currentPet.weightRecords"
              @add-weight="onAddWeight" />
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
