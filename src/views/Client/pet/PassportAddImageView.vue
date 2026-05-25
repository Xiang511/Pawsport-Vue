<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import request from '@/api/axios'
import { Undo2, Upload, X } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const passportId = parseInt(route.query.passportId) || null

const form = reactive({
  photoBase64: '',
  photoNote: '',
})

const previewUrl = ref(null)
const submitting = ref(false)

// 讀取圖片並轉換為 Base64
const onFileChange = (event) => {
  const file = event.target.files[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    alert('請選擇圖片格式的檔案')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    form.photoBase64 = e.target.result // 完整 data URL (含 data:image/...;base64,)
    previewUrl.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const removeImage = () => {
  form.photoBase64 = ''
  previewUrl.value = null
}

const submitForm = async () => {
  if (!form.photoBase64) {
    alert('請選擇一張圖片')
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
      detailType: 'image',
      passportId: passportId,
      photoBase64: form.photoBase64,
      photoNote: form.photoNote,
    })
    alert('影像上傳成功！')
    router.push({ name: 'pet-health-passport' })
  } catch (error) {
    console.error('上傳影像失敗:', error)
    alert('上傳失敗，請確認登入狀態或檔案大小')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="relative min-h-screen bg-[#F7F3F1] px-6 py-4">
    <!-- 頁面標題 -->
    <div class="relative mb-8 flex items-center justify-center">
      <h1 class="text-xl font-bold text-gray-700">上傳毛孩影像</h1>
      <button @click="router.back()" class="absolute right-0 text-gray-400 hover:text-gray-600">
        <Undo2 class="h-6 w-6" />
      </button>
    </div>

    <div class="mx-auto max-w-xl space-y-6">

      <!-- 圖片上傳區 -->
      <div>
        <label class="mb-2 block font-bold text-[#9C6D6D]">
          選擇照片 <span class="text-red-500">*</span>
        </label>

        <!-- 預覽區域 -->
        <div v-if="previewUrl" class="relative mb-4">
          <img
            :src="previewUrl"
            class="h-64 w-full rounded-2xl object-cover shadow-md" />
          <button
            @click="removeImage"
            class="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-gray-600 shadow hover:bg-white">
            <X class="h-4 w-4" />
          </button>
        </div>

        <!-- 上傳按鈕（未選圖時顯示） -->
        <label
          v-else
          class="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#9C6D6D]/40 bg-white transition hover:border-[#9C6D6D] hover:bg-[#F7F3F1]">
          <Upload class="mb-3 h-10 w-10 text-[#9C6D6D]/60" />
          <span class="text-sm font-medium text-gray-500">點擊選擇圖片</span>
          <span class="mt-1 text-xs text-gray-400">支援 JPG、PNG、WEBP</span>
          <input
            type="file"
            accept="image/*"
            @change="onFileChange"
            class="hidden" />
        </label>
      </div>

      <!-- 備註描述 -->
      <div>
        <label class="mb-2 block font-bold text-gray-500">備註描述（選填）</label>
        <textarea
          v-model="form.photoNote"
          placeholder="例：第一次帶麻糬去看診的照片..."
          rows="4"
          class="w-full resize-none rounded-2xl border-none bg-white p-4 shadow-sm outline-none focus:ring-2 focus:ring-[#9C6D6D]" />
      </div>

      <!-- 提交按鈕 -->
      <div class="pb-12 pt-4">
        <button
          @click="submitForm"
          :disabled="submitting || !previewUrl"
          class="w-full rounded-full bg-[#B59891] py-3 text-lg font-bold text-white shadow-lg transition hover:bg-[#9C6D6D] disabled:cursor-not-allowed disabled:opacity-50">
          {{ submitting ? '上傳中...' : '完成上傳' }}
        </button>
      </div>
    </div>
  </div>
</template>
