<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import PageBreadcrumb from '@/components/Pawsport/PageBreadcrumb.vue'

const router = useRouter()
const currentPageTitle = ref('新增走失資料')

// 麵包屑導覽
const breadcrumbItems = ref([
  { name: '首頁', route: '/dashboard' },
  { name: '走失列表', route: '/dashboard/missingreport' },
  { name: '新增資料', route: '' },
])

// 1. 定義表單資料
const form = ref({
  name: '',
  userId: null,
  petId: null,
  lastSeenDate: new Date().toISOString().split('T')[0], // 預設今天
  isActive: true, // 預設為尋找中
  lastSeenLat: null,
  lastSeenLng: null,
  lostLocation: '',
  // 通常 CreatedAt/UpdatedAt 由後端生成，但若你的 API 需要傳遞，這裡預設今天
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
})

const loading = ref(false)

// 2. 提交表單
const handleSubmit = async () => {
  loading.value = true
  try {
    const response = await axios.post('https://localhost:7048/api/MissingReports', form.value)
    const result = response.data

    if (result.success === true) {
      alert('新增成功！')
      router.push({ name: 'admin-missinglist' }) // 導回列表
    } else {
      alert('新增失敗：' + (result.message || '未知錯誤'))
    }
  } catch (error) {
    console.error('提交失敗:', error)
    alert('系統錯誤，請檢查後端 API')
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push({ name: 'admin-missinglist' })
}
</script>

<template>
  <PageBreadcrumb :pageTitle="currentPageTitle" :items="breadcrumbItems" />

  <div
    class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
    <div class="border-b border-gray-200 px-7 py-4 dark:border-gray-800">
      <h3 class="font-medium text-gray-800 dark:text-white/90">填寫走失報告</h3>
    </div>

    <div class="p-7">
      <form @submit.prevent="handleSubmit">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div class="md:col-span-2">
            <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white/90">
              報告標題 / 寵物名稱
            </label>
            <input
              v-model="form.name"
              type="text"
              placeholder="例如：台北市信義區走失的小黑"
              class="focus:border-primary w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 outline-none dark:border-gray-700"
              required />
          </div>

          <div>
            <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white/90">
              申報人 ID (UserId)
            </label>
            <input
              v-model.number="form.userId"
              type="number"
              placeholder="請輸入使用者編號"
              class="focus:border-primary w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 outline-none dark:border-gray-700"
              required />
          </div>

          <div>
            <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white/90">
              寵物 ID (PetId)
            </label>
            <input
              v-model.number="form.petId"
              type="number"
              placeholder="請輸入寵物編號"
              class="focus:border-primary w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 outline-none dark:border-gray-700"
              required />
          </div>

          <div>
            <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white/90">
              最後目擊日期
            </label>
            <input
              v-model="form.lastSeenDate"
              type="date"
              class="focus:border-primary w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 outline-none dark:border-gray-700" />
          </div>

          <div class="flex flex-col justify-center">
            <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white/90">
              刊登狀態
            </label>
            <div class="mt-2 flex items-center gap-2">
              <input
                type="checkbox"
                v-model="form.isActive"
                class="text-primary focus:ring-primary h-5 w-5 rounded border-gray-300" />
              <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ form.isActive ? '尋找中 (刊登中)' : '已結束 (結案)' }}
              </span>
            </div>
          </div>

          <div class="md:col-span-2">
            <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white/90">
              走失地點文字描述
            </label>
            <input
              v-model="form.lostLocation"
              type="text"
              placeholder="例如：XX公園路口、某某超市門口"
              class="focus:border-primary w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 outline-none dark:border-gray-700" />
          </div>

          <div>
            <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white/90">
              最後目擊緯度 (Lat)
            </label>
            <input
              v-model.number="form.lastSeenLat"
              type="number"
              step="any"
              placeholder="25.xxxx"
              class="focus:border-primary w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 outline-none dark:border-gray-700" />
          </div>

          <div>
            <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white/90">
              最後目擊經度 (Lng)
            </label>
            <input
              v-model.number="form.lastSeenLng"
              type="number"
              step="any"
              placeholder="121.xxxx"
              class="focus:border-primary w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 outline-none dark:border-gray-700" />
          </div>
        </div>

        <div class="mt-8 flex gap-4">
          <button
            type="submit"
            :disabled="loading"
            class="bg-primary hover:bg-opacity-90 flex justify-center rounded px-10 py-3 font-medium text-white disabled:bg-gray-400">
            {{ loading ? '資料傳送中...' : '確認新增' }}
          </button>
          <button
            @click="goBack"
            type="button"
            class="flex justify-center rounded border border-gray-300 px-10 py-3 font-medium text-gray-800 hover:bg-gray-50 dark:text-white">
            取消
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
