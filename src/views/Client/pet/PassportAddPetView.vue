<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import request from '@/api/axios'
import { Undo2, Camera } from 'lucide-vue-next'

const router = useRouter()

// 定義完全對接 PetPassportDisplayDto & PetPassportUpsertDto 欄位的格式
const form = reactive({
  name: '', // 寵物姓名 (來自 Pet)
  birthDate: '', // 出生日期 (用來由後端依 BirthDate 計算 Age)
  photo: '', // 寵物照片 (HealthPassport)
  gender: '公', // 性別 (Pet)
  isDesex: true, // 絕育狀況 (Pet)
  weight: '', // 目前體重 (HealthPassport)
  recordDate: new Date().toISOString().split('T')[0], // 記錄測量日期
  note: '', // 備註描述
})

// 處理寵物照片上傳
const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (file.size > 2 * 1024 * 1024) {
    alert('照片請勿超過 2MB')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    form.photo = e.target.result // Base64 字串
  }
  reader.readAsDataURL(file)
}

const removeImage = () => {
  form.photo = ''
}

// 提交表單 POST
const submitForm = async () => {
  if (!form.name) {
    alert('請填寫寵物姓名')
    return
  }
  if (!form.weight || !form.recordDate) {
    alert('請填寫記錄日期與測量體重')
    return
  }

  try {
    const genderMap = {
      '公': 1,
      '母': 2,
      '未知': null
    }

    const payload = {
      petId: 0, // 帶入 0 觸發後端自動建立全新 Pet 紀錄
      name: form.name,
      birthDate: form.birthDate || null,
      recordDate: form.recordDate,
      weight: parseFloat(form.weight),
      note: form.note,
      photo: form.photo || 'default_pet.jpg', // 若未上傳則使用預設圖
      gender: genderMap[form.gender] !== undefined ? genderMap[form.gender] : null,
      isDesex: form.isDesex,
    }

    await request.post('/users/pet/passport', payload)
    alert('建立毛孩健康護照成功！')
    router.push({ name: 'pet-health-passport' }) // 回到護照主頁
  } catch (error) {
    console.error('建立紀錄失敗:', error)
    alert('建立失敗，請確認欄位格式')
  }
}

const closePage = () => {
  router.back()
}
</script>

<template>
  <div class="relative min-h-screen bg-[#F7F3F1] px-6 py-8">
    <!-- 頁首導航 -->
    <div class="relative mb-8 flex items-center justify-center">
      <h1 class="text-xl font-bold text-gray-700">建立毛孩健康護照</h1>
      <button @click="closePage" class="absolute right-0 text-gray-400 hover:text-gray-600 transition">
        <Undo2 class="h-6 w-6" />
      </button>
    </div>

    <!-- 表單卡片 -->
    <div class="mx-auto max-w-xl space-y-6 rounded-2xl bg-white p-6 shadow-sm">
      <!-- 寵物頭像上傳 -->
      <div class="flex flex-col items-center justify-center py-4">
        <div class="relative h-28 w-28 overflow-hidden rounded-full border-4 border-[#F7F3F1] bg-gray-100 shadow-md">
          <img :src="form.photo || 'default_pet.jpg'" class="h-full w-full object-cover" />
          <label class="absolute inset-0 flex cursor-pointer flex-col items-center justify-center bg-black/40 text-white opacity-0 transition-opacity hover:opacity-100">
            <Camera class="h-6 w-6 mb-1" />
            <span class="text-xs">上傳相片</span>
            <input type="file" @change="handleImageUpload" class="hidden" accept="image/*" />
          </label>
        </div>
        <button v-if="form.photo" @click="removeImage" type="button" class="mt-2 text-xs text-red-500 hover:underline">
          移除照片
        </button>
        <p class="mt-2 text-xs text-gray-400">建議上傳毛孩清楚的面部照片 (限 2MB)</p>
      </div>

      <!-- 寵物姓名 -->
      <div>
        <label class="mb-2 block font-bold text-[#9C6D6D]">
          寵物姓名
          <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.name"
          type="text"
          placeholder="請輸入毛孩名字"
          required
          class="w-full rounded-xl border-gray-200 bg-gray-50/50 p-4 outline-none focus:border-[#9C6D6D] focus:ring-2 focus:ring-[#9C6D6D]/20 transition" />
      </div>

      <!-- 出生日期 -->
      <div>
        <label class="mb-2 block font-bold text-[#9C6D6D]">出生日期</label>
        <input
          v-model="form.birthDate"
          type="date"
          class="w-full rounded-xl border-gray-200 bg-gray-50/50 p-4 outline-none focus:border-[#9C6D6D] focus:ring-2 focus:ring-[#9C6D6D]/20 transition" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <!-- 寵物性別 -->
        <div>
          <label class="mb-2 block font-bold text-gray-500">毛孩性別</label>
          <select
            v-model="form.gender"
            class="w-full rounded-xl border-gray-200 bg-gray-50/50 p-4 outline-none focus:border-[#9C6D6D] focus:ring-2 focus:ring-[#9C6D6D]/20 transition">
            <option value="公">公</option>
            <option value="母">母</option>
            <option value="未知">未知</option>
          </select>
        </div>

        <!-- 絕育狀況 -->
        <div>
          <label class="mb-2 block font-bold text-gray-500">絕育狀況</label>
          <select
            v-model="form.isDesex"
            class="w-full rounded-xl border-gray-200 bg-gray-50/50 p-4 outline-none focus:border-[#9C6D6D] focus:ring-2 focus:ring-[#9C6D6D]/20 transition">
            <option :value="true">已絕育</option>
            <option :value="false">未絕育</option>
          </select>
        </div>
      </div>

      <!-- 目前體重 -->
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
            required
            class="w-full rounded-xl border-gray-200 bg-gray-50/50 p-4 outline-none focus:border-[#9C6D6D] focus:ring-2 focus:ring-[#9C6D6D]/20 transition" />
          <span class="absolute top-1/2 right-4 -translate-y-1/2 font-bold text-gray-400">KG</span>
        </div>
      </div>

      <!-- 記錄測量日期 -->
      <div>
        <label class="mb-2 block font-bold text-gray-500">
          記錄測量日期
          <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.recordDate"
          type="date"
          required
          class="w-full rounded-xl border-gray-200 bg-gray-50/50 p-4 outline-none focus:border-[#9C6D6D] focus:ring-2 focus:ring-[#9C6D6D]/20 transition" />
      </div>

      <!-- 健康狀況備註描述 -->
      <div>
        <label class="mb-2 block font-bold text-gray-500">備註描述</label>
        <textarea
          v-model="form.note"
          placeholder="請輸入此階段的常規健康描述（如：食慾正常、精神好...）"
          rows="3"
          class="w-full resize-none rounded-xl border-gray-200 bg-gray-50/50 p-4 outline-none focus:border-[#9C6D6D] focus:ring-2 focus:ring-[#9C6D6D]/20 transition"></textarea>
      </div>

      <!-- 提交按鈕 -->
      <div class="pt-4 pb-4">
        <button
          @click="submitForm"
          class="w-full rounded-full bg-[#B59891] py-4 text-lg font-bold text-white shadow-lg transition hover:bg-[#9C6D6D]">
          完成並建立護照
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
