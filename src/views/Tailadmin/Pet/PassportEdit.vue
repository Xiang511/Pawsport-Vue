<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import PageBreadcrumb from '@/components/Pawsport/PageBreadcrumb.vue'

const router = useRouter()
const route = useRoute()
const passportId = route.params.id // 取得路由參數

const currentPageTitle = ref('編輯健康護照')

// 麵包屑項目
const breadcrumbItems = ref([
  { name: '首頁', route: '/dashboard' },
  { name: '健康護照', route: '/dashboard/passport' },
  { name: '編輯紀錄', route: '' }
])

// 1. 定義表單資料結構 (對應 HealthPassport Model)
const form = ref({
  passportId: null,
  weight: null,
  note: '',
  recordType: '',
  updatedAt: new Date().toISOString() // 編輯時預設更新時間
})

const loading = ref(false)
const fetching = ref(true)

// 2. 取得原始資料 (反填)
const fetchPassportData = async () => {
  try {
    const response = await axios.get(`https://localhost:7048/api/PassPort/${passportId}`)
    const result = response.data

    if (result.success === true) {
      const data = result.data
      form.value = {
        passportId: data.passportId,
        weight: data.weight,
        note: data.note,
        recordType: data.recordType,
        updatedAt: new Date().toISOString() 
      }
    } else {
      alert('找不到該筆紀錄')
      goBack()
    }
  } catch (error) {
    console.error('讀取失敗:', error)
    alert('資料讀取失敗')
  } finally {
    fetching.value = false
  }
}

// 3. 提交修改 (PUT)
const handleSubmit = async () => {
  loading.value = true
  try {
    const response = await axios.put(`https://localhost:7048/api/PassPort/${passportId}`, form.value)
    
    // 判斷 204 NoContent 或 200 Success
    if (response.status === 204 || response.data?.success === true) {
      alert('健康護照修改成功！')
      router.push({ name: 'admin-passportlist' })
    } else {
      alert('修改失敗：' + (response.data?.message || '未知錯誤'))
    }
  } catch (error) {
    console.error('更新失敗:', error)
    alert('系統錯誤，請檢查主控台')
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push({ name: 'admin-passportlist' })
}

onMounted(fetchPassportData)
</script>

<template>
  <PageBreadcrumb :pageTitle="currentPageTitle" :items="breadcrumbItems" />

  <div v-if="fetching" class="flex h-60 items-center justify-center">
    <div class="text-lg font-medium text-gray-500">正在讀取護照資料...</div>
  </div>

  <div v-else class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
    <div class="border-b border-gray-200 px-7 py-4 dark:border-gray-800">
      <h3 class="font-medium text-gray-800 dark:text-white/90">修改紀錄資訊 (ID: {{ passportId }})</h3>
    </div>

    <div class="p-7">
      <form @submit.prevent="handleSubmit">
        <div class="grid grid-cols-1 gap-6">
          
          <div>
            <label class="mb-2.5 block text-sm font-medium text-gray-400">護照編號</label>
            <input
              v-model="form.passportId"
              type="text"
              disabled
              class="w-full rounded-lg border border-gray-300 bg-gray-100 px-5 py-3 outline-none dark:border-gray-700 dark:bg-gray-800 text-gray-500"
            />
          </div>

          <div>
            <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white/90">當前體重 (kg)</label>
            <input
              v-model.number="form.weight"
              type="number"
              step="0.1"
              placeholder="請輸入體重"
              class="w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 outline-none focus:border-primary dark:border-gray-700"
            />
          </div>

          <div>
            <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white/90">紀錄類型</label>
            <select 
              v-model="form.recordType"
              class="w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 outline-none focus:border-primary dark:border-gray-700 appearance-none"
            >
              <option value="醫療診斷">醫療診斷</option>
              <option value="疫苗施打">疫苗施打</option>
              <option value="一般健檢">一般健檢</option>
              <option value="其他">其他</option>
            </select>
          </div>

          <div>
            <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white/90">備註事項</label>
            <textarea
              v-model="form.note"
              rows="4"
              placeholder="請輸入詳細備註..."
              class="w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 outline-none focus:border-primary dark:border-gray-700"
            ></textarea>
          </div>

          <div>
            <label class="mb-2.5 block text-sm font-medium text-gray-400">最後更新時間</label>
            <input 
              :value="new Date().toLocaleString()" 
              type="text" 
              disabled 
              class="w-full bg-transparent px-5 py-3 text-gray-400 text-sm" 
            />
          </div>

        </div>

        <div class="mt-8 flex gap-4 border-t border-gray-200 pt-8 dark:border-gray-800">
          <button
            type="submit"
            :disabled="loading"
            class="flex justify-center rounded bg-primary px-10 py-3 font-medium text-white hover:bg-opacity-90 disabled:bg-gray-400"
          >
            {{ loading ? '儲存中...' : '儲存修改' }}
          </button>
          <button
            @click="goBack"
            type="button"
            class="flex justify-center rounded border border-gray-300 px-10 py-3 font-medium text-gray-800 hover:bg-gray-50 dark:text-white dark:border-gray-700"
          >
            取消
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
