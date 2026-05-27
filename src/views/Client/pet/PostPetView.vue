<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Sparkles } from 'lucide-vue-next'
import request from '@/api/axios'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// 1. 表單狀態定義 (完全對齊後端 PetCreateDto)
const form = reactive({
  name: '',
  species: null, // 1: 狗, 2: 貓, 3: 其他
  gender: null, // 1: 公, 2: 母
  size: null, // 1: 小型, 2: 中型, 3: 大型
  coatColor: '',
  birthDate: '', // HTML date input 預設為 YYYY-MM-DD 字串
  isDesex: false,
  isHighMaintenance: false,
  microchip: '',
  behavioralTraits: [], // 前端用陣列存，送出前轉字串
  note: '', // 對應原本的 remark
  photo: '', // 存放 Base64 字串
  agreeTerms: false,
})

// 2. 步驟狀態
const currentStep = ref(1)

// 3. 字數計算
const remarkCount = computed(() => form.note.length)
const maxRemark = 1000

// 4. 圖片處理 (配合企劃書改為單張照片)
const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  // 檢查檔案大小 (建議限制在 2MB 以內，避免 Base64 太長)
  if (file.size > 2 * 1024 * 1024) {
    alert('照片請勿超過 2MB')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    form.photo = e.target.result // 這會是 data:image/jpeg;base64,...
  }
  reader.readAsDataURL(file)
}

const removeImage = () => {
  form.photo = ''
}

// 5. 提交表單
const submitForm = async () => {
  if (!form.agreeTerms) {
    alert('請先勾選同意刊登條款')
    return
  }

  try {
    // 依照企劃書：將行為特徵陣列轉為逗號分隔字串
    const submitData = {
      ...form,
      userId: authStore.userInfo?.userId,
      behavioralTraits: form.behavioralTraits.join(','),
      currentStatus: 1, // 刊登中
    }

    // 串接後端 API (對齊企劃書路徑)
    const response = await request.post('/users/pet/adoption', submitData, {
      withCredentials: true,
    })

    if (response.status === 200) {
      currentStep.value = 2 // 進入等待審核步驟
      window.scrollTo(0, 0)
    }
  } catch (error) {
    console.error('提交失敗:', error)
    alert('提交失敗，請檢查資料格式是否正確')
  }
}

// 行為特徵選項
const traitOptions = [
  { label: '親人', value: 'friendly' },
  { label: '親狗', value: 'dog-friendly' },
  { label: '親貓', value: 'cat-friendly' },
  { label: '活潑', value: 'energetic' },
  { label: '安靜', value: 'quiet' },
  { label: '需特別照護', value: 'special-care' },
]
</script>

<template>
  <div class="page-container min-h-screen bg-[#FCF4E5] text-gray-800 antialiased font-fredoka pb-24">
    
    <!-- HERO SECTION -->
    <header class="hero-container relative overflow-hidden bg-[#FCF4E5] pt-8 pb-12 lg:py-16 text-center">
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

      <div class="relative z-10 mx-auto max-w-4xl px-4 flex flex-col items-center">
        <div
          class="font-fredoka mb-4 inline-flex w-max items-center gap-2 rounded-full bg-[#7a6856] px-4 py-1.5 text-xs font-semibold tracking-wider text-white shadow-sm animate-pulse-slow">
          <Sparkles :size="14" class="animate-spin-slow" />
          POST FOR ADOPTION
        </div>
        <h1 class="mb-4 text-4xl leading-tight font-black text-[#445944] md:text-5xl">
          刊登送養
          <span class="relative z-10 inline-block px-2 text-[#7a6856]">
            尋找新家
            <span
              class="absolute right-0 bottom-1.5 left-0 -z-10 h-3 -rotate-1 transform rounded bg-[#FAE4AE] md:h-4"></span>
          </span>
        </h1>
        <p class="mb-6 max-w-xl text-base font-bold text-gray-600">
          填寫毛孩的詳細資料與故事，讓我們為牠媒合一個溫馨、永遠關懷牠的家。
        </p>
      </div>
    </header>

    <!-- FORM BODY CONTAINER -->
    <div class="container mx-auto  px-4 mt-12">
      <div v-if="currentStep === 1" class="mx-auto w-[80%]">
        <div class="overflow-hidden rounded-3xl border-4 border-[#445944] bg-white shadow-[6px_6px_0px_#445944]">
          
          <div class="bg-[#445944] border-b-4 border-[#445944] px-8 py-5 flex items-center justify-between">
            <h2 class="flex items-center gap-2.5 text-xl font-black text-white">
              <span>📋</span>
              送養資訊填寫
            </h2>
            <span class="text-xs font-black bg-[#FCF4E5] border-2 border-[#445944] text-[#445944] px-3 py-1 rounded-full shadow-[2px_2px_0px_#445944]">
              STEP 1 / 2
            </span>
          </div>

          <form @submit.prevent="submitForm" class="space-y-8 p-6 md:p-8 bg-white">
            
            <!-- Nickname & Coat Color -->
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label class="mb-2 block text-sm font-black text-[#445944]">寵物暱稱/小名 *</label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  placeholder="請輸入毛孩名字"
                  class="w-full rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] px-4 py-3 font-bold text-gray-800 focus:outline-none focus:ring-0 focus:border-[#445944] placeholder-gray-400 shadow-[2px_2px_0px_#445944]" />
              </div>
              
              <div>
                <label class="mb-2 block text-sm font-black text-[#445944]">毛色 *</label>
                <input
                  v-model="form.coatColor"
                  type="text"
                  placeholder="如：橘白、奶油色"
                  required
                  class="w-full rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] px-4 py-3 font-bold text-gray-800 focus:outline-none focus:ring-0 focus:border-[#445944] placeholder-gray-400 shadow-[2px_2px_0px_#445944]" />
              </div>
            </div>

            <!-- Species, Gender, Size Select options -->
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <label class="mb-2 block text-sm font-black text-[#445944]">寵物種類 *</label>
                <select
                  v-model.number="form.species"
                  required
                  class="w-full rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] px-4 py-3 font-bold text-gray-800 focus:outline-none focus:ring-0 focus:border-[#445944] shadow-[2px_2px_0px_#445944] appearance-none">
                  <option :value="null">請選擇</option>
                  <option :value="1">狗</option>
                  <option :value="2">貓</option>
                  <option :value="3">其他</option>
                </select>
              </div>
              
              <div>
                <label class="mb-2 block text-sm font-black text-[#445944]">性別 *</label>
                <select
                  v-model.number="form.gender"
                  required
                  class="w-full rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] px-4 py-3 font-bold text-gray-800 focus:outline-none focus:ring-0 focus:border-[#445944] shadow-[2px_2px_0px_#445944] appearance-none">
                  <option :value="null">請選擇</option>
                  <option :value="1">公</option>
                  <option :value="2">母</option>
                </select>
              </div>
              
              <div>
                <label class="mb-2 block text-sm font-black text-[#445944]">體型 *</label>
                <select
                  v-model.number="form.size"
                  required
                  class="w-full rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] px-4 py-3 font-bold text-gray-800 focus:outline-none focus:ring-0 focus:border-[#445944] shadow-[2px_2px_0px_#445944] appearance-none">
                  <option :value="null">請選擇</option>
                  <option :value="1">小型</option>
                  <option :value="2">中型</option>
                  <option :value="3">大型</option>
                </select>
              </div>
            </div>

            <!-- Estimated Birth & Chip numbers -->
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label class="mb-2 block text-sm font-black text-[#445944]">
                  出生日期 (推估) *
                </label>
                <input
                  v-model="form.birthDate"
                  type="date"
                  required
                  class="w-full rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] px-4 py-3 font-bold text-gray-800 focus:outline-none focus:ring-0 focus:border-[#445944] shadow-[2px_2px_0px_#445944]" />
              </div>
              
              <div>
                <label class="mb-2 block text-sm font-black text-[#445944]">晶片編號 (選填)</label>
                <input
                  v-model="form.microchip"
                  type="text"
                  class="w-full rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] px-4 py-3 font-bold text-gray-800 focus:outline-none focus:ring-0 focus:border-[#445944] placeholder-gray-400 shadow-[2px_2px_0px_#445944]"
                  placeholder="若有植入請填寫" />
              </div>
            </div>

            <!-- Desex & Special care checkboxes -->
            <div class="flex flex-wrap gap-6 bg-[#FCF4E5] p-5 rounded-3xl border-4 border-[#445944] shadow-[4px_4px_0px_#445944]">
              <label class="flex cursor-pointer items-center gap-2.5">
                <input type="checkbox" v-model="form.isDesex" class="rounded border-2 border-[#445944] text-[#445944] focus:ring-0 h-5 w-5 bg-white" />
                <span class="text-sm font-black text-gray-700 select-none">是否已結紮 🩺</span>
              </label>
              
              <label class="flex cursor-pointer items-center gap-2.5">
                <input
                  type="checkbox"
                  v-model="form.isHighMaintenance"
                  class="rounded border-2 border-[#445944] text-[#445944] focus:ring-0 h-5 w-5 bg-white" />
                <span class="text-sm font-black text-gray-700 select-none">需要特別照護 (如：疾病、高齡) ⚠️</span>
              </label>
            </div>

            <!-- Behavioral traits -->
            <div class="bg-[#FDF9F3] p-5 rounded-3xl border-4 border-[#445944] shadow-[4px_4px_0px_#445944]">
              <label class="mb-3 block text-sm font-black text-[#445944]">行為特徵 (可多選) *</label>
              <div class="flex flex-wrap gap-3">
                <label
                  v-for="opt in traitOptions"
                  :key="opt.value"
                  :class="form.behavioralTraits.includes(opt.label) ? 'bg-[#FAE4AE] border-[#445944] shadow-[2px_2px_0px_#445944]' : 'bg-white border-gray-300 shadow-[1px_1px_0px_rgba(0,0,0,0.1)]'"
                  class="flex cursor-pointer items-center gap-2 rounded-xl border-2 px-4 py-2 text-sm font-black text-gray-700 transition-all duration-150 select-none">
                  <input
                    type="checkbox"
                    :value="opt.label"
                    v-model="form.behavioralTraits"
                    class="rounded border-2 border-[#445944] text-[#445944] focus:ring-0 h-4.5 w-4.5 bg-white" />
                  <span>{{ opt.label }}</span>
                </label>
              </div>
            </div>

            <!-- Detailed Notes Story Description -->
            <div>
              <label class="mb-2 block text-sm font-black text-[#445944]">
                詳細說明/個性故事 *
              </label>
              <textarea
                v-model="form.note"
                rows="5"
                required
                class="w-full rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] px-4 py-3 font-bold text-gray-800 focus:outline-none focus:ring-0 focus:border-[#445944] placeholder-gray-400 shadow-[2px_2px_0px_#445944]"
                placeholder="請描述毛孩的故事..."></textarea>
              <p class="mt-2 text-right text-xs font-bold text-gray-500">
                已輸入 {{ remarkCount }} / {{ maxRemark }} 字
              </p>
            </div>

            <!-- Photo Upload Area -->
            <div class="bg-[#FCF4E5] p-5 rounded-3xl border-4 border-[#445944] shadow-[4px_4px_0px_#445944]">
              <label class="mb-2 block text-sm font-black text-[#445944]">寵物照片 (限 1 張) *</label>
              <div class="mt-4 flex justify-center sm:justify-start">
                <div v-if="form.photo" class="relative h-48 w-48 border-4 border-[#445944] rounded-2xl overflow-hidden shadow-[4px_4px_0px_#445944]">
                  <img :src="form.photo" class="h-full w-full object-cover" />
                  <button
                    @click="removeImage"
                    type="button"
                    class="absolute top-2 right-2 h-7 w-7 rounded-xl border-2 border-[#445944] bg-red-500 text-white font-black hover:bg-red-600 shadow-md flex items-center justify-center transition-colors">
                    ✕
                  </button>
                </div>
                
                <label
                  v-else
                  class="flex h-48 w-48 cursor-pointer flex-col items-center justify-center rounded-2xl border-4 border-dashed border-[#445944] bg-white hover:bg-[#FDF9F3] transition-colors shadow-[4px_4px_0px_#445944]">
                  <span class="text-4xl text-[#445944] font-black mb-1">+</span>
                  <span class="text-xs font-black text-gray-500">點擊上傳照片</span>
                  <input
                    type="file"
                    @change="handleImageUpload"
                    class="hidden"
                    required
                    accept="image/*" />
                </label>
              </div>
            </div>

            <!-- Agreement Terms & Confirmation submit button -->
            <div class="border-t-4 border-[#445944] pt-6 mt-8">
              <div class="mb-6 flex items-center gap-2">
                <input
                  v-model="form.agreeTerms"
                  type="checkbox"
                  id="agree"
                  required
                  class="rounded border-2 border-[#445944] text-[#445944] focus:ring-0 h-5 w-5 bg-white" />
                <label for="agree" class="text-sm font-black text-gray-700 cursor-pointer select-none">
                  我已詳閱且同意刊登條款
                </label>
              </div>
              
              <button
                type="submit"
                class="w-full rounded-2xl border-2 border-[#445944] bg-[#445944] py-4 text-lg font-black text-white shadow-[4px_4px_0px_#445944] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#445944]">
                確認刊登送養
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- SUCCESS AUDIT PENDING SCREEN -->
      <div v-else class="mx-auto max-w-2xl w-[90%] rounded-3xl border-4 border-[#445944] bg-white p-12 md:p-20 text-center shadow-[6px_6px_0px_#445944] mt-12 animate-pulse-slow">
        <div class="mb-6 text-7xl">⏳</div>
        <h2 class="mb-4 text-3xl font-black text-[#445944]">資料已送出，審核中</h2>
        <p class="mb-8 text-sm md:text-base font-bold text-gray-600 leading-relaxed bg-[#FCF4E5] p-5 rounded-2xl border-2 border-dashed border-[#445944]">
          我們將在 1-3 個工作天內完成審核，審核結果將會透過電子郵件通知您。非常感謝您對毛孩的關愛與付出！
        </p>
        
        <button
          @click="router.push({ name: 'pet-adoption' })"
          class="rounded-2xl border-2 border-[#445944] bg-[#445944] px-10 py-4 font-black text-white shadow-[4px_4px_0px_#445944] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#445944]">
          返回領養專區
        </button>
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
  animation: pulse-slow 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse-slow {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.96;
    transform: scale(0.99);
  }
}
</style>
