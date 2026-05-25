<script setup>
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Undo2, MapPin, Camera } from 'lucide-vue-next'
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
  photo: ''
})

// 處理寵物照片上傳
const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (file.size > 2 * 1024 * 1024) {
    alert('照片請勿超過 2MB')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    form.photo = e.target.result // Base64 字串
  }
  reader.readAsDataURL(file)
}

const removeImage = () => {
  form.photo = ''
}

// 縣市地區資料
const cityData = {
  台北市: ['中正區', '大同區', '中山區', '松山區', '大安區', '萬華區', '信義區', '士林區', '北投區', '內湖區', '南港區', '文山區'],
  新北市: ['板橋區', '三重區', '中和區', '永和區', '新莊區', '新店區', '土城區', '蘆洲區', '樹林區', '汐止區'],
  桃園市: ['桃園區', '中壢區', '平鎮區', '八德區', '楊梅區', '蘆竹區'],
  台中市: ['中區', '東區', '南區', '西區', '北區', '北屯區', '西屯區', '南屯區', '太平區', '大里區'],
  台南市: ['中西區', '東區', '南區', '北區', '安平區', '安南區', '永康區', '歸仁區'],
  高雄市: ['新興區', '前金區', '苓雅區', '左營區', '楠梓區', '三民區', '鼓山區', '鳳山區'],
  嘉義市: ['東區', '西區'],
}

const availableDistricts = computed(() => cityData[form.city] || [])

// 提交表單
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
      photo: form.photo
    }

    await request.post('/users/missing-pets', payload)
    
    alert('刊登成功！希望能儘快找到毛孩。')
    router.push('/client/pet/missing') // 確保路徑與路由設定一致
  } catch (error) {
    console.error('刊登失敗:', error)
    alert('刊登失敗，請確認欄位格式是否正確或稍後再試。')
  }
}

// 取消並返回
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
  <div class="min-h-screen bg-[#F7F3F1] pb-20">
    <section class="mb-8 bg-white px-6 py-10 text-center shadow-sm">
      <div class="relative flex items-center justify-center">
        <h1 class="mb-2 text-3xl font-bold text-[#9C6D6D]">刊登遺失啟事</h1>
      </div>
      <p class="text-gray-500">請提供詳盡的資訊，增加毛孩找回的機會</p>
    </section>

    <div class="mx-auto max-w-3xl px-4">
      <div class="relative rounded-3xl bg-white p-8 shadow-sm">
        <button @click="closePage" class="absolute top-8 right-8 text-gray-400 hover:text-gray-600">
          <Undo2 class="h-6 w-6" />
        </button>
        <form @submit.prevent="handleSubmit" class="space-y-8">
          
          <!-- 寵物照片上傳 -->
          <div class="flex flex-col items-center justify-center py-4">
            <div class="relative h-32 w-32 overflow-hidden rounded-2xl border-4 border-[#F7F3F1] bg-gray-100 shadow-md">
              <img v-if="form.photo" :src="form.photo" class="h-full w-full object-cover" />
              <div v-else class="flex h-full w-full items-center justify-center bg-gray-50 text-gray-400">
                <Camera class="h-8 w-8" />
              </div>
              <label class="absolute inset-0 flex cursor-pointer flex-col items-center justify-center bg-black/40 text-white opacity-0 transition-opacity hover:opacity-100">
                <span class="text-xs font-bold">上傳相片</span>
                <input type="file" @change="handleImageUpload" class="hidden" accept="image/*" />
              </label>
            </div>
            <button v-if="form.photo" @click="removeImage" type="button" class="mt-2 text-xs text-red-500 hover:underline">
              移除照片
            </button>
            <p class="mt-2 text-xs text-gray-400">建議上傳清楚的全身照片 (限 2MB)</p>
          </div>

          <!-- 寵物資訊 -->
          <div class="space-y-6">
            <div class="flex items-center gap-3 border-b pb-4 text-[#9C6D6D]">
              <h2 class="text-lg font-bold">寵物資訊</h2>
            </div>

            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label class="mb-2 block text-sm font-bold text-gray-500">寵物名稱 <span class="text-red-500">*</span></label>
                <input
                  v-model="form.petName"
                  type="text"
                  placeholder="例如：阿寶"
                  required
                  class="w-full rounded-xl border-none bg-gray-50 p-3 outline-none focus:ring-2 focus:ring-[#9C6D6D]" />
              </div>
              <div>
                <label class="mb-2 block text-sm font-bold text-gray-500">動物類別 <span class="text-red-500">*</span></label>
                <select
                  v-model="form.petType"
                  class="w-full rounded-xl border-none bg-gray-50 p-3 outline-none focus:ring-2 focus:ring-[#9C6D6D]">
                  <option value="狗">狗</option>
                  <option value="貓">貓</option>
                  <option value="其他">其他</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label class="mb-2 block text-sm font-bold text-gray-500">性別</label>
                <select
                  v-model="form.gender"
                  class="w-full rounded-xl border-none bg-gray-50 p-3 outline-none focus:ring-2 focus:ring-[#9C6D6D]">
                  <option value="公">公</option>
                  <option value="母">母</option>
                  <option value="未知">未知</option>
                </select>
              </div>
              <div>
                <label class="mb-2 block text-sm font-bold text-gray-500">毛色</label>
                <input
                  v-model="form.furColor"
                  type="text"
                  placeholder="例如：黃色、橘白"
                  class="w-full rounded-xl border-none bg-gray-50 p-3 outline-none focus:ring-2 focus:ring-[#9C6D6D]" />
              </div>
              <div>
                <label class="mb-2 block text-sm font-bold text-gray-500">晶片號碼</label>
                <input
                  v-model="form.hasTag"
                  type="text"
                  placeholder="如果沒有請填無"
                  class="w-full rounded-xl border-none bg-gray-50 p-3 outline-none focus:ring-2 focus:ring-[#9C6D6D]" />
              </div>
            </div>

            <div>
              <label class="mb-2 block text-sm font-bold text-gray-500">特徵描述</label>
              <textarea
                v-model="form.features"
                rows="3"
                placeholder="請描述毛孩的特徵、個性或穿戴物（例如：左耳有剪耳、穿戴藍色項圈）"
                class="w-full resize-none rounded-xl border-none bg-gray-50 p-3 outline-none focus:ring-2 focus:ring-[#9C6D6D]"></textarea>
            </div>
          </div>

          <!-- 遺失詳情 -->
          <div class="space-y-6">
            <div class="flex items-center gap-3 border-b pb-4 text-[#9C6D6D]">
              <MapPin class="h-5 w-5" />
              <h2 class="text-lg font-bold">遺失詳情</h2>
            </div>

            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label class="mb-2 block text-sm font-bold text-gray-500">遺失日期 <span class="text-red-500">*</span></label>
                <input
                  v-model="form.lostDate"
                  type="date"
                  required
                  class="w-full rounded-xl border-none bg-gray-50 p-3 outline-none focus:ring-2 focus:ring-[#9C6D6D]" />
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="mb-2 block text-sm font-bold text-gray-500">縣市 <span class="text-red-500">*</span></label>
                  <select
                    v-model="form.city"
                    @change="form.district = ''"
                    required
                    class="w-full rounded-xl border-none bg-gray-50 p-3 outline-none focus:ring-2 focus:ring-[#9C6D6D]">
                    <option value="">請選擇</option>
                    <option v-for="(dists, city) in cityData" :key="city" :value="city">
                      {{ city }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="mb-2 block text-sm font-bold text-gray-500">地區 <span class="text-red-500">*</span></label>
                  <select
                    v-model="form.district"
                    :disabled="!form.city"
                    required
                    class="w-full rounded-xl border-none bg-gray-50 p-3 outline-none focus:ring-2 focus:ring-[#9C6D6D] disabled:opacity-50">
                    <option value="">請選擇</option>
                    <option v-for="d in availableDistricts" :key="d" :value="d">{{ d }}</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label class="mb-2 block text-sm font-bold text-gray-500">確切遺失地點 / 街道 <span class="text-red-500">*</span></label>
              <input
                v-model="form.address"
                type="text"
                placeholder="例如：中山路一段123號附近、中央公園內"
                required
                class="w-full rounded-xl border-none bg-gray-50 p-3 outline-none focus:ring-2 focus:ring-[#9C6D6D]" />
            </div>
          </div>

          <!-- 聯絡方式 -->
          <div class="space-y-6">
            <div class="flex items-center gap-3 border-b pb-4 text-[#9C6D6D]">
              <h2 class="text-lg font-bold">聯絡方式</h2>
            </div>

            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label class="mb-2 block text-sm font-bold text-gray-500">聯絡電話 <span class="text-red-500">*</span></label>
                <input
                  v-model="form.contactPhone"
                  type="text"
                  placeholder="例如：0912-345-678"
                  required
                  class="w-full rounded-xl border-none bg-gray-50 p-3 outline-none focus:ring-2 focus:ring-[#9C6D6D]" />
              </div>
              <div>
                <label class="mb-2 block text-sm font-bold text-gray-500">聯絡 E-mail <span class="text-red-500">*</span></label>
                <input
                  v-model="form.contactEmail"
                  type="email"
                  placeholder="例如：owner@example.com"
                  required
                  class="w-full rounded-xl border-none bg-gray-50 p-3 outline-none focus:ring-2 focus:ring-[#9C6D6D]" />
              </div>
            </div>
          </div>

          <div class="flex items-center gap-4 pt-6">
            <button
              type="button"
              @click="handleCancel"
              class="flex-1 rounded-xl border-2 border-gray-200 py-3 font-bold text-gray-500 transition hover:bg-gray-50">
              取消
            </button>
            <button
              type="submit"
              class="flex-1 rounded-xl bg-[#B59891] py-3 font-bold text-white shadow-md transition hover:bg-[#9C6D6D]">
              確認刊登
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
input[type='date']::-webkit-calendar-picker-indicator {
  cursor: pointer;
}
</style>
