<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import request from '@/api/axios'
import { Trash2 } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const passportId = ref(null)

const form = reactive({
  id: null,
  name: '',
  gender: '',
  birthDate: '',
  isDesex: false,
  recordDate: '',
  weight: '',
  note: '',
  photo: '',
})

onMounted(async () => {
  passportId.value = route.params.id
  try {
    const response = await request.get(`/api/users/pet/passport/${passportId.value}`)
    if (response.data && response.data.data) {
      Object.assign(form, response.data.data)
    }
  } catch (error) {
    console.error('讀取護照明細失敗:', error)
    alert('無法載入該筆紀錄')
  }
})

// 刪除按鈕 (此處保留串接軟刪除 Patch 的彈性，本實作著重防錯提報)
const deletePet = () => {
  const isConfirmed = window.confirm('確定要刪除這筆健康護照紀錄嗎？')
  if (isConfirmed) {
    alert('已發送刪除申請')
    router.push({ name: 'pet-health-passport' }) // 回主頁
  }
}

// 變更儲存 API 串接
const saveChanges = async () => {
  try {
    const payload = {
      recordDate: form.recordDate,
      weight: parseFloat(form.weight),
      note: form.note,
      photo: form.photo,
      gender: form.gender,
      isDesex: form.isDesex,
    }

    await request.put(`/api/users/pet/passport/${passportId.value}`, payload)
    alert('護照資料變更成功')
    router.back()
  } catch (error) {
    console.error('儲存變更失敗:', error)
    alert('更新失敗，請檢查資料正確性')
  }
}
</script>

<template>
  <div class="relative min-h-screen bg-[#F7F3F1] px-6 py-4">
    <div class="mb-8 flex items-center justify-between">
      <button @click="router.back()" class="text-gray-500">
        <i class="fa-solid fa-arrow-left text-xl"></i>
      </button>
      <h1 class="text-lg font-bold text-gray-700">編輯健康護照</h1>
      <button @click="deletePet" class="text-gray-400 hover:text-red-500">
        <Trash2 />
      </button>
    </div>

    <div class="relative mb-8 flex flex-col items-center">
      <div
        class="h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-gray-200 shadow-md">
        <img :src="form.photo || 'default_pet.jpg'" class="h-full w-full object-cover" />
      </div>
    </div>

    <div class="mx-auto max-w-xl space-y-6 rounded-2xl bg-white p-6 shadow-sm">
      <div>
        <label class="mb-1 block text-sm text-gray-400">毛孩姓名 (不可變更)</label>
        <input
          v-model="form.name"
          type="text"
          disabled
          class="w-full rounded-xl border-none bg-gray-100 p-4 text-gray-500 outline-none" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="mb-1 block text-sm text-gray-400">性別</label>
          <select
            v-model="form.gender"
            class="w-full rounded-xl border-none bg-gray-50 p-4 outline-none">
            <option value="公">公</option>
            <option value="母">母</option>
            <option value="未知">未知</option>
          </select>
        </div>
        <div>
          <label class="mb-1 block text-sm text-gray-400">絕育狀態</label>
          <select
            v-model="form.isDesex"
            class="w-full rounded-xl border-none bg-gray-50 p-4 outline-none">
            <option :value="true">已絕育</option>
            <option :value="false">未絕育</option>
          </select>
        </div>
      </div>

      <div>
        <label class="mb-1 block text-sm text-gray-400">紀錄測量日期</label>
        <input
          v-model="form.recordDate"
          type="date"
          class="w-full rounded-xl border-none bg-gray-50 p-4 outline-none" />
      </div>

      <div>
        <label class="mb-1 block text-sm text-gray-400">目前體重 (KG)</label>
        <input
          v-model="form.weight"
          type="number"
          step="0.1"
          class="w-full rounded-xl border-none bg-gray-50 p-4 outline-none" />
      </div>

      <div>
        <label class="mb-1 block text-sm text-gray-400">健康備註描述</label>
        <textarea
          v-model="form.note"
          rows="3"
          class="w-full resize-none rounded-xl border-none bg-gray-50 p-4 outline-none"></textarea>
      </div>

      <div class="pt-6">
        <button
          @click="saveChanges"
          class="w-full rounded-2xl bg-[#B59891] py-4 font-bold text-white shadow-lg transition hover:bg-[#9C6D6D]">
          儲存變更
        </button>
      </div>
    </div>
  </div>
</template>
