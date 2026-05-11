<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import PageBreadcrumb from '@/components/Pawsport/PageBreadcrumb.vue'

const route = useRoute()
const router = useRouter()
const passportId = route.params.id

const currentPageTitle = ref('寵物詳細病歷')
const loading = ref(true)
const detail = ref(null)

// 麵包屑
const breadcrumbItems = ref([
  { name: '首頁', route: '/dashboard' },
  { name: '健康護照', route: '/dashboard/passport' },
  { name: '詳細病歷', route: '' },
])

// 取得詳情資料
const fetchDetails = async () => {
  try {
    const response = await axios.get(`https://localhost:7048/api/PassPort/${passportId}/detail`)
    if (response.data.success) {
      detail.value = response.data.data
    } else {
      alert('找不到資料')
      goBack()
    }
  } catch (error) {
    console.error('取得詳情失敗:', error)
    alert('系統錯誤')
  } finally {
    loading.value = false
  }
}

// 格式化日期時間
const formatDateTime = (dateString) => {
  if (!dateString) return null
  const date = new Date(dateString)
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const goBack = () => router.push({ name: 'admin-passportlist' })
const goToEdit = () => router.push({ name: 'admin-passportedit', params: { id: passportId } })

onMounted(fetchDetails)
</script>

<template>
  <PageBreadcrumb :pageTitle="currentPageTitle" :items="breadcrumbItems" />

  <div v-if="loading" class="flex h-60 items-center justify-center">
    <div class="text-lg font-medium text-gray-500">詳情載入中...</div>
  </div>

  <div v-else-if="detail" class="space-y-6">
    <div
      class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div
        class="flex items-center justify-between border-b border-gray-200 px-7 py-4 dark:border-gray-800">
        <h3 class="text-lg font-bold text-gray-800 dark:text-white/90">🩺 醫療與診斷明細</h3>
        <span class="text-sm text-gray-500">護照 ID: {{ detail.passportId }}</span>
      </div>

      <div class="grid grid-cols-1 gap-x-12 gap-y-4 p-7 md:grid-cols-2">
        <div class="flex flex-col">
          <span class="text-sm font-semibold text-gray-400 uppercase">醫療明細 ID</span>
          <span class="text-gray-800 dark:text-gray-200">{{ detail.medicalDetailId }}</span>
        </div>

        <div class="flex flex-col">
          <span class="text-sm font-semibold text-gray-400 uppercase">就診地點</span>
          <span class="text-gray-800 dark:text-gray-200">
            {{ detail.treatmentLocation || '尚未記錄' }}
          </span>
        </div>

        <div class="flex flex-col">
          <span class="text-sm font-semibold text-gray-400 uppercase">診斷病症</span>
          <span class="text-primary font-medium text-gray-800 dark:text-gray-200">
            {{ detail.disease || '無' }}
          </span>
        </div>

        <div class="flex flex-col">
          <span class="text-sm font-semibold text-gray-400 uppercase">治療方式</span>
          <span class="text-gray-800 dark:text-gray-200">
            {{ detail.diseaseTreatment || '尚未記錄' }}
          </span>
        </div>

        <div class="flex flex-col">
          <span class="text-sm font-semibold text-gray-400 uppercase">就診時間</span>
          <span
            :class="
              detail.treatmentTime ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400 italic'
            ">
            {{ formatDateTime(detail.treatmentTime) || '尚未有資料' }}
          </span>
        </div>

        <div class="flex flex-col">
          <span class="text-sm font-semibold text-gray-400 uppercase">醫療紀錄最後更新</span>
          <span class="text-gray-800 dark:text-gray-200">
            {{ formatDateTime(detail.treatmentUpdatedAt) || '尚未有資料' }}
          </span>
        </div>
      </div>
    </div>

    <div
      class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div class="border-b border-gray-200 px-7 py-4 dark:border-gray-800">
        <h3 class="text-lg font-bold text-gray-800 dark:text-white/90">💉 疫苗施打紀錄</h3>
      </div>

      <div class="grid grid-cols-1 gap-x-12 gap-y-4 p-7 md:grid-cols-2">
        <div class="flex flex-col">
          <span class="text-sm font-semibold text-gray-400 uppercase">疫苗歷史 ID</span>
          <span class="text-gray-800 dark:text-gray-200">{{ detail.historyId }}</span>
        </div>

        <div class="flex flex-col">
          <span class="text-sm font-semibold text-gray-400 uppercase">疫苗種類</span>
          <span
            class="bg-success/10 text-success mt-1 inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium">
            {{ detail.type || '尚未記錄' }}
          </span>
        </div>

        <div class="flex flex-col">
          <span class="text-sm font-semibold text-gray-400 uppercase">施打地點</span>
          <span class="text-gray-800 dark:text-gray-200">
            {{ detail.vaccinationLocation || '尚未記錄' }}
          </span>
        </div>

        <div class="flex flex-col">
          <span class="text-sm font-semibold text-gray-400 uppercase">施打時間</span>
          <span
            :class="
              detail.vaccinationTime ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400 italic'
            ">
            {{ formatDateTime(detail.vaccinationTime) || '尚未有資料' }}
          </span>
        </div>

        <div class="flex flex-col">
          <span class="text-sm font-semibold text-gray-400 uppercase">疫苗紀錄最後更新</span>
          <span class="text-gray-800 dark:text-gray-200">
            {{ formatDateTime(detail.vaccinationUpdatedAt) || '尚未有資料' }}
          </span>
        </div>

        <div class="flex flex-col">
          <span class="text-sm font-semibold text-gray-400 uppercase">疫苗紀錄建立時間</span>
          <span class="text-gray-800 dark:text-gray-200">
            {{ formatDateTime(detail.vaccinationCreatedAt) || '尚未有資料' }}
          </span>
        </div>
      </div>
    </div>

    <div class="flex gap-4">
      <button
        @click="goToEdit"
        class="bg-primary hover:bg-opacity-90 flex justify-center rounded px-10 py-3 font-medium text-white">
        編輯此病歷
      </button>
      <button
        @click="goBack"
        class="flex justify-center rounded border border-gray-300 px-10 py-3 font-medium text-gray-800 hover:bg-gray-50 dark:border-gray-700 dark:text-white">
        返回列表
      </button>
    </div>
  </div>
</template>
