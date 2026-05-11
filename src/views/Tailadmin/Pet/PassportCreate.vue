<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import PageBreadcrumb from '@/components/Pawsport/PageBreadcrumb.vue'

const router = useRouter()
const currentPageTitle = ref('新增健康護照')

// 麵包屑導覽
const breadcrumbItems = ref([
  { name: '首頁', route: '/dashboard' },
  { name: '健康護照', route: '/dashboard/passport' },
  { name: '新增紀錄', route: '' }
])

// 1. 初始化表單資料 (整合了 Passport, MedicalDetail, VaccinationHistory)
const form = ref({
  // Passport 基礎資訊
  petId: null,
  name: '',
  weight: null,
  note: '',
  recordType: '',
  createdAt: new Date().toISOString(),

  // MedicalDetail 醫療明細
  medicalDetailId: null, // 通常由後端生成，但 ViewModel 有包含
  treatmentLocation: '',
  disease: '',
  diseaseTreatment: '',
  treatmentTime: '',
  treatmentCreatedAt: new Date().toISOString(),

  // VaccinationHistory 疫苗紀錄
  historyId: null,
  type: '', // 疫苗種類
  vaccinationLocation: '',
  vaccinationTime: '',
  vaccinationCreatedAt: new Date().toISOString()
})

const loading = ref(false)

// 2. 提交表單
const handleSubmit = async () => {
  loading.value = true
  try {
    const response = await axios.post('https://localhost:7048/api/PassPort', form.value)
    
    if (response.data.success === true) {
      alert('健康護照紀錄新增成功！')
      router.push({ name: 'admin-passportlist' })
    } else {
      alert('新增失敗：' + (response.data?.message || '未知錯誤'))
    }
  } catch (error) {
    console.error('提交錯誤:', error)
    alert('系統錯誤，請確認後端 API 接收格式')
  } finally {
    loading.value = false
  }
}

const goBack = () => router.push({ name: 'admin-passportlist' })
</script>

<template>
  <PageBreadcrumb :pageTitle="currentPageTitle" :items="breadcrumbItems" />

  <form @submit.prevent="handleSubmit" class="space-y-6">
    
    <div class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div class="border-b border-gray-200 px-7 py-4 dark:border-gray-800">
        <h3 class="font-bold text-gray-800 dark:text-white/90">📋 護照基礎紀錄</h3>
      </div>
      <div class="p-7 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white/90">寵物 ID (PetId)</label>
          <input v-model.number="form.petId" type="number" class="w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 outline-none focus:border-primary dark:border-gray-700" required />
        </div>
        <div>
          <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white/90">紀錄名稱 (例如：小黑的年度健檢)</label>
          <input v-model="form.name" type="text" class="w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 outline-none focus:border-primary dark:border-gray-700" required />
        </div>
        <div>
          <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white/90">當前體重 (kg)</label>
          <input v-model.number="form.weight" type="number" step="0.1" class="w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 outline-none focus:border-primary dark:border-gray-700" />
        </div>
        <div>
          <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white/90">紀錄類型 (RecordType)</label>
          <select v-model="form.recordType" class="w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 outline-none focus:border-primary dark:border-gray-700">
            <option value="">請選擇類型</option>
            <option value="醫療診斷">醫療診斷</option>
            <option value="疫苗施打">疫苗施打</option>
            <option value="一般健檢">一般健檢</option>
          </select>
        </div>
        <div class="md:col-span-2">
          <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white/90">備註事項 (Note)</label>
          <textarea v-model="form.note" rows="2" class="w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 outline-none focus:border-primary dark:border-gray-700"></textarea>
        </div>
      </div>
    </div>

    <div class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div class="border-b border-gray-200 px-7 py-4 dark:border-gray-800 bg-gray-50/50">
        <h3 class="font-bold text-gray-800 dark:text-white/90">🩺 醫療明細 (Medical Detail)</h3>
      </div>
      <div class="p-7 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white/90">就診醫院/地點</label>
          <input v-model="form.treatmentLocation" type="text" class="w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 outline-none focus:border-primary dark:border-gray-700" />
        </div>
        <div>
          <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white/90">診斷疾病</label>
          <input v-model="form.disease" type="text" class="w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 outline-none focus:border-primary dark:border-gray-700" />
        </div>
        <div class="md:col-span-2">
          <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white/90">治療處置內容</label>
          <input v-model="form.diseaseTreatment" type="text" class="w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 outline-none focus:border-primary dark:border-gray-700" />
        </div>
        <div>
          <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white/90">就診日期時間</label>
          <input v-model="form.treatmentTime" type="datetime-local" class="w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 outline-none focus:border-primary dark:border-gray-700" />
        </div>
      </div>
    </div>

    <div class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div class="border-b border-gray-200 px-7 py-4 dark:border-gray-800 bg-gray-50/50">
        <h3 class="font-bold text-gray-800 dark:text-white/90">💉 疫苗歷史 (Vaccination History)</h3>
      </div>
      <div class="p-7 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white/90">疫苗種類 (Type)</label>
          <input v-model="form.type" type="text" placeholder="例如：狂犬病、五合一" class="w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 outline-none focus:border-primary dark:border-gray-700" />
        </div>
        <div>
          <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white/90">施打地點</label>
          <input v-model="form.vaccinationLocation" type="text" class="w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 outline-none focus:border-primary dark:border-gray-700" />
        </div>
        <div>
          <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white/90">施打日期時間</label>
          <input v-model="form.vaccinationTime" type="datetime-local" class="w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 outline-none focus:border-primary dark:border-gray-700" />
        </div>
      </div>
    </div>

    <div class="flex gap-4 pb-10">
      <button type="submit" :disabled="loading" class="flex justify-center rounded bg-primary px-10 py-3 font-medium text-white hover:bg-opacity-90 disabled:bg-gray-400">
        {{ loading ? '建立中...' : '確認新增護照' }}
      </button>
      <button @click="goBack" type="button" class="flex justify-center rounded border border-gray-300 px-10 py-3 font-medium text-gray-800 hover:bg-gray-50 dark:text-white">
        取消
      </button>
    </div>
  </form>
</template>