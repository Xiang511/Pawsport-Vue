<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import request from '@/api/axios'

const router = useRouter()

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
  <div class="min-h-screen bg-[#F7F3F1] py-12">
    <div class="container mx-auto max-w-6xl px-4">
      <div v-if="currentStep === 1" class="flex flex-col gap-8 lg:flex-row">
        <div class="lg:w-2/3">
          <div class="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
            <div class="bg-[#9C6D6D] px-8 py-4">
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
                    class="w-full rounded-xl border-gray-200" />
                </div>
                <div>
                  <label class="mb-2 block text-sm font-bold text-gray-700">毛色 *</label>
                  <input
                    v-model="form.coatColor"
                    type="text"
                    placeholder="如：橘白、奶油色"
                    required
                    class="w-full rounded-xl border-gray-200" />
                </div>
              </div>

              <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div>
                  <label class="mb-2 block text-sm font-bold text-gray-700">寵物種類 *</label>
                  <select
                    v-model.number="form.species"
                    required
                    class="w-full rounded-xl border-gray-200">
                    <option :value="null">請選擇</option>
                    <option :value="1">狗</option>
                    <option :value="2">貓</option>
                    <option :value="3">其他</option>
                  </select>
                </div>
                <div>
                  <label class="mb-2 block text-sm font-bold text-gray-700">性別 *</label>
                  <select
                    v-model.number="form.gender"
                    required
                    class="w-full rounded-xl border-gray-200">
                    <option :value="null">請選擇</option>
                    <option :value="1">公</option>
                    <option :value="2">母</option>
                  </select>
                </div>
                <div>
                  <label class="mb-2 block text-sm font-bold text-gray-700">體型 *</label>
                  <select
                    v-model.number="form.size"
                    required
                    class="w-full rounded-xl border-gray-200">
                    <option :value="null">請選擇</option>
                    <option :value="1">小型</option>
                    <option :value="2">中型</option>
                    <option :value="3">大型</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label class="mb-2 block text-sm font-bold text-gray-700">
                    出生日期 (推估) *
                  </label>
                  <input
                    v-model="form.birthDate"
                    type="date"
                    required
                    class="w-full rounded-xl border-gray-200" />
                </div>
                <div>
                  <label class="mb-2 block text-sm font-bold text-gray-700">晶片編號 (選填)</label>
                  <input
                    v-model="form.microchip"
                    type="text"
                    class="w-full rounded-xl border-gray-200"
                    placeholder="若有植入請填寫" />
                </div>
              </div>

              <div class="flex flex-wrap gap-6">
                <label class="flex cursor-pointer items-center gap-2">
                  <input type="checkbox" v-model="form.isDesex" class="rounded text-[#9C6D6D]" />
                  <span class="text-sm font-bold text-gray-700">是否已結紮</span>
                </label>
                <label class="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    v-model="form.isHighMaintenance"
                    class="rounded text-[#9C6D6D]" />
                  <span class="text-sm font-bold text-gray-700">需要特別照護 (如：疾病、高齡)</span>
                </label>
              </div>

              <div>
                <label class="mb-2 block text-sm font-bold text-gray-700">
                  行為特徵 (可多選) *
                </label>
                <div class="flex flex-wrap gap-4">
                  <label
                    v-for="opt in traitOptions"
                    :key="opt.value"
                    class="flex cursor-pointer items-center gap-1">
                    <input
                      type="checkbox"
                      :value="opt.label"
                      v-model="form.behavioralTraits"
                      class="rounded text-[#9C6D6D]" />
                    <span class="text-sm text-gray-600">{{ opt.label }}</span>
                  </label>
                </div>
              </div>

              <div>
                <label class="mb-2 block text-sm font-bold text-gray-700">
                  詳細說明/個性故事 *
                </label>
                <textarea
                  v-model="form.note"
                  rows="5"
                  required
                  class="w-full rounded-2xl border-gray-200"
                  placeholder="請描述毛孩的故事..."></textarea>
                <p class="mt-1 text-right text-xs text-gray-400">
                  已輸入 {{ remarkCount }} / {{ maxRemark }} 字
                </p>
              </div>

              <div>
                <label class="mb-2 block text-sm font-bold text-gray-700">
                  寵物照片 (限 1 張) *
                </label>
                <div class="mt-2">
                  <div v-if="form.photo" class="relative h-48 w-48">
                    <img :src="form.photo" class="h-full w-full rounded-xl border object-cover" />
                    <button
                      @click="removeImage"
                      type="button"
                      class="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white">
                      ✕
                    </button>
                  </div>
                  <label
                    v-else
                    class="flex h-48 w-48 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 hover:bg-gray-50">
                    <span class="text-3xl text-gray-400">+</span>
                    <span class="text-sm text-gray-400">點擊上傳</span>
                    <input
                      type="file"
                      @change="handleImageUpload"
                      class="hidden"
                      accept="image/*" />
                  </label>
                </div>
              </div>

              <div class="border-t border-gray-100 pt-6">
                <div class="mb-6 flex items-center gap-2">
                  <input
                    v-model="form.agreeTerms"
                    type="checkbox"
                    id="agree"
                    required
                    class="rounded border-gray-300 text-[#9C6D6D]" />
                  <label for="agree" class="text-sm font-bold text-gray-600">
                    我已詳閱且同意刊登條款
                  </label>
                </div>
                <button
                  type="submit"
                  class="w-full rounded-2xl bg-[#9C6D6D] py-4 text-lg font-black text-white shadow-lg transition hover:bg-[#855a5a]">
                  確認刊登送養
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div v-else class="rounded-3xl bg-white p-20 text-center shadow-sm">
        <div class="mb-6 text-6xl">⏳</div>
        <h2 class="mb-4 text-2xl font-bold text-gray-800">資料已送出，審核中</h2>
        <p class="mb-8 text-gray-500">我們將在 1-3 個工作天內完成審核，屆時會透過信箱通知您。</p>
        <button
          @click="router.push('/adopt')"
          class="rounded-xl bg-[#9C6D6D] px-8 py-3 font-bold text-white">
          返回領養專區
        </button>
      </div>
    </div>
  </div>
</template>
