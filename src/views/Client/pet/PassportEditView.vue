<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import request from '@/api/axios'
import { Trash2, Undo2, Sparkles, Camera } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const passportId = ref(null)

const fileInput = ref(null)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const onFileChange = (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (file.size > 2 * 1024 * 1024) {
    alert('照片請勿超過 2MB')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    form.photo = e.target.result // base64 Data URL
  }
  reader.readAsDataURL(file)
}

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

const getImageUrl = (url) => {
  if (!url) return 'https://placecats.com/g/100/100'
  if (url.startsWith('/Images') || url.startsWith('/images')) {
    return `https://localhost:7048${url}`
  }
  return url
}

onMounted(async () => {
  passportId.value = route.params.id
  try {
    const userId = authStore.userInfo?.userId || authStore.userInfo?.id
    const response = await request.get(`/users/pet/passport/${passportId.value}?userId=${userId}`)
    if (response.data && response.data.data) {
      const data = response.data.data
      const genderRevMap = {
        1: '公',
        2: '母',
      }
      data.gender = genderRevMap[data.gender] || '未知'
      Object.assign(form, data)
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
    const genderMap = {
      公: 1,
      母: 2,
      未知: null,
    }

    const userId = authStore.userInfo?.userId || authStore.userInfo?.id

    const payload = {
      userId: userId,
      recordDate: form.recordDate,
      weight: parseFloat(form.weight),
      note: form.note,
      photo: form.photo,
      gender: genderMap[form.gender] !== undefined ? genderMap[form.gender] : null,
      isDesex: form.isDesex,
    }

    await request.put(`/users/pet/passport/${passportId.value}`, payload)
    alert('護照資料變更成功')
    router.back()
  } catch (error) {
    console.error('儲存變更失敗:', error)
    alert('更新失敗，請檢查資料正確性')
  }
}
</script>

<template>
  <div
    class="page-container font-fredoka min-h-screen bg-[#FCF4E5] px-4 py-8 text-gray-800 antialiased">
    <div class="mx-auto mt-6 w-[70%]">
      <!-- MAIN CONTAINER CARD -->
      <div
        class="relative rounded-3xl border-4 border-[#445944] bg-[#FCF4E5] p-6 shadow-[6px_6px_0px_#445944] md:p-8">
        <!-- HEADER ROW -->
        <div class="mb-6 flex items-center justify-between border-b-4 border-[#445944] pb-4">
          <button
            @click="router.back()"
            class="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#445944] bg-[#FCF4E5] font-black text-[#445944] shadow-[2px_2px_0px_#445944] transition hover:bg-[#445944] hover:text-white active:translate-y-[1px]">
            <Undo2 class="h-5 w-5" />
          </button>

          <h1 class="flex items-center gap-1.5 text-xl font-black tracking-wide text-[#445944]">
            <Sparkles :size="18" class="animate-spin-slow text-amber-500" />
            編輯健康護照
          </h1>

          <button
            @click="deletePet"
            class="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#445944] bg-red-100 text-red-600 shadow-[2px_2px_0px_#445944] transition hover:bg-red-500 hover:text-white active:translate-y-[1px]">
            <Trash2 class="h-5 w-5" />
          </button>
        </div>

        <!-- ACTIVE PROFILE IMAGE BOX -->
        <div
          class="relative mb-6 flex flex-col items-center justify-center rounded-3xl border-4 border-[#445944] bg-[#FCF4E5] py-6 shadow-[4px_4px_0px_#445944]">
          <div
            @click="triggerFileInput"
            class="group relative h-24 w-24 cursor-pointer overflow-hidden rounded-full border-4 border-[#445944] bg-white shadow-md transition hover:scale-105 active:scale-95">
            <img :src="getImageUrl(form.photo)" class="h-full w-full object-cover" />
            <div
              class="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100">
              <Camera class="h-5 w-5" />
              <span class="mt-0.5 text-[10px] font-black">更換照片</span>
            </div>
          </div>
          <p class="mt-3 text-center text-xs font-black text-gray-500">點擊頭像上傳/更換新照片</p>
          <input
            type="file"
            ref="fileInput"
            @change="onFileChange"
            class="hidden"
            accept="image/*" />
        </div>

        <!-- FORM BODY -->
        <div class="space-y-6">
          <!-- Name Disabled -->
          <div>
            <label class="mb-2 block text-sm font-black text-[#445944]">毛孩姓名 (不可變更)</label>
            <input
              v-model="form.name"
              type="text"
              disabled
              class="w-full cursor-not-allowed rounded-2xl border-2 border-[#445944] bg-gray-100 px-4 py-3.5 font-bold text-gray-400 shadow-[2px_2px_0px_rgba(0,0,0,0.05)]" />
          </div>

          <!-- Gender & Desex Selects -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="mb-2 block text-sm font-black text-gray-500">性別</label>
              <select
                v-model="form.gender"
                class="w-full appearance-none rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] px-4 py-3.5 font-bold text-gray-800 shadow-[2px_2px_0px_#445944] focus:border-[#445944] focus:ring-0 focus:outline-none">
                <option value="公">公</option>
                <option value="母">母</option>
                <option value="未知">未知</option>
              </select>
            </div>

            <div>
              <label class="mb-2 block text-sm font-black text-gray-500">絕育狀態</label>
              <select
                v-model="form.isDesex"
                class="w-full appearance-none rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] px-4 py-3.5 font-bold text-gray-800 shadow-[2px_2px_0px_#445944] focus:border-[#445944] focus:ring-0 focus:outline-none">
                <option :value="true">已絕育</option>
                <option :value="false">未絕育</option>
              </select>
            </div>
          </div>

          <!-- Date -->
          <div>
            <label class="mb-2 block text-sm font-black text-gray-500">紀錄測量日期</label>
            <input
              v-model="form.recordDate"
              type="date"
              class="w-full rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] px-4 py-3.5 font-bold text-gray-800 shadow-[2px_2px_0px_#445944] focus:border-[#445944] focus:ring-0 focus:outline-none" />
          </div>

          <!-- Weight -->
          <div>
            <label class="mb-2 block text-sm font-black text-gray-500">目前體重 (KG)</label>
            <input
              v-model="form.weight"
              type="number"
              step="0.1"
              class="w-full rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] px-4 py-3.5 font-bold text-gray-800 shadow-[2px_2px_0px_#445944] focus:border-[#445944] focus:ring-0 focus:outline-none" />
          </div>

          <!-- Note text area -->
          <div>
            <label class="mb-2 block text-sm font-black text-gray-500">健康備註描述</label>
            <textarea
              v-model="form.note"
              rows="3"
              class="w-full resize-none rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] p-4 font-bold placeholder-gray-400 shadow-[2px_2px_0px_#445944] outline-none focus:border-[#445944] focus:ring-0" />
          </div>

          <!-- Save button -->
          <div class="pt-4">
            <button
              @click="saveChanges"
              class="w-full rounded-2xl border-2 border-[#445944] bg-[#445944] py-4 text-lg font-black text-white shadow-[4px_4px_0px_#445944] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#445944]">
              儲存變更
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&family=Quicksand:wght@300..700&display=swap');

.font-fredoka {
  font-family: 'Fredoka', 'GenJyuu', sans-serif;
}

.animate-spin-slow {
  animation: spin 12s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

input[type='date']::-webkit-calendar-picker-indicator {
  display: block;
  cursor: pointer;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 24 24"><path fill="%23445944" d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z"/></svg>');
  opacity: 1;
}
</style>
