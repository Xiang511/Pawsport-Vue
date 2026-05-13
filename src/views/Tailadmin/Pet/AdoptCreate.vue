<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import PageBreadcrumb from '@/components/Pawsport/PageBreadcrumb.vue'

const router = useRouter()
// 修正標題
const currentPageTitle = ref('新增領養紀錄')

// 麵包屑
const breadcrumbItems = ref([
  { name: '首頁', route: '/dashboard' },
  { name: '領養紀錄', route: '/dashboard/adoption' },
  { name: '新增領養紀錄', route: '' }
])

// 1. 定義表單資料 (與 ViewModel 對應)
const form = ref({
  name: '',
  petId: null,
  userId: null,
  applyDate: new Date().toISOString().split('T')[0], // 預設今天
  adoptDate: '',
  returnDate: '',
  returnReason: '',
  status: '待審核', // 建議給一個預設狀態
  followUpDeadline: '',
})

const loading = ref(false)

// 2. 提交表單
const handleSubmit = async () => {
  loading.value = true
  try {
    const response = await axios.post('https://localhost:7048/api/AdoptionRecord', form.value)
    const result = response.data

    if (result.success === true) {
      alert('建立成功！')
      router.push({ name: 'admin-adoptlist' })
    } else {
      alert('建立失敗：' + (result.message || '未知錯誤'))
    }
  } catch (error) {
    console.error('提交失敗:', error)
    alert('系統錯誤，請檢查主控台')
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push({ name: 'admin-adoptlist' })
}
</script>

<template>
  <PageBreadcrumb :pageTitle="currentPageTitle" :items="breadcrumbItems" />

  <div class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
    <div class="border-b border-gray-200 px-7 py-4 dark:border-gray-800">
      <h3 class="font-medium text-gray-800 dark:text-white/90">填寫領養資訊</h3>
    </div>

    <div class="p-7">
      <form @submit.prevent="handleSubmit">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          
          <div>
            <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white/90">
              領養人名稱
            </label>
            <input
              v-model="form.name"
              type="text"
              placeholder="請輸入名稱"
              class="w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 outline-none focus:border-primary dark:border-gray-700"
              required
            />
          </div>

          <div>
            <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white/90">寵物 ID</label>
            <input
              v-model.number="form.petId"
              type="number"
              placeholder="輸入寵物編號"
              class="w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 outline-none focus:border-primary dark:border-gray-700"
              required
            />
          </div>

          <div>
            <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white/90">使用者 ID</label>
            <input
              v-model.number="form.userId"
              type="number"
              class="w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 outline-none focus:border-primary dark:border-gray-700"
              required
            />
          </div>

          <div>
            <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white/90">處理狀態</label>
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
            <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white/90">退回原因 / 備註</label>
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
            {{ loading ? '建立中...' : '確認新增' }}
          </button>
          <button
            @click="goBack"
            type="button"
            class="flex justify-center rounded border border-gray-300 px-10 py-3 font-medium text-gray-800 hover:bg-gray-50 dark:text-white"
          >
            取消
          </button>
        </div>
      </form>
    </div>
  </div>
</template>