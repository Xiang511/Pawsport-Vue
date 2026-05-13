<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import PageBreadcrumb from '@/components/Pawsport/PageBreadcrumb.vue'

const router = useRouter()
const currentPageTitle = ref('新增寵物資料')

// 定義麵包屑項目
const breadcrumbItems = ref([
  { name: '首頁', route: '/dashboard' },
  { name: '寵物資料一覽表', route: '/dashboard/pet' },
  { name: '新增寵物資料', route: '' }, // 當前頁面不需路由
])

// 1. 定義表單資料結構 (對應 Pet 模型)
const form = ref({
  speciesId: null,
  name: '',
  gender: '',
  size: '',
  coatColor: '',
  photo: '',
  currentStatus: '',
  behavioralTraits: '',
  isHighMaintenance: false,
  note: '',
  createdAt: new Date().toISOString().split('T')[0], // 預設今天
  isDesex: false,
  updatedAt: new Date().toISOString().split('T')[0],
})

const loading = ref(false)

// 2. 提交表單方法
const handleSubmit = async () => {
  loading.value = true
  try {
    // 呼叫你的 POST API
    const response = await axios.post('https://localhost:7048/api/Pet', form.value)
    const result = response.data

    if (result.success === true) {
      alert('建立成功！')
      router.push({ name: 'admin-petlist' }) // 成功後導回列表頁
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

// 取消並返回
const goBack = () => {
  router.push({ name: 'admin-petlist' })
}
</script>

<template>
  <PageBreadcrumb :pageTitle="currentPageTitle" :items="breadcrumbItems" />

  <div
    class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
    <div class="border-b border-gray-200 px-7 py-4 dark:border-gray-800">
      <h3 class="font-medium text-gray-800 dark:text-white/90">寵物基本資訊</h3>
    </div>

    <div class="p-7">
      <form @submit.prevent="handleSubmit">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white/90">
              寵物名稱
            </label>
            <input
              v-model="form.name"
              type="text"
              placeholder="請輸入寵物名稱"
              class="focus:border-primary w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 outline-none dark:border-gray-700"
              required />
          </div>

          <div>
            <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white/90">
              物種編號 (SpeciesId)
            </label>
            <input
              v-model.number="form.speciesId"
              type="number"
              class="focus:border-primary w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 outline-none dark:border-gray-700" />
          </div>

          <div>
            <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white/90">
              性別
            </label>
            <input
              v-model="form.gender"
              type="text"
              class="focus:border-primary w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 outline-none dark:border-gray-700" />
          </div>

          <div>
            <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white/90">
              體型
            </label>
            <input
              v-model="form.size"
              type="text"
              class="focus:border-primary w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 outline-none dark:border-gray-700" />
          </div>

          <div>
            <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white/90">
              花色
            </label>
            <input
              v-model="form.coatColor"
              type="text"
              class="focus:border-primary w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 outline-none dark:border-gray-700" />
          </div>

          <div>
            <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white/90">
              目前狀態
            </label>
            <input
              v-model="form.currentStatus"
              type="text"
              class="focus:border-primary w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 outline-none dark:border-gray-700" />
          </div>

          <div class="flex items-center gap-2 pt-8">
            <input v-model="form.isHighMaintenance" type="checkbox" id="highMain" class="h-5 w-5" />
            <label for="highMain" class="text-sm font-medium text-gray-800 dark:text-white/90">
              需要高度照護
            </label>
          </div>

          <div class="flex items-center gap-2 pt-8">
            <input v-model="form.isDesex" type="checkbox" id="isDesex" class="h-5 w-5" />
            <label for="isDesex" class="text-sm font-medium text-gray-800 dark:text-white/90">
              已結紮
            </label>
          </div>

          <div class="md:col-span-2">
            <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white/90">
              備註
            </label>
            <textarea
              v-model="form.note"
              rows="4"
              class="focus:border-primary w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 outline-none dark:border-gray-700"></textarea>
          </div>
        </div>

        <div class="mt-8 flex gap-4">
          <button
            type="submit"
            :disabled="loading"
            class="bg-primary hover:bg-opacity-90 text-primary flex justify-center rounded border border-gray-300 px-10 py-3 font-medium disabled:bg-gray-400 dark:text-white">
            {{ loading ? '儲存中...' : '建立新資料' }}
          </button>
          <button
            @click="goBack"
            type="button"
            class="text-primary flex justify-center rounded border border-gray-300 px-10 py-3 font-medium hover:bg-gray-50 dark:text-white">
            取消
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
