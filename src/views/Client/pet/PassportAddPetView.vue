<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import request from '@/api/axios'
import { Undo2 } from 'lucide-vue-next'

const router = useRouter()

// 定義完全對接 HealthPassport 資料庫欄位的格式
const form = reactive({
  petId: 101, // 實務上由前一頁傳入或從選單指定特定毛孩
  recordDate: new Date().toISOString().split('T')[0], // 預設當天
  weight: '',
  note: '',
  photo: 'toast.jpg', // 預設圖
  gender: '公',
  isDesex: true,
})

// 提交表單 POST
const submitForm = async () => {
  if (!form.weight || !form.recordDate) {
    alert('請填寫記錄日期與測量體重')
    return
  }

  try {
    const payload = {
      petId: parseInt(form.petId),
      recordDate: form.recordDate,
      weight: parseFloat(form.weight),
      note: form.note,
      photo: form.photo,
      gender: form.gender,
      isDesex: form.isDesex,
    }

    await request.post('/api/users/pet/passport', payload)
    alert('建立毛孩健康紀錄成功！')
    router.push({ name: 'pet-health-passport' }) // 回到護照主頁
  } catch (error) {
    console.error('刊登紀錄失敗:', error)
    alert('新增失敗，請確認欄位格式')
  }
}

const closePage = () => {
  router.back()
}
</script>

<template>
  <div class="relative min-h-screen bg-[#F7F3F1] px-6 py-4">
    <div class="relative mb-8 flex items-center justify-center">
      <h1 class="text-xl font-bold text-gray-700">建立毛孩健康紀錄</h1>
      <button @click="closePage" class="absolute right-0 text-gray-400 hover:text-gray-600">
        <Undo2 class="h-6 w-6" />
      </button>
    </div>

    <div class="mx-auto max-w-xl space-y-6">
      <div>
        <label class="mb-2 block font-bold text-[#9C6D6D]">
          紀錄測量日期
          <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.recordDate"
          type="date"
          class="w-full rounded-2xl border-none bg-white p-4 shadow-sm outline-none focus:ring-2 focus:ring-[#9C6D6D]" />
      </div>

      <div>
        <label class="mb-2 block font-bold text-gray-500">
          目前體重
          <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <input
            v-model="form.weight"
            type="number"
            step="0.01"
            placeholder="請輸入體重"
            class="w-full rounded-2xl border-none bg-white p-4 shadow-sm outline-none focus:ring-2 focus:ring-[#9C6D6D]" />
          <span class="absolute top-1/2 right-4 -translate-y-1/2 font-bold text-gray-400">KG</span>
        </div>
      </div>

      <div>
        <label class="mb-2 block font-bold text-gray-500">毛孩性別</label>
        <div class="mt-3 flex gap-6">
          <label
            v-for="g in ['公', '母', '未知']"
            :key="g"
            class="flex cursor-pointer items-center gap-2">
            <input type="radio" v-model="form.gender" :value="g" class="h-5 w-5 accent-[#9C6D6D]" />
            <span class="text-gray-600">{{ g }}</span>
          </label>
        </div>
      </div>

      <div>
        <label class="mb-2 block font-bold text-gray-500">絕育狀況</label>
        <div class="mt-3 flex gap-6">
          <label class="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              :value="true"
              v-model="form.isDesex"
              class="h-5 w-5 accent-[#9C6D6D]" />
            <span class="text-gray-600">已絕育</span>
          </label>
          <label class="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              :value="false"
              v-model="form.isDesex"
              class="h-5 w-5 accent-[#9C6D6D]" />
            <span class="text-gray-600">未絕育</span>
          </label>
        </div>
      </div>

      <div>
        <label class="mb-2 block font-bold text-gray-500">健康狀況與備註描述</label>
        <textarea
          v-model="form.note"
          placeholder="請輸入此階段的常規備註（如：食慾正常、毛髮有光澤...）"
          rows="4"
          class="w-full resize-none rounded-2xl border-none bg-white p-4 shadow-sm outline-none focus:ring-2 focus:ring-[#9C6D6D]"></textarea>
      </div>

      <div class="pt-6 pb-12">
        <button
          @click="submitForm"
          class="w-32 rounded-full bg-[#B59891] py-3 text-lg font-bold text-white shadow-lg transition hover:bg-[#9C6D6D]">
          完成建立
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
