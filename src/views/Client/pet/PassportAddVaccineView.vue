<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import request from '@/api/axios'
import { Undo2 } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const passportId = parseInt(route.query.passportId) || null

const form = reactive({
  vaccineType: '',
  vaccineLocation: '',
  vaccineTime: new Date().toISOString().split('T')[0],
  forecast: '',
})

const submitting = ref(false)

const submitForm = async () => {
  if (!form.vaccineType || !form.vaccineTime) {
    alert('請填寫疫苗名稱與施打日期')
    return
  }

  submitting.value = true
  try {
    const userId = authStore.userInfo?.userId || authStore.userInfo?.id
    if (!userId) {
      alert('請先登入後再進行操作')
      submitting.value = false
      return
    }

    await request.post('/users/pet/passport/unified', {
      userId: userId,
      detailType: 'vaccine',
      passportId: passportId,
      vaccineType: form.vaccineType,
      vaccineLocation: form.vaccineLocation,
      vaccineTime: form.vaccineTime,
      forecast: form.forecast || null,
    })
    alert('疫苗施打紀錄新增成功！')
    router.push({ name: 'pet-health-passport' })
  } catch (error) {
    console.error('新增疫苗紀錄失敗:', error)
    alert('新增失敗，請確認欄位格式或登入狀態')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="relative min-h-screen bg-[#F7F3F1] px-6 py-4">
    <!-- 頁面標題 -->
    <div class="relative mb-8 flex items-center justify-center">
      <h1 class="text-xl font-bold text-gray-700">新增疫苗施打紀錄</h1>
      <button @click="router.back()" class="absolute right-0 text-gray-400 hover:text-gray-600">
        <Undo2 class="h-6 w-6" />
      </button>
    </div>

    <!-- 表單 -->
    <div class="mx-auto max-w-xl space-y-6">

      <!-- 疫苗名稱 -->
      <div>
        <label class="mb-2 block font-bold text-[#9C6D6D]">
          疫苗名稱 <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.vaccineType"
          type="text"
          placeholder="例：狂犬病疫苗、三合一疫苗..."
          class="w-full rounded-2xl border-none bg-white p-4 shadow-sm outline-none focus:ring-2 focus:ring-[#9C6D6D]" />
      </div>

      <!-- 施打診所 -->
      <div>
        <label class="mb-2 block font-bold text-gray-500">施打診所</label>
        <input
          v-model="form.vaccineLocation"
          type="text"
          placeholder="例：信義寵物診所"
          class="w-full rounded-2xl border-none bg-white p-4 shadow-sm outline-none focus:ring-2 focus:ring-[#9C6D6D]" />
      </div>

      <!-- 施打日期 -->
      <div>
        <label class="mb-2 block font-bold text-gray-500">
          施打日期 <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.vaccineTime"
          type="date"
          class="w-full rounded-2xl border-none bg-white p-4 shadow-sm outline-none focus:ring-2 focus:ring-[#9C6D6D]" />
      </div>

      <!-- 下次預測施打日 -->
      <div>
        <label class="mb-2 block font-bold text-gray-500">下次預測施打日（選填）</label>
        <input
          v-model="form.forecast"
          type="date"
          class="w-full rounded-2xl border-none bg-white p-4 shadow-sm outline-none focus:ring-2 focus:ring-[#9C6D6D]" />
        <p class="mt-1 text-xs text-amber-600">⚠️ 建議依醫師指示填寫，系統將顯示於護照疫苗頁面</p>
      </div>

      <!-- 提交按鈕 -->
      <div class="pb-12 pt-4">
        <button
          @click="submitForm"
          :disabled="submitting"
          class="w-full rounded-full bg-[#B59891] py-3 text-lg font-bold text-white shadow-lg transition hover:bg-[#9C6D6D] disabled:opacity-50">
          {{ submitting ? '儲存中...' : '完成新增' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
input[type='date']::-webkit-calendar-picker-indicator {
  display: block;
  cursor: pointer;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 24 24"><path fill="%239C6D6D" d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z"/></svg>');
  opacity: 1;
}
</style>
