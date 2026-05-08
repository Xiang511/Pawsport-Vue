<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
// 1. 引入 axios
import axios from 'axios'
import PageBreadcrumb from '@/components/Pawsport/PageBreadcrumb.vue'

// --- 狀態定義 ---
const currentPageTitle = ref('寵物資料一覽表')
const breadcrumbItems = ref([
  { name: '首頁', route: '/dashboard' },
  { name: '寵物資料一覽表', route: '' }, // 當前頁面不需路由
])
const allPets = ref([]) // 存放 API 回傳的原始資料
const keyword = ref('') // 搜尋關鍵字
const loading = ref(false) // 載入狀態控制

// --- 分頁狀態 ---
const currentPage = ref(1)
const pageSize = ref(10)

const router = useRouter()

// --- API 請求方法 ---
const fetchPets = async () => {
  loading.value = true
  try {
    // Axios 自動處理 JSON 轉換，且支援 params 參數寫法
    // 假設你的 API 基礎路徑在專案中已設定好，或使用完整路徑
    const response = await axios.get('https://localhost:7048/api/Pet', {
      params: { keyword: keyword.value },
    })

    // ⚠️ 注意：Axios 會將 API 回傳內容包在 response.data 中
    // 你的 Success 格式就在 response.data 裡面
    const result = response.data // 這是你的 { data, message, status }

    if (result.success == true) {
      allPets.value = result.data || []
      currentPage.value = 1
    }
  } catch (error) {
    // Axios 會自動攔截 4xx/5xx 錯誤，進到這裡
    console.error('取得資料失敗:', error.response?.data?.message || error.message)
    alert('無法取得資料，請稍後再試')
  } finally {
    loading.value = false
  }
}

// --- 刪除方法 ---
const deletePet = async (id) => {
  if (!confirm('確定要刪除嗎?')) return

  try {
    const response = await axios.delete(`https://localhost:7048/api/Pet/${id}`)
    // 你的後端回傳 NoContent (204)，Axios 會判定為成功
    if (response.status === 204 || response.data.status === 200) {
      alert('刪除成功')
      fetchPets() // 刷新列表
    }
  } catch (error) {
    console.error('刪除失敗:', error)
    alert('刪除失敗')
  }
}

// --- 前端分頁邏輯 ---
const totalPages = computed(() => Math.ceil(allPets.value.length / pageSize.value))
const paginatedPets = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return allPets.value.slice(start, end)
})

// --- 路由跳轉 ---
const goToCreate = () => router.push({ name: 'admin-petcreate' })
const goToEdit = (id) => router.push({ name: 'admin-petedit', params: { id } })

onMounted(fetchPets)
</script>

<template>
  <PageBreadcrumb :pageTitle="currentPageTitle" :items="breadcrumbItems" />

  <div
    class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
    <div class="mb-5 flex items-center justify-between">
      <div class="flex gap-2">
        <input
          v-model="keyword"
          type="text"
          placeholder="搜尋名稱..."
          class="rounded border border-gray-300 px-3 py-2 dark:bg-gray-900"
          @keyup.enter="fetchPets" />
        <button
          @click="fetchPets"
          class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          查詢
        </button>
      </div>
      <button
        @click="goToCreate"
        class="rounded border border-gray-200 bg-green-600 px-4 py-2 text-white">
        建立新資料
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th class="px-4 py-3">ID</th>
            <th class="px-4 py-3">寵物名稱</th>
            <th class="px-4 py-3">花色</th>
            <th class="px-4 py-3">狀態</th>
            <th class="px-4 py-3 text-center">操作</th>
          </tr>
        </thead>
        <tbody v-if="!loading">
          <tr v-for="item in paginatedPets" :key="item.petId" class="border-b dark:border-gray-800">
            <td class="px-4 py-3">{{ item.petId }}</td>
            <td class="px-4 py-3">{{ item.name }}</td>
            <td class="px-4 py-3">{{ item.coatColor }}</td>
            <td class="px-4 py-3">{{ item.currentStatus }}</td>
            <td class="px-4 py-3 text-center">
              <button @click="goToEdit(item.petId)" class="mr-3 text-green-600">編輯</button>
              <button @click="deletePet(item.petId)" class="text-red-600">刪除</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="loading" class="py-10 text-center">載入中...</div>
    </div>

    <div class="mt-4 flex items-center justify-between text-sm">
      <span>共 {{ allPets.length }} 筆資料</span>
      <div class="flex gap-2">
        <button
          :disabled="currentPage === 1"
          @click="currentPage--"
          class="border px-2 py-1 disabled:opacity-20">
          上一頁
        </button>
        <span>{{ currentPage }} / {{ totalPages }}</span>
        <button
          :disabled="currentPage === totalPages"
          @click="currentPage++"
          class="border px-2 py-1 disabled:opacity-20">
          下一頁
        </button>
      </div>
    </div>
  </div>
</template>
