<script setup>
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Undo2, MapPin } from 'lucide-vue-next'

const router = useRouter()

// 表單初始資料
const form = reactive({
  lostDate: '',
  city: '',
  district: '',
  address: '',
  hasTag: '0',
  furColor: '',
  features: '',
  contactPhone: '',
  contactEmail: '',
  // 這裡可以預留寵物基本資料，或是讓使用者自行填寫
  petName: '',
  petType: '狗',
})

// 縣市地區資料
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

// 提交表單
const handleSubmit = () => {
  // 1. 這裡未來可以寫 API 傳送到資料庫
  console.log('刊登資料：', form)

  // 2. 模擬成功後的行為：提示使用者並導回首頁
  alert('刊登成功！希望能儘快找到毛孩。')
  router.push('/missing-pet') // 這裡路徑請對應到你的協尋頁面路由
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
      <h1 class="mb-2 text-3xl font-bold text-[#9C6D6D]">刊登遺失啟事</h1>
      <p class="text-gray-500">請提供詳盡的資訊，增加毛孩找回的機會</p>
    </section>

    <div class="mx-auto max-w-3xl px-4">
      <div class="rounded-3xl bg-white p-8 shadow-sm">
        <button @click="closePage" class="absolute right-0 text-gray-400 hover:text-gray-600">
          <Undo2 class="h-6 w-6" />
        </button>
        <form @submit.prevent="handleSubmit" class="space-y-8">
          <div class="space-y-6">
            <div class="flex items-center gap-3 border-b pb-4 text-[#9C6D6D]">
              <h2 class="text-lg font-bold">寵物資訊</h2>
            </div>

            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label class="mb-2 block text-sm font-bold text-gray-500">寵物名稱</label>
                <input
                  v-model="form.petName"
                  type="text"
                  placeholder="例如：阿寶"
                  required
                  class="w-full rounded-xl border-none bg-gray-50 p-3 outline-none focus:ring-2 focus:ring-[#9C6D6D]" />
              </div>
              <div>
                <label class="mb-2 block text-sm font-bold text-gray-500">動物類別</label>
                <select
                  v-model="form.petType"
                  class="w-full rounded-xl border-none bg-gray-50 p-3 outline-none focus:ring-2 focus:ring-[#9C6D6D]">
                  <option value="狗">狗</option>
                  <option value="貓">貓</option>
                  <option value="其他">其他</option>
                </select>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <div class="flex items-center gap-3 border-b pb-4 text-[#9C6D6D]">
              <MapPin />
              <h2 class="text-lg font-bold">遺失詳情</h2>
            </div>

            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label class="mb-2 block text-sm font-bold text-gray-500">遺失日期</label>
                <input
                  v-model="form.lostDate"
                  type="date"
                  required
                  class="w-full rounded-xl border-none bg-gray-50 p-3 outline-none focus:ring-2 focus:ring-[#9C6D6D]" />
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="mb-2 block text-sm font-bold text-gray-500">縣市</label>
                  <select
                    v-model="form.city"
                    required
                    class="w-full rounded-xl border-none bg-gray-50 p-3 outline-none focus:ring-2 focus:ring-[#9C6D6D]">
                    <option value="">請選擇</option>
                    <option v-for="(dists, city) in cityData" :key="city" :value="city">
                      {{ city }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="mb-2 block text-sm font-bold text-gray-500">地區</label>
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
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
