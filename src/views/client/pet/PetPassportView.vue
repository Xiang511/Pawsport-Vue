<script setup>
import { ref, computed } from 'vue';
import MedicalTab from '@/components/Client/MedicalTab.vue';
import VaccineTab from '@/components/Client/VaccineTab.vue';
import ImageTab from '@/components/Client/ImageTab.vue';
import { useRouter } from 'vue-router'
import { SquarePlus } from 'lucide-vue-next'

const router = useRouter()

// 1. 整合資料：把該寵物的紀錄直接放在 pets 物件裡（模擬 API 回傳的一對多資料）
const pets = ref([
  { 
    id: 101, name: 'Toast', age: '8個月', photo: 'toast.jpg',
    medicalRecords: [
      { medicalDetailId: 1, disease: '腸胃炎', diseaseTreatment: '口服藥物', location: '嘉大醫院', time: '2024-05-10' }
    ],
    vaccinations: [
      { historyId: 1, type: '狂犬病', location: '嘉大醫院', time: '2024-01-15', forecast: '2025-01-15' }
    ]
  },
  { 
    id: 102, name: 'LeeOn', age: '5歲5個月', photo: 'leeon.jpg',
    medicalRecords: [], // 這隻沒資料，測試「尚無紀錄」狀態
    vaccinations: []
  },
  { id: 103, name: 'Duck', age: '2歲', photo: 'duck.jpg', medicalRecords: [], vaccinations: [] }
]);

const activePetId = ref(101);
const activeTab = ref('醫療史');
const tabs = ['醫療史', '疫苗', '影像', '體重'];

// 核心邏輯：當 activePetId 變，currentPet 就變，底下的子組件就會自動重新渲染
const currentPet = computed(() => {
  return pets.value.find(p => p.id === activePetId.value);
});

const addNewPet = () => 
  router.push({ name: 'pet-health-passport-add' })
</script>

<template>
  <div class="max-w-3xl mx-auto py-8 px-4 bg-[#F7F3F1] min-h-screen relative">
    
    <button @click="addNewPet" class="absolute top-8 right-8 w-10 h-10  text-[#9C6D6D] rounded-xl flex items-center justify-center hover:bg-[#9C6D6D] hover:text-white transition shadow-sm">
      <SquarePlus />
    </button>

    <div class="mb-8">
      <div class="flex items-center gap-2 mb-6">
        <span class="bg-white px-4 py-1 rounded-full text-sm shadow-sm text-gray-500 font-bold flex items-center gap-2">
          <i class="fa-solid fa-users"></i> 秉淳的毛孩護照
        </span>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-20 h-20 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200">
            <img :src="currentPet.photo" class="w-full h-full object-cover">
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
              {{ currentPet.name }} {{ currentPet.age }}
              <i class="fa-solid fa-pen text-sm text-gray-400 cursor-pointer"></i>
            </h1>
          </div>
        </div>

        <div class="flex gap-2">
          <div 
            v-for="pet in pets" :key="pet.id" @click="activePetId = pet.id"
            class="w-12 h-12 rounded-full border-2 cursor-pointer transition-all duration-300 overflow-hidden shadow-sm"
            :class="activePetId === pet.id ? 'border-[#9C6D6D] scale-110' : 'border-white opacity-60'"
          >
            <img :src="pet.photo" class="w-full h-full object-cover">
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-center bg-gray-200 rounded-full p-1 mb-6">
      <button 
        v-for="tab in tabs" :key="tab" @click="activeTab = tab"
        :class="[
          'flex-1 py-2 px-4 rounded-full text-sm font-bold transition-all duration-300',
          activeTab === tab ? 'bg-[#9C6D6D] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
        ]"
      >
        {{ tab }}
      </button>
    </div>

    <div class="bg-white rounded-2xl p-6 shadow-sm min-h-[300px]">
      <MedicalTab v-if="activeTab === '醫療史'" :records="currentPet.medicalRecords" />
      <VaccineTab v-if="activeTab === '疫苗'" :vaccines="currentPet.vaccinations" />
      
      <div v-if="activeTab === '影像'" class="text-center text-gray-400 py-10">
        <ImageTab :passportRecords="[]" /> </div>
      
      <div v-if="activeTab === '體重'" class="text-center text-gray-400 py-10">
        (等串API資料)體重紀錄區塊建置中...
      </div>
    </div>

  </div>
</template>