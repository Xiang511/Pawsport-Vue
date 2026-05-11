<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import PageBreadcrumb from '@/components/Pawsport/PageBreadcrumb.vue'

const router = useRouter()
const currentPageTitle = ref('領養紀錄一覽')

// 麵包屑：首頁 > 領養紀錄
const breadcrumbItems = ref([
  { name: '首頁', route: '/dashboard' },
  { name: '領養紀錄', route: '' },
])

// --- 狀態定義 ---
const allRecords = ref([]) // 存放 API 回傳的原始資料
const keyword = ref('') // 搜尋關鍵字
const loading = ref(false) // 載入狀態

// --- 分頁狀態 ---
const currentPage = ref(1)
const pageSize = ref(10)

// --- API 請求方法 ---
const fetchRecords = async () => {
  loading.value = true
  try {
    // 請根據你的 API Controller 路由調整路徑
    const response = await axios.get('https://localhost:7048/api/AdoptionRecord', {
      params: { keyword: keyword.value },
    })

    const result = response.data
    if (result.success === true) {
      allRecords.value = result.data || []
      currentPage.value = 1 // 搜尋後回到第一頁
    }
  } catch (error) {
    console.error('取得領養紀錄失敗:', error)
    alert('無法取得資料，請確認後端 API 是否啟動')
  } finally {
    loading.value = false
  }
}

// --- 刪除方法 ---
const deleteRecord = async (id) => {
  if (!confirm('確定要刪除這筆領養紀錄嗎?')) return

  try {
    const response = await axios.delete(`https://localhost:7048/api/AdoptionRecord/${id}`)
    if (response.status === 204 || response.data?.success === true) {
      alert('刪除成功')
      fetchRecords() // 刷新列表
    }
  } catch (error) {
    console.error('刪除失敗:', error)
    alert('刪除失敗')
  }
}

// --- 前端分頁邏輯 ---
const totalPages = computed(() => Math.ceil(allRecords.value.length / pageSize.value))
const paginatedRecords = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return allRecords.value.slice(start, end)
})

// --- 日期格式化工具 (處理 API 回傳的 ISO 字串) ---
const formatDate = (dateString) => {
  if (!dateString) return '---'
  return dateString.split('T')[0]
}

// --- 路由跳轉 ---
const goToCreate = () => router.push({ name: 'admin-adoptcreate' })
const goToEdit = (id) => router.push({ name: 'admin-adoptedit', params: { id } })

onMounted(fetchRecords)
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
          placeholder="搜尋名稱或關鍵字..."
          class="focus:border-primary rounded-lg border border-gray-300 bg-transparent px-4 py-2 outline-none dark:border-gray-700"
          @keyup.enter="fetchRecords" />
        <button
          @click="fetchRecords"
          class="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700">
          查詢
        </button>
      </div>
      <button
        @click="goToCreate"
        class="bg-brand-success-500 hover:bg-brand-success-600 rounded-lg px-6 py-2 font-medium text-white">
        新增領養紀錄
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full table-auto text-left">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr class="border-b dark:border-gray-700">
            <th class="px-4 py-3 font-medium text-gray-700 dark:text-white">ID</th>
            <th class="px-4 py-3 font-medium text-gray-700 dark:text-white">領養人名稱</th>
            <th class="px-4 py-3 font-medium text-gray-700 dark:text-white">寵物ID</th>
            <th class="px-4 py-3 font-medium text-gray-700 dark:text-white">申請日期</th>
            <th class="px-4 py-3 font-medium text-gray-700 dark:text-white">領養日期</th>
            <th class="px-4 py-3 font-medium text-gray-700 dark:text-white">狀態</th>
            <th class="px-4 py-3 text-center font-medium text-gray-700 dark:text-white">操作</th>
          </tr>
        </thead>
        <tbody v-if="!loading">
          <tr
            v-for="item in paginatedRecords"
            :key="item.adoptionId"
            class="border-b hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/[0.02]">
            <td class="px-4 py-4 text-sm">{{ item.adoptionId }}</td>
            <td class="px-4 py-4 text-sm font-medium">{{ item.name }}</td>
            <td class="px-4 py-4 text-sm">{{ item.petId }}</td>
            <td class="px-4 py-4 text-sm">{{ formatDate(item.applyDate) }}</td>
            <td class="px-4 py-4 text-sm">{{ formatDate(item.adoptDate) }}</td>
            <td class="px-4 py-4 text-sm">
              <span
                class="bg-success/10 text-success inline-flex rounded-full px-3 py-1 text-xs font-medium">
                {{ item.status }}
              </span>
            </td>
            <td class="px-4 py-4 text-center text-sm">
              <button
                @click="goToEdit(item.adoptionId)"
                class="text-primary mr-3 font-medium hover:underline">
                編輯
              </button>
              <button
                @click="deleteRecord(item.adoptionId)"
                class="font-medium text-red-500 hover:underline">
                刪除
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="loading" class="py-20 text-center text-gray-500">讀取中...</div>
      <div v-else-if="allRecords.length === 0" class="py-20 text-center text-gray-500">
        尚無領養紀錄
      </div>
    </div>

    <div class="mt-6 flex items-center justify-between">
      <p class="text-sm text-gray-600 dark:text-gray-400">
        顯示第 {{ (currentPage - 1) * pageSize + 1 }} 到
        {{ Math.min(currentPage * pageSize, allRecords.length) }} 筆，共 {{ allRecords.length }} 筆
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
