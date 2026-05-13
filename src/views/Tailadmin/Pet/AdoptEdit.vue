<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import PageBreadcrumb from '@/components/Pawsport/PageBreadcrumb.vue'

const router = useRouter()
const route = useRoute()
const adoptionId = route.params.id // 取得網址上的 ID

const currentPageTitle = ref('修改領養紀錄')

// 麵包屑項目
const breadcrumbItems = ref([
  { name: '首頁', route: '/dashboard' },
  { name: '領養紀錄', route: '/dashboard/adoption' },
  { name: '資料修改', route: '' }
])

// 1. 定義表單資料結構
const form = ref({
  adoptionId: null,
  petId: null,
  userId: null,
  applyDate: '',
  adoptDate: '',
  returnDate: '',
  returnReason: '',
  status: '',
  followUpDeadline: '',
})

const loading = ref(false)
const fetching = ref(true) // 控制載入中狀態

// 2. 輔助函式：處理日期格式 (將 ISO 轉為 YYYY-MM-DD)
const formatDateForInput = (dateString) => {
  if (!dateString) return ''
  return dateString.split('T')[0]
}

// 3. 取得原始領養紀錄資料
const fetchAdoptionData = async () => {
  try {
    const response = await axios.get(`https://localhost:7048/api/AdoptionRecord/${adoptionId}`)
    const result = response.data

    if (result.success === true) {
      const data = result.data
      // 反填資料並格式化日期
      form.value = {
        ...data,
        applyDate: formatDateForInput(data.applyDate),
        adoptDate: formatDateForInput(data.adoptDate),
        returnDate: formatDateForInput(data.returnDate),
        followUpDeadline: formatDateForInput(data.followUpDeadline)
      }
    } else {
      alert('找不到該筆紀錄')
      goBack()
    }
  } catch (error) {
    console.error('取得資料失敗:', error)
    alert('讀取資料失敗')
  } finally {
    fetching.value = false
  }
}

// 4. 提交修改 (PUT)
const handleSubmit = async () => {
  loading.value = true
  try {
    const response = await axios.put(`https://localhost:7048/api/AdoptionRecord/${adoptionId}`, form.value)
    
    if (response.status === 204 || response.data?.success === true) {
      alert('修改成功！')
      router.push({ name: 'admin-adoptlist' })
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
  router.push({ name: 'admin-adoptlist' })
}

// 初始載入
onMounted(fetchAdoptionData)
</script>

<template>
  <PageBreadcrumb :pageTitle="currentPageTitle" :items="breadcrumbItems" />

  <div v-if="fetching" class="flex h-60 items-center justify-center">
    <div class="text-lg font-medium text-gray-500">正在讀取領養資料...</div>
  </div>

  <div v-else class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
    <div class="border-b border-gray-200 px-7 py-4 dark:border-gray-800">
      <h3 class="font-medium text-gray-800 dark:text-white/90">修改領養紀錄資訊 (ID: {{ adoptionId }})</h3>
    </div>

    <div class="p-7">
      <form @submit.prevent="handleSubmit">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          
          <div>
            <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white/90">領養編號 (AdoptionId)</label>
            <input
              v-model="form.adoptionId"
              type="text"
              disabled
              class="w-full rounded-lg border border-gray-300 bg-gray-100 px-5 py-3 outline-none dark:border-gray-700 dark:bg-gray-800"
            />
          </div>

          <div>
            <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white/90">寵物 ID (PetId)</label>
            <input
              v-model.number="form.petId"
              type="number"
              class="w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 outline-none focus:border-primary dark:border-gray-700"
              required
            />
          </div>

          <div>
            <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white/90">使用者 ID (UserId)</label>
            <input
              v-model.number="form.userId"
              type="number"
              class="w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 outline-none focus:border-primary dark:border-gray-700"
              required
            />
          </div>

          <div>
            <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white/90">當前狀態</label>
            <input
              v-model="form.status"
              type="text"
              class="w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 outline-none focus:border-primary dark:border-gray-700"
            />
          </div>

          <div>
            <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white/90">申請日期</label>
            <input
              v-model="form.applyDate"
              type="date"
              class="w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 outline-none focus:border-primary dark:border-gray-700"
            />
          </div>

          <div>
            <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white/90">領養日期</label>
            <input
              v-model="form.adoptDate"
              type="date"
              class="w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 outline-none focus:border-primary dark:border-gray-700"
            />
          </div>

          <div>
            <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white/90">追蹤截止日</label>
            <input
              v-model="form.followUpDeadline"
              type="date"
              class="w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 outline-none focus:border-primary dark:border-gray-700"
            />
          </div>

          <div>
            <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white/90">退回日期</label>
            <input
              v-model="form.returnDate"
              type="date"
              class="w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 outline-none focus:border-primary dark:border-gray-700"
            />
          </div>

          <div class="md:col-span-2">
            <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white/90">退回原因</label>
            <textarea
              v-model="form.returnReason"
              rows="3"
              class="w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 outline-none focus:border-primary dark:border-gray-700"
            ></textarea>
          </div>
        </div>

        <div class="mt-8 flex gap-4">
          <button
            type="submit"
            :disabled="loading"
            class="flex justify-center rounded bg-primary px-10 py-3 font-medium text-white hover:bg-opacity-90 disabled:bg-gray-400"
          >
            {{ loading ? '更新中...' : '儲存修改' }}
          </button>
          <button
            @click="goBack"
            type="button"
            class="flex justify-center rounded border border-gray-300 px-10 py-3 font-medium text-gray-800 hover:bg-gray-50 dark:text-white"
          >
            取消修改
          </button>
        </div>
      </form>
    </div>
  </div>
</template>