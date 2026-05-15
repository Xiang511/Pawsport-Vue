<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 1. 表單狀態定義
const form = reactive({
  name: '',
  breed: '',
  kind: '',
  gender: '',
  size: '',
  color: '',
  age: '',
  isLigation: '',
  county: '',
  district: '',
  remark: '',
  contactName: '張秉淳', // 預設會員姓名
  contactPhone: '0932789111',
  contactMethod: '可撥打電話及簡訊聯絡',
  lineId: '',
  requireAgreement: '',
  requireFollowUp: '',
  requireAgeLimit: '',
  requireFamilyConsent: '',
  agreeTerms: false,
  images: [], // 存放預覽圖 URL 或檔案物件
})

// 2. 步驟狀態
const currentStep = ref(1)

// 3. 字數計算
const remarkCount = computed(() => form.remark.length)
const maxRemark = 1000

// 4. 圖片處理 (最多4張)
const handleImageUpload = (event) => {
  const files = Array.from(event.target.files)
  if (form.images.length + files.length > 4) {
    alert('最多只能上傳 4 張照片')
    return
  }

  files.forEach((file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      form.images.push(e.target.result)
    }
    reader.readAsDataURL(file)
  })
}

const removeImage = (index) => {
  form.images.splice(index, 1)
}

// 5. 提交表單
const submitForm = async () => {
  if (!form.agreeTerms) {
    alert('請先勾選同意刊登條款')
    return
  }
  // 這裡串接後端 API
  console.log('提交的資料：', form)
  // 跳轉至等待審核頁面或顯示成功訊息
  currentStep.value = 2
}

// 縣市資料 (簡化版，實際可引用外部 json)
const counties = ['台北市', '新北市', '桃園市', '台中市', '高雄市']
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto max-w-6xl px-4">
      <div class="mb-12 flex justify-center">
        <div class="flex w-full max-w-2xl items-center">
          <div
            :class="[
              'flex-1 border-b-4 py-4 text-center',
              currentStep >= 1
                ? 'border-orange-500 text-orange-600'
                : 'border-gray-200 text-gray-400',
            ]">
            <span class="font-bold">1. 填寫資訊</span>
          </div>
          <div
            :class="[
              'flex-1 border-b-4 py-4 text-center',
              currentStep >= 2
                ? 'border-orange-500 text-orange-600'
                : 'border-gray-200 text-gray-400',
            ]">
            <span class="font-bold">2. 等待審核</span>
          </div>
          <div
            :class="[
              'flex-1 border-b-4 py-4 text-center',
              currentStep >= 3
                ? 'border-orange-500 text-orange-600'
                : 'border-gray-200 text-gray-400',
            ]">
            <span class="font-bold">3. 刊登成功</span>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-8 lg:flex-row">
        <div class="lg:w-2/3">
          <div class="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
            <div class="bg-orange-500 px-8 py-4">
              <h2 class="flex items-center gap-2 text-xl font-bold text-white">📋 送養資訊填寫</h2>
            </div>

            <form @submit.prevent="submitForm" class="space-y-6 p-8">
              <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label class="mb-2 block text-sm font-bold text-gray-700">寵物暱稱/小名 *</label>
                  <input
                    v-model="form.name"
                    type="text"
                    required
                    class="w-full rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500" />
                </div>
                <div>
                  <label class="mb-2 block text-sm font-bold text-gray-700">品種 *</label>
                  <input
                    v-model="form.breed"
                    type="text"
                    placeholder="如：柴犬"
                    required
                    class="w-full rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500" />
                </div>
              </div>

              <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div>
                  <label class="mb-2 block text-sm font-bold text-gray-700">寵物種類 *</label>
                  <select v-model="form.kind" required class="w-full rounded-xl border-gray-200">
                    <option value="">請選擇</option>
                    <option value="貓">貓</option>
                    <option value="狗">狗</option>
                    <option value="其他">其他</option>
                  </select>
                </div>
                <div>
                  <label class="mb-2 block text-sm font-bold text-gray-700">性別 *</label>
                  <select v-model="form.gender" required class="w-full rounded-xl border-gray-200">
                    <option value="">請選擇</option>
                    <option value="公">公</option>
                    <option value="母">母</option>
                  </select>
                </div>
                <div>
                  <label class="mb-2 block text-sm font-bold text-gray-700">體型 *</label>
                  <select v-model="form.size" required class="w-full rounded-xl border-gray-200">
                    <option value="">請選擇</option>
                    <option value="小型">小型</option>
                    <option value="中型">中型</option>
                    <option value="大型">大型</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label class="mb-2 block text-sm font-bold text-gray-700">當前所在地 *</label>
                  <div class="flex gap-2">
                    <select
                      v-model="form.county"
                      required
                      class="flex-1 rounded-xl border-gray-200">
                      <option value="">縣市</option>
                      <option v-for="c in counties" :key="c" :value="c">{{ c }}</option>
                    </select>
                    <input
                      v-model="form.district"
                      type="text"
                      placeholder="行政區"
                      class="flex-1 rounded-xl border-gray-200" />
                  </div>
                </div>
                <div>
                  <label class="mb-2 block text-sm font-bold text-gray-700">是否結紮 *</label>
                  <select
                    v-model="form.isLigation"
                    required
                    class="w-full rounded-xl border-gray-200">
                    <option value="">請選擇</option>
                    <option value="已結紮">已結紮</option>
                    <option value="未結紮">未結紮</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="mb-2 block text-sm font-bold text-gray-700">其他說明 *</label>
                <textarea
                  v-model="form.remark"
                  rows="5"
                  required
                  class="w-full rounded-2xl border-gray-200"
                  placeholder="請描述狗狗的個性、健康狀況..."></textarea>
                <p class="mt-1 text-right text-xs text-gray-400">
                  已輸入 {{ remarkCount }} / {{ maxRemark }} 字
                </p>
              </div>

              <div>
                <label class="mb-2 block text-sm font-bold text-gray-700">
                  照片上傳 (最多 4 張) *
                </label>
                <div class="mt-2 flex flex-wrap gap-4">
                  <div v-for="(img, index) in form.images" :key="index" class="relative h-24 w-24">
                    <img :src="img" class="h-full w-full rounded-xl border object-cover" />
                    <button
                      @click="removeImage(index)"
                      type="button"
                      class="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-center text-xs text-white">
                      ✕
                    </button>
                  </div>
                  <label
                    v-if="form.images.length < 4"
                    class="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 transition hover:bg-gray-50">
                    <span class="text-2xl text-gray-400">+</span>
                    <span class="text-xs text-gray-400">上傳照片</span>
                    <input
                      type="file"
                      @change="handleImageUpload"
                      class="hidden"
                      accept="image/*"
                      multiple />
                  </label>
                </div>
              </div>

              <div class="space-y-4 rounded-2xl bg-gray-50 p-6">
                <h3 class="font-bold text-gray-800">領養要求問卷</h3>
                <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <select
                    v-model="form.requireAgreement"
                    class="rounded-xl border-gray-200 text-sm">
                    <option value="">簽署認養切結書？</option>
                    <option value="yes">需要</option>
                    <option value="no">不需要</option>
                  </select>
                  <select v-model="form.requireFollowUp" class="rounded-xl border-gray-200 text-sm">
                    <option value="">接受後續追蹤？</option>
                    <option value="yes">需要</option>
                    <option value="no">不需要</option>
                  </select>
                </div>
              </div>

              <div class="border-t border-gray-100 pt-6">
                <div class="mb-6 flex items-center gap-2">
                  <input
                    v-model="form.agreeTerms"
                    type="checkbox"
                    id="agree"
                    class="rounded border-gray-300 text-orange-500" />
                  <label for="agree" class="text-sm font-bold text-gray-600">
                    我已詳閱且同意刊登條款
                  </label>
                </div>
                <button
                  type="submit"
                  class="w-full rounded-2xl bg-orange-500 py-4 text-lg font-black text-white shadow-lg transition hover:bg-orange-600">
                  確認送出審核
                </button>
              </div>
            </form>
          </div>
        </div>

        <div class="space-y-6 lg:w-1/3">
          <div class="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
            <h3 class="mb-6 flex items-center gap-2 text-xl font-black text-gray-800">
              <span class="text-2xl text-orange-500">⚠️</span>
              刊登須知
            </h3>
            <div class="space-y-4 text-sm leading-relaxed text-gray-600">
              <p>
                1. 為了保障動物福利，所有刊登資訊均需經過工作人員審核，時間約
                <span class="font-bold text-orange-600">1-3 個工作天</span>
                。
              </p>
              <p>
                2.
                <span class="font-bold text-red-500">嚴禁任何形式的販售行為</span>
                ，包括巧立名目收取營養費、補貼費。
              </p>
              <p>3. 寵物送出後，請務必回到系統更新狀態為「已結案」。</p>
              <p>4. 建議提供清晰且光線充足的照片，能有效提高領養成功率。</p>
            </div>
          </div>

          <div class="rounded-3xl border border-blue-100 bg-blue-50 p-8">
            <p class="text-sm font-medium text-blue-700 italic">
              "每一個生命都值得被溫柔對待，感謝您為毛孩尋找遮風避雨的家。"
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
