<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import PageBreadcrumb from '@/components/Pawsport/PageBreadcrumb.vue'
import { EditIcon, Trash2, FileText } from 'lucide-vue-next'

const router = useRouter()
const currentPageTitle = ref('走失列表')

// 麵包屑
const breadcrumbItems = ref([
  { name: '首頁', route: '/dashboard' },
  { name: '走失列表', route: '' },
])

// --- 狀態定義 ---
const allReports = ref([]) // 原始資料
const keyword = ref('') // 搜尋關鍵字
const loading = ref(false) // 載入狀態

// --- 分頁狀態 ---
const currentPage = ref(1)
const pageSize = ref(10)

// --- API 請求方法 ---
const fetchReports = async () => {
  loading.value = true
  try {
    // 假設後端 API 為 /api/MissingReports
    const response = await axios.get('https://localhost:7048/api/MissingReports', {
      params: { keyword: keyword.value },
    })

    const result = response.data
    if (result.success === true) {
      allReports.value = result.data || []
      currentPage.value = 1
    }
  } catch (error) {
    console.error('取得走失列表失敗:', error)
    alert('無法取得資料')
  } finally {
    loading.value = false
  }
}

// --- 刪除方法 ---
const deleteReport = async (id) => {
  if (!confirm('確定要刪除這筆走失報告嗎?')) return

  try {
    const response = await axios.delete(`https://localhost:7048/api/MissingReports/${id}`)
    if (response.status === 204 || response.data?.success === true) {
      alert('刪除成功')
      fetchReports()
    }
  } catch (error) {
    console.error('刪除失敗:', error)
    alert('刪除失敗')
  }
}

// --- 前端分頁與序號計算 ---
const totalPages = computed(() => Math.ceil(allReports.value.length / pageSize.value))
const paginatedReports = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return allReports.value.slice(start, end)
})

// --- 日期格式化 ---
const formatDate = (dateString) => {
  if (!dateString) return '---'
  return dateString.split('T')[0]
}

// --- 跳轉 ---
const goToCreate = () => router.push({ name: 'admin-missingcreate' })
const goToEdit = (id) => router.push({ name: 'admin-missingedit', params: { id } })

onMounted(fetchReports)
</script>

<template>
  <PageBreadcrumb :pageTitle="currentPageTitle" :items="breadcrumbItems" />

  <div
    class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
    <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
      <div class="flex gap-2">
        <input
          v-model="keyword"
          type="text"
          placeholder="搜尋名稱或地點..."
          class="focus:border-primary rounded-lg border border-gray-300 bg-transparent px-4 py-2 outline-none dark:border-gray-700"
          @keyup.enter="fetchReports" />
        <button
          @click="fetchReports"
          class="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700">
          查詢
        </button>
      </div>
      <button
        @click="goToCreate"
        class="bg-brand-success-500 hover:bg-brand-success-600 rounded-lg px-6 py-2 font-medium text-white">
        新增走失資料
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full table-auto text-left">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr class="border-b dark:border-gray-700">
            <th class="px-4 py-3 font-medium text-gray-700 dark:text-white">序</th>
            <th class="px-4 py-3 font-medium text-gray-700 dark:text-white">寵物名稱</th>
            <th class="px-4 py-3 font-medium text-gray-700 dark:text-white">走失日期</th>
            <th class="px-4 py-3 font-medium text-gray-700 dark:text-white">地點</th>
            <th class="px-4 py-3 font-medium text-gray-700 dark:text-white">座標 (Lat, Lng)</th>
            <th class="px-4 py-3 font-medium text-gray-700 dark:text-white">狀態</th>
            <th class="px-4 py-3 text-center font-medium text-gray-700 dark:text-white">操作</th>
          </tr>
        </thead>
        <tbody v-if="!loading">
          <tr
            v-for="(item, index) in paginatedReports"
            :key="item.reportId"
            class="border-b hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/[0.02]">
            <td class="px-4 py-4 text-sm">
              {{ (currentPage - 1) * pageSize + index + 1 }}
            </td>
            <td class="px-4 py-4 text-sm font-medium text-gray-800 dark:text-white">
              {{ item.name }} (ID: {{ item.petId }})
            </td>
            <td class="px-4 py-4 text-sm">{{ formatDate(item.lastSeenDate) }}</td>
            <td class="px-4 py-4 text-sm">{{ item.lostLocation }}</td>
            <td class="px-4 py-4 text-xs text-gray-500">
              {{ item.lastSeenLat?.toFixed(4) }}, {{ item.lastSeenLng?.toFixed(4) }}
            </td>
            <td class="px-4 py-4 text-sm">
              <span
                :class="item.isActive ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'"
                class="rounded-full px-3 py-1 text-xs font-medium">
                {{ item.isActive ? '尋找中' : '已結案' }}
              </span>
            </td>
            <td class="px-4 py-4 text-center text-sm">
              <div class="flex items-center justify-center gap-2">
                <button
                  @click="goToEdit(item.reportId)"
                  class="bg-brand-success-500 text-theme-xl hover:bg-brand-success-600 shadow-theme-sm inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-white transition-all active:scale-95">
                  <EditIcon />
                </button>
                <button
                  @click="deleteReport(item.reportId)"
                  class="bg-brand-error-500 text-theme-xl hover:bg-brand-error-600 shadow-theme-sm inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-white transition-all active:scale-95">
                  <Trash2 />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="loading" class="py-20 text-center text-gray-500">讀取中...</div>
      <div v-else-if="allReports.length === 0" class="py-20 text-center text-gray-500">
        尚無走失紀錄
      </div>
    </div>

    <div class="mt-6 flex items-center justify-between">
      <p class="text-sm text-gray-600 dark:text-gray-400">
        顯示第 {{ (currentPage - 1) * pageSize + 1 }} 到
        {{ Math.min(currentPage * pageSize, allReports.length) }} 筆
      </p>
      <div class="flex gap-2">
        <button
          :disabled="currentPage === 1"
          @click="currentPage--"
          class="rounded border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100 disabled:opacity-30 dark:border-gray-700">
          上一頁
        </button>
        <button
          :disabled="currentPage === totalPages"
          @click="currentPage++"
          class="rounded border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100 disabled:opacity-30 dark:border-gray-700">
          下一頁
        </button>
      </div>
    </div>
  </div>
</template>
