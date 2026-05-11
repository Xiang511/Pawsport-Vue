<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import PageBreadcrumb from '@/components/Pawsport/PageBreadcrumb.vue'

const router = useRouter()
const currentPageTitle = ref('寵物健康護照')

// 麵包屑：首頁 > 寵物健康護照
const breadcrumbItems = ref([
  { name: '首頁', route: '/dashboard' },
  { name: '健康護照', route: '' },
])

// --- 狀態定義 ---
const passports = ref([])
const keyword = ref('')
const loading = ref(false)

// --- 分頁狀態 ---
const currentPage = ref(1)
const pageSize = ref(10)

// --- API 請求 ---
const fetchPassports = async () => {
  loading.value = true
  try {
    const response = await axios.get('https://localhost:7048/api/PassPort', {
      params: { keyword: keyword.value }
    })
    
    if (response.data.success === true) {
      passports.value = response.data.data || []
      currentPage.value = 1
    }
  } catch (error) {
    console.error('取得護照列表失敗:', error)
    alert('讀取資料發生錯誤')
  } finally {
    loading.value = false
  }
}

// --- 刪除方法 ---
const deletePassport = async (id) => {
  if (!confirm('確定要刪除這筆健康護照紀錄嗎？此動作不可撤回。')) return
  
  try {
    const response = await axios.delete(`https://localhost:7048/api/PassPort/${id}`)
    if (response.status === 204 || response.data?.success === true) {
      alert('刪除成功')
      fetchPassports()
    }
  } catch (error) {
    console.error('刪除失敗:', error)
    alert('刪除失敗，該紀錄可能已被引用')
  }
}

// --- 前端分頁邏輯 ---
const totalPages = computed(() => Math.ceil(passports.value.length / pageSize.value))
const paginatedPassports = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return passports.value.slice(start, end)
})

// --- 日期格式化 ---
const formatDate = (dateString) => {
  if (!dateString) return '---'
  return dateString.split('T')[0]
}

// --- 路由跳轉 ---
const goToCreate = () => router.push({ name: 'admin-passportcreate' })
const goToDetails = (id) => router.push({ name: 'admin-passportdetails', params: { id } })
const goToEdit = (id) => router.push({ name: 'admin-passportedit', params: { id } })

onMounted(fetchPassports)
</script>

<template>
  <PageBreadcrumb :pageTitle="currentPageTitle" :items="breadcrumbItems" />

  <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
    <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
      <div class="flex gap-2">
        <input 
          v-model="keyword" 
          type="text" 
          placeholder="搜尋寵物名稱或紀錄類型..."
          class="rounded-lg border border-gray-300 bg-transparent px-4 py-2 outline-none focus:border-primary dark:border-gray-700"
          @keyup.enter="fetchPassports"
        />
        <button @click="fetchPassports" class="rounded-lg bg-primary px-6 py-2 font-medium text-white hover:bg-opacity-90">
          查詢
        </button>
      </div>
      <button @click="goToCreate" class="rounded-lg bg-primary px-6 py-2 font-medium text-white hover:bg-opacity-90">
        新增護照紀錄
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full table-auto text-left">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr class="border-b dark:border-gray-700">
            <th class="px-4 py-3 font-medium text-gray-700 dark:text-white">ID</th>
            <th class="px-4 py-3 font-medium text-gray-700 dark:text-white">寵物資訊</th>
            <th class="px-4 py-3 font-medium text-gray-700 dark:text-white">體重 (kg)</th>
            <th class="px-4 py-3 font-medium text-gray-700 dark:text-white">紀錄類型</th>
            <th class="px-4 py-3 font-medium text-gray-700 dark:text-white">紀錄日期</th>
            <th class="px-4 py-3 text-center font-medium text-gray-700 dark:text-white">操作</th>
          </tr>
        </thead>
        <tbody v-if="!loading">
          <tr v-for="item in paginatedPassports" :key="item.passportId" class="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/[0.02]">
            <td class="px-4 py-4 text-sm">{{ item.passportId }}</td>
            <td class="px-4 py-4">
              <div class="flex flex-col">
                <span class="text-sm font-medium text-gray-800 dark:text-white">{{ item.name }}</span>
                <span class="text-xs text-gray-500">ID: {{ item.petId }}</span>
              </div>
            </td>
            <td class="px-4 py-4 text-sm">{{ item.weight || '---' }}</td>
            <td class="px-4 py-4 text-sm">
              <span class="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-600">
                {{ item.recordType }}
              </span>
            </td>
            <td class="px-4 py-4 text-sm">{{ formatDate(item.recordDate) }}</td>
            <td class="px-4 py-4 text-center text-sm">
              <div class="flex items-center justify-center gap-3">
                <button @click="goToDetails(item.passportId)" class="font-medium text-primary hover:underline">詳情</button>
                <button @click="goToEdit(item.passportId)" class="font-medium text-success hover:underline">編輯</button>
                <button @click="deletePassport(item.passportId)" class="font-medium text-red-500 hover:underline">刪除</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="loading" class="py-20 text-center text-gray-500">讀取中...</div>
      <div v-else-if="passports.length === 0" class="py-20 text-center text-gray-500">尚無護照資料</div>
    </div>

    <div class="mt-6 flex items-center justify-between">
      <p class="text-sm text-gray-600 dark:text-gray-400">
        顯示第 {{ (currentPage - 1) * pageSize + 1 }} 到 {{ Math.min(currentPage * pageSize, passports.length) }} 筆
      </p>
      <div class="flex gap-2">
        <button :disabled="currentPage === 1" @click="currentPage--" class="rounded border border-gray-300 px-4 py-2 text-sm disabled:opacity-30 hover:bg-gray-100 dark:border-gray-700">
          上一頁
        </button>
        <button :disabled="currentPage === totalPages" @click="currentPage++" class="rounded border border-gray-300 px-4 py-2 text-sm disabled:opacity-30 hover:bg-gray-100 dark:border-gray-700">
          下一頁
        </button>
      </div>
    </div>
  </div>
</template>