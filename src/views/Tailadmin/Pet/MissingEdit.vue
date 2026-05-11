<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import PageBreadcrumb from '@/components/Pawsport/PageBreadcrumb.vue'

const router = useRouter()
const route = useRoute()
const reportId = route.params.id // 從路由取得報告 ID

const currentPageTitle = ref('編輯走失資料')

// 麵包屑
const breadcrumbItems = ref([
  { name: '首頁', route: '/dashboard' },
  { name: '走失列表', route: '/dashboard/missing' },
  { name: '編輯資料', route: '' }
])

// 1. 定義表單結構
const form = ref({
  reportId: null,
  petId: null,
  userId: null,
  name: '', // 雖然 CSHTML 沒寫，但通常 Model 會有名稱
  lastSeenDate: '',
  isActive: true,
  lastSeenLat: null,
  lastSeenLng: null,
  lostLocation: '',
  createdAt: '',
  updatedAt: ''
})

const loading = ref(false)
const fetching = ref(true)

// 2. 日期格式轉換輔助 (ISO 轉 YYYY-MM-DD)
const formatDateForInput = (dateString) => {
  if (!dateString) return ''
  return dateString.split('T')[0]
}

// 3. 取得原始走失資料
const fetchReportData = async () => {
  try {
    const response = await axios.get(`https://localhost:7048/api/MissingReports/${reportId}`)
    const result = response.data

    if (result.success === true) {
      const data = result.data
      // 反填資料
      form.value = {
        ...data,
        lastSeenDate: formatDateForInput(data.lastSeenDate),
        // 若後端有提供 CreatedAt，也一併轉換
        createdAt: data.createdAt, 
        updatedAt: data.updatedAt
      }
    } else {
      alert('找不到該筆走失紀錄')
      goBack()
    }
  } catch (error) {
    console.error('讀取失敗:', error)
    alert('無法讀取資料')
  } finally {
    fetching.value = false
  }
}

// 4. 提交儲存 (PUT)
const handleSubmit = async () => {
  loading.value = true
  try {
    const response = await axios.put(`https://localhost:7048/api/MissingReports/${reportId}`, form.value)
    
    if (response.status === 204 || response.data?.success === true) {
      alert('資料儲存成功！')
      router.push({ name: 'admin-missinglist' })
    } else {
      alert('儲存失敗：' + (response.data?.message || '未知錯誤'))
    }
  } catch (error) {
    console.error('更新失敗:', error)
    alert('系統錯誤，請檢查後端 API')
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push({ name: 'admin-missinglist' })
}

onMounted(fetchReportData)
</script>

<template>
  <PageBreadcrumb :pageTitle="currentPageTitle" :items="breadcrumbItems" />

  <div v-if="fetching" class="flex h-60 items-center justify-center">
    <div class="text-lg font-medium text-gray-500">載入走失資料中...</div>
  </div>

  <div v-else class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
    <div class="border-b border-gray-200 px-7 py-4 dark:border-gray-800">
      <h3 class="font-medium text-gray-800 dark:text-white/90">編輯報告內容 (ID: {{ reportId }})</h3>
    </div>

    <div class="p-7">
      <form @submit.prevent="handleSubmit">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          
          <div>
            <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white/90">寵物 ID</label>
            <input
              v-model.number="form.petId"
              type="number"
              class="w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 outline-none focus:border-primary dark:border-gray-700"
              required
            />
          </div>

          <div>
            <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white/90">申報人 ID</label>
            <input
              v-model.number="form.userId"
              type="number"
              class="w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 outline-none focus:border-primary dark:border-gray-700"
              required
            />
          </div>

          <div>
            <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white/90">最後目擊日期</label>
            <input
              v-model="form.lastSeenDate"
              type="date"
              class="w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 outline-none focus:border-primary dark:border-gray-700"
            />
          </div>

          <div class="flex flex-col justify-center">
            <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white/90">刊登狀態</label>
            <label class="relative inline-flex cursor-pointer items-center mt-2">
              <input type="checkbox" v-model="form.isActive" class="peer sr-only" />
              <div class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700"></div>
              <span class="ml-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                {{ form.isActive ? '尋找中' : '已結案' }}
              </span>
            </label>
          </div>

          <div class="md:col-span-2">
            <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white/90">走失地點描述</label>
            <input
              v-model="form.lostLocation"
              type="text"
              class="w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 outline-none focus:border-primary dark:border-gray-700"
            />
          </div>

          <div>
            <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white/90">緯度 (Lat)</label>
            <input
              v-model.number="form.lastSeenLat"
              type="number"
              step="any"
              class="w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 outline-none focus:border-primary dark:border-gray-700"
            />
          </div>

          <div>
            <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white/90">經度 (Lng)</label>
            <input
              v-model.number="form.lastSeenLng"
              type="number"
              step="any"
              class="w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 outline-none focus:border-primary dark:border-gray-700"
            />
          </div>

          <div>
            <label class="mb-2.5 block text-sm font-medium text-gray-400">建立時間</label>
            <input :value="form.createdAt" type="text" disabled class="w-full bg-transparent px-5 py-3 text-gray-400" />
          </div>

          <div>
            <label class="mb-2.5 block text-sm font-medium text-gray-400">最後更新</label>
            <input :value="form.updatedAt" type="text" disabled class="w-full bg-transparent px-5 py-3 text-gray-400" />
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