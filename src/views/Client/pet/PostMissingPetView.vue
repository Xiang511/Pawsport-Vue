<script setup>
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Undo2, MapPin, Camera, Sparkles } from 'lucide-vue-next'
import request from '@/api/axios'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// 表單初始資料 (對齊 CreateMissingPetDTO)
const form = reactive({
  petName: '',
  petType: '狗',
  gender: '未知',
  lostDate: '',
  city: '',
  district: '',
  address: '',
  hasTag: '',
  furColor: '',
  features: '',
  contactPhone: '',
  contactEmail: '',
  photo: '',
})

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (file.size > 2 * 1024 * 1024) {
    alert('照片請勿超過 2MB')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    form.photo = e.target.result
  }
  reader.readAsDataURL(file)
}

const removeImage = () => {
  form.photo = ''
}

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

const availableDistricts = computed(() => cityData[form.city] || [])

const handleSubmit = async () => {
  try {
    const userId = authStore.userInfo?.userId || authStore.userInfo?.id
    if (!userId) {
      alert('請先登入後再進行操作')
      return
    }

    const payload = {
      userId: userId,
      petName: form.petName,
      petType: form.petType,
      gender: form.gender,
      lostDate: form.lostDate,
      city: form.city,
      district: form.district,
      address: form.address,
      hasTag: form.hasTag,
      furColor: form.furColor,
      features: form.features,
      contactPhone: form.contactPhone,
      contactEmail: form.contactEmail,
      photo: form.photo,
    }

    await request.post('/users/missing-pets', payload)

    alert('刊登成功！希望能儘快找到毛孩。')
    router.push({ name: 'missing-report' })
  } catch (error) {
    console.error('刊登失敗:', error)
    alert('刊登失敗，請確認欄位格式是否正確或稍後再試。')
  }
}

const handleCancel = () => {
  if (confirm('確定要取消刊登嗎？所填寫的資料將不會儲存。')) {
    router.back()
  }
}

const closePage = () => {
  router.back()
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
          POST MISSING REPORT
        </div>
        <h1 class="mb-4 text-4xl leading-tight font-black text-[#445944] md:text-5xl">
          刊登遺失
          <span class="relative z-10 inline-block px-2 text-[#7a6856]">
            協尋啓事
            <span
              class="absolute right-0 bottom-1.5 left-0 -z-10 h-3 -rotate-1 transform rounded bg-[#FAE4AE] md:h-4"></span>
          </span>
        </h1>
        <p class="mb-6 max-w-xl text-base font-bold text-gray-600">
          請提供詳盡的資訊，增加毛孩找回的機會。讓我們為毛孩鋪設一條安全回家的路。
        </p>
      </div>
    </header>

    <!-- FORM BODY CONTAINER -->
    <div class="mx-auto mt-12 w-[60%]">
      <div
        class="relative rounded-3xl border-4 border-[#445944] bg-white p-6 shadow-[6px_6px_0px_#445944] md:p-10">
        <!-- Close page button -->
        <!-- <button
          @click="closePage"
          class="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#445944] bg-[#FCF4E5] font-black text-[#445944] shadow-[2px_2px_0px_#445944] transition hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-[#445944] hover:text-white hover:shadow-[1px_1px_0px_#445944]">
          ✕
        </button> -->

        <form @submit.prevent="handleSubmit" class="space-y-8">
          <!-- 寵物照片上傳 -->
          <div
            class="mb-4 flex flex-col items-center justify-center rounded-3xl border-4 border-[#445944] bg-[#FCF4E5] py-6 shadow-[4px_4px_0px_#445944]">
            <div
              class="relative h-36 w-36 overflow-hidden rounded-2xl border-4 border-[#445944] bg-white shadow-md">
              <img v-if="form.photo" :src="form.photo" class="h-full w-full object-cover" />
              <div
                v-else
                class="flex h-full w-full items-center justify-center bg-white text-gray-400">
                <Camera class="h-8 w-8 text-[#445944]" />
              </div>
              <label
                class="absolute inset-0 flex cursor-pointer flex-col items-center justify-center bg-black/40 text-white opacity-0 transition-opacity hover:opacity-100">
                <span class="text-xs font-black">上傳照片</span>
                <input type="file" @change="handleImageUpload" class="hidden" accept="image/*" />
              </label>
            </div>

            <button
              v-if="form.photo"
              @click="removeImage"
              type="button"
              class="mt-3 rounded-xl border-2 border-[#445944] bg-red-500 px-3 py-1 text-xs font-black text-white shadow-[2px_2px_0px_#445944] transition-colors hover:bg-red-600">
              移除照片 ✕
            </button>

            <p class="mt-3 text-xs font-bold text-gray-500">建議上傳清楚的全身照片 (限 2MB)</p>
          </div>

          <!-- 寵物資訊 -->
          <div class="space-y-6">
            <div class="flex items-center gap-3 border-b-4 border-[#445944] pb-4 text-[#445944]">
              <span class="text-xl">🐶</span>
              <h2 class="text-lg font-black">寵物基本資料</h2>
            </div>

            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label class="mb-2 block text-sm font-black text-gray-600">
                  寵物名稱
                  <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.petName"
                  type="text"
                  placeholder="例如：阿寶"
                  required
                  class="w-full rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] px-4 py-3 font-bold text-gray-800 placeholder-gray-400 shadow-[2px_2px_0px_#445944] focus:border-[#445944] focus:ring-0 focus:outline-none" />
              </div>

              <div>
                <label class="mb-2 block text-sm font-black text-gray-600">
                  動物類別
                  <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="form.petType"
                  class="w-full appearance-none rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] px-4 py-3 font-bold text-gray-800 shadow-[2px_2px_0px_#445944] focus:border-[#445944] focus:ring-0 focus:outline-none">
                  <option value="狗">狗</option>
                  <option value="貓">貓</option>
                  <option value="其他">其他</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div>
                <label class="mb-2 block text-sm font-black text-gray-600">性別</label>
                <select
                  v-model="form.gender"
                  class="w-full appearance-none rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] px-4 py-3 font-bold text-gray-800 shadow-[2px_2px_0px_#445944] focus:border-[#445944] focus:ring-0 focus:outline-none">
                  <option value="公">公</option>
                  <option value="母">母</option>
                  <option value="未知">未知</option>
                </select>
              </div>

              <div>
                <label class="mb-2 block text-sm font-black text-gray-600">毛色</label>
                <input
                  v-model="form.furColor"
                  type="text"
                  placeholder="例如：黃色、橘白"
                  class="w-full rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] px-4 py-3 font-bold text-gray-800 placeholder-gray-400 shadow-[2px_2px_0px_#445944] focus:border-[#445944] focus:ring-0 focus:outline-none" />
              </div>

              <div>
                <label class="mb-2 block text-sm font-black text-gray-600">晶片號碼</label>
                <input
                  v-model="form.hasTag"
                  type="text"
                  placeholder="如果沒有請填無"
                  class="w-full rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] px-4 py-3 font-bold text-gray-800 placeholder-gray-400 shadow-[2px_2px_0px_#445944] focus:border-[#445944] focus:ring-0 focus:outline-none" />
              </div>
            </div>

            <div>
              <label class="mb-2 block text-sm font-black text-gray-600">特徵描述</label>
              <textarea
                v-model="form.features"
                rows="3"
                placeholder="請描述毛孩的特徵、個性或穿戴物（例如：左耳有剪耳、穿戴藍色項圈）"
                class="w-full resize-none rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] px-4 py-3 font-bold text-gray-800 placeholder-gray-400 shadow-[2px_2px_0px_#445944] focus:border-[#445944] focus:ring-0 focus:outline-none"></textarea>
            </div>
          </div>

          <!-- 遺失詳情 -->
          <div class="space-y-6">
            <div class="flex items-center gap-3 border-b-4 border-[#445944] pb-4 text-[#445944]">
              <MapPin class="h-5 w-5" />
              <h2 class="text-lg font-black">遺失詳情資訊</h2>
            </div>

            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label class="mb-2 block text-sm font-black text-gray-600">
                  遺失日期
                  <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.lostDate"
                  type="date"
                  required
                  class="w-full rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] px-4 py-3 font-bold text-gray-800 shadow-[2px_2px_0px_#445944] focus:border-[#445944] focus:ring-0 focus:outline-none" />
              </div>

              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="mb-2 block text-sm font-black text-gray-600">
                    縣市
                    <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="form.city"
                    @change="form.district = ''"
                    required
                    class="w-full appearance-none rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] px-4 py-3 font-bold text-gray-800 shadow-[2px_2px_0px_#445944] focus:border-[#445944] focus:ring-0 focus:outline-none">
                    <option value="">請選擇</option>
                    <option v-for="(dists, city) in cityData" :key="city" :value="city">
                      {{ city }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="mb-2 block text-sm font-black text-gray-600">
                    地區
                    <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="form.district"
                    :disabled="!form.city"
                    required
                    class="w-full appearance-none rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] px-4 py-3 font-bold text-gray-800 shadow-[2px_2px_0px_#445944] focus:border-[#445944] focus:ring-0 focus:outline-none disabled:opacity-50">
                    <option value="">請選擇</option>
                    <option v-for="d in availableDistricts" :key="d" :value="d">{{ d }}</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label class="mb-2 block text-sm font-black text-gray-600">
                確切遺失地點 / 街道
                <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.address"
                type="text"
                placeholder="例如：中山路一段123號附近、中央公園內"
                required
                class="w-full rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] px-4 py-3 font-bold text-gray-800 placeholder-gray-400 shadow-[2px_2px_0px_#445944] focus:border-[#445944] focus:ring-0 focus:outline-none" />
            </div>
          </div>

          <!-- 聯絡方式 -->
          <div class="space-y-6">
            <div class="flex items-center gap-3 border-b-4 border-[#445944] pb-4 text-[#445944]">
              <span class="text-xl">📞</span>
              <h2 class="text-lg font-black">聯絡人方式</h2>
            </div>

            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label class="mb-2 block text-sm font-black text-gray-600">
                  聯絡電話
                  <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.contactPhone"
                  type="text"
                  placeholder="例如：0912-345-678"
                  required
                  class="w-full rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] px-4 py-3 font-bold text-gray-800 placeholder-gray-400 shadow-[2px_2px_0px_#445944] focus:border-[#445944] focus:ring-0 focus:outline-none" />
              </div>

              <div>
                <label class="mb-2 block text-sm font-black text-gray-600">
                  聯絡 E-mail
                  <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.contactEmail"
                  type="email"
                  placeholder="例如：owner@example.com"
                  required
                  class="w-full rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] px-4 py-3 font-bold text-gray-800 placeholder-gray-400 shadow-[2px_2px_0px_#445944] focus:border-[#445944] focus:ring-0 focus:outline-none" />
              </div>
            </div>
          </div>

          <!-- Action buttons cancel / confirmation -->
          <div class="flex flex-col items-center gap-4 pt-6 sm:flex-row">
            <button
              type="button"
              @click="handleCancel"
              class="w-full rounded-2xl border-2 border-[#445944] bg-white py-4 font-black text-[#445944] shadow-[4px_4px_0px_#445944] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#445944] sm:flex-1">
              取消
            </button>

            <button
              type="submit"
              class="w-full rounded-2xl border-2 border-[#445944] bg-[#445944] py-4 font-black text-white shadow-[4px_4px_0px_#445944] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#445944] sm:flex-1">
              確認刊登
            </button>
          </div>
        </form>
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

input[type='date']::-webkit-calendar-picker-indicator {
  cursor: pointer;
}
</style>
