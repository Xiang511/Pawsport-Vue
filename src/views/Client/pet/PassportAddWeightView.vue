<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import request from '@/api/axios'
import { Undo2 } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()

const passportId = parseInt(route.query.passportId) || null

const form = reactive({
  weight: '',
  recordDate: new Date().toISOString().split('T')[0],
  note: '',
})

const submitting = ref(false)

const submitForm = async () => {
  if (!form.weight || !form.recordDate) {
    alert('請填寫體重與記錄日期')
    return
  }
  if (parseFloat(form.weight) <= 0) {
    alert('請輸入正確的體重數值')
    return
  }

  submitting.value = true
  try {
    await request.post('/users/pet/passport/unified', {
      detailType: 'weight',
      passportId: passportId,
      weight: parseFloat(form.weight),
      recordDate: form.recordDate,
      note: form.note,
    })
    alert('體重記錄新增成功！')
    router.push({ name: 'pet-health-passport' })
  } catch (error) {
    console.error('新增體重紀錄失敗:', error)
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
      <h1 class="text-xl font-bold text-gray-700">新增體重紀錄</h1>
      <button @click="router.back()" class="absolute right-0 text-gray-400 hover:text-gray-600">
        <Undo2 class="h-6 w-6" />
      </button>
    </div>

    <div class="mx-auto max-w-xl space-y-6">

      <!-- 體重 -->
      <div>
        <label class="mb-2 block font-bold text-[#9C6D6D]">
          體重 <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <input
            v-model="form.weight"
            type="number"
            step="0.01"
            min="0"
            placeholder="請輸入體重"
            class="w-full rounded-2xl border-none bg-white p-4 pr-14 shadow-sm outline-none focus:ring-2 focus:ring-[#9C6D6D]" />
          <span class="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">KG</span>
        </div>
      </div>

      <!-- 記錄日期 -->
      <div>
        <label class="mb-2 block font-bold text-gray-500">
          記錄日期 <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.recordDate"
          type="date"
          class="w-full rounded-2xl border-none bg-white p-4 shadow-sm outline-none focus:ring-2 focus:ring-[#9C6D6D]" />
      </div>

      <!-- 健康備註 -->
      <div>
        <label class="mb-2 block font-bold text-gray-500">健康備註（選填）</label>
        <textarea
          v-model="form.note"
          placeholder="例：飼料換新品牌後體重上升；獸醫建議控制飲食..."
          rows="4"
          class="w-full resize-none rounded-2xl border-none bg-white p-4 shadow-sm outline-none focus:ring-2 focus:ring-[#9C6D6D]" />
      </div>

      <!-- 體重預覽卡片 -->
      <div v-if="form.weight" class="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm">
        <span class="flex h-12 w-12 items-center justify-center rounded-full bg-[#F7F3F1] text-2xl">⚖️</span>
        <div>
          <p class="text-lg font-bold text-gray-800">{{ form.weight }} KG</p>
          <p class="text-xs text-gray-400">{{ form.recordDate }}</p>
        </div>
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
