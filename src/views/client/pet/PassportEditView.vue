<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Trash2 } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

// 模擬從父組件或 API 取得的原始資料
const allPets = [
  {
    id: 101,
    name: 'Toast',
    type: '狗',
    breed: '柯基犬 Corgi',
    gender: '公',
    birthday: '2025/08/22',
    weight: 15,
    isNeutered: '已絕育',
    photo: 'toast.jpg',
  },
  // ... 其他寵物
]

const form = reactive({
  id: null,
  name: '',
  type: '',
  breed: '',
  gender: '',
  birthday: '',
  chipId: '',
  weight: '',
  isNeutered: '',
})

onMounted(() => {
  const petId = parseInt(route.params.id)
  const petData = allPets.find((p) => p.id === petId)

  if (petData) {
    // 將原有資料填入表單 (預填功能)
    Object.assign(form, petData)
  }
})

// 刪除寵物功能
const deletePet = () => {
  const isConfirmed = window.confirm('確定要刪除這隻寵物嗎？此操作無法復原。')
  if (isConfirmed) {
    console.log(`正在刪除 ID 為 ${form.id} 的寵物...`)
    // 這裡接 API 刪除邏輯
    alert('寵物已刪除')
    router.push('/passport')
  }
}

const saveChanges = () => {
  console.log('儲存修改後的資料：', form)
  alert('更新成功')
  router.back()
}
</script>

<template>
  <div class="relative min-h-screen bg-[#F7F3F1] px-6 py-4">
    <div class="mb-8 flex items-center justify-between">
      <button @click="router.back()" class="text-gray-500">
        <i class="fa-solid fa-arrow-left text-xl"></i>
      </button>
      <h1 class="text-lg font-bold text-gray-700">編輯寵物資料</h1>
      <button @click="deletePet" class="text-gray-400 hover:text-red-500">
        <Trash2 />
      </button>
    </div>

    <div class="relative mb-8 flex flex-col items-center">
      <div
        class="h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-gray-200 shadow-md">
        <img :src="form.photo" class="h-full w-full object-cover" />
      </div>
      <div
        class="absolute bottom-0 flex h-8 w-8 translate-x-8 items-center justify-center rounded-full border border-gray-100 bg-white shadow">
        <i class="fa-solid fa-pen text-xs text-gray-500"></i>
      </div>
    </div>

    <div class="mx-auto max-w-xl space-y-6">
      <div>
        <label class="mb-1 block text-sm text-gray-400">寵物姓名</label>
        <input
          v-model="form.name"
          type="text"
          class="w-full rounded-xl border-none bg-white p-4 shadow-sm outline-none" />
      </div>

      <div>
        <label class="mb-1 block text-sm text-gray-400">寵物的種類</label>
        <select
          v-model="form.type"
          class="w-full appearance-none rounded-xl border-none bg-white p-4 shadow-sm outline-none">
          <option>狗</option>
          <option>貓</option>
        </select>
      </div>

      <div class="pt-10">
        <button
          @click="saveChanges"
          class="w-full rounded-2xl bg-[#B59891] py-4 font-bold text-white shadow-lg">
          儲存變更
        </button>
      </div>
    </div>
  </div>
</template>
