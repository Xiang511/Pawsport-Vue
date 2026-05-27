<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import request from '@/api/axios'
import { Undo2, Upload, X, Sparkles } from 'lucide-vue-next'
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
  <div class="page-container min-h-screen bg-[#FDF9F3] text-gray-800 antialiased font-fredoka px-4 py-8">
    <div class="mx-auto max-w-xl mt-6">
      
      <!-- MAIN CONTAINER CARD -->
      <div class="relative rounded-3xl border-4 border-[#445944] bg-white p-6 md:p-8 shadow-[6px_6px_0px_#445944]">
        
        <!-- HEADER ROW -->
        <div class="flex items-center justify-between border-b-4 border-[#445944] pb-4 mb-6">
          <button
            @click="router.back()"
            class="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#445944] bg-[#FCF4E5] text-[#445944] font-black transition hover:bg-[#445944] hover:text-white shadow-[2px_2px_0px_#445944] active:translate-y-[1px]">
            <Undo2 class="h-5 w-5" />
          </button>
          <h1 class="text-xl font-black text-[#445944] tracking-wide flex items-center gap-1.5">
            <Sparkles :size="18" class="text-amber-500 animate-spin-slow" />
            上傳毛孩影像
          </h1>
          <div class="w-10"></div>
        </div>

        <!-- FORM BODY -->
        <div class="space-y-6">

          <!-- 圖片上傳區 -->
          <div>
            <label class="mb-2 block text-sm font-black text-[#445944]">
              選擇照片 <span class="text-red-500">*</span>
            </label>

            <!-- 預覽區域 -->
            <div v-if="previewUrl" class="relative border-4 border-[#445944] rounded-2xl overflow-hidden shadow-[4px_4px_0px_#445944]">
              <img
                :src="previewUrl"
                class="h-64 w-full object-cover" />
              <button
                @click="removeImage"
                class="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-xl border-2 border-[#445944] bg-red-500 text-white font-black hover:bg-red-600 shadow-md">
                ✕
              </button>
            </div>

            <!-- 上傳按鈕（未選圖時顯示） -->
            <label
              v-else
              class="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-4 border-dashed border-[#445944] bg-[#FCF4E5] hover:bg-white transition-all shadow-[4px_4px_0px_#445944]">
              <Upload class="mb-2 h-10 w-10 text-[#445944] animate-bounce-slow" />
              <span class="text-sm font-black text-[#445944]">點擊選擇圖片</span>
              <span class="mt-1 text-xs font-bold text-gray-400">支援 JPG、PNG、WEBP</span>
              <input
                type="file"
                accept="image/*"
                @change="onFileChange"
                class="hidden" />
            </label>
          </div>

          <!-- 備註描述 -->
          <div>
            <label class="mb-2 block text-sm font-black text-[#445944]">備註描述 (選填)</label>
            <textarea
              v-model="form.photoNote"
              placeholder="例：第一次帶麻糬去看診的照片..."
              rows="4"
              class="w-full resize-none rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] p-4 shadow-[2px_2px_0px_#445944] outline-none focus:ring-0 focus:border-[#445944] placeholder-gray-400 font-bold" />
          </div>

          <!-- 提交按鈕 -->
          <div class="pt-4">
            <button
              @click="submitForm"
              :disabled="submitting || !previewUrl"
              class="w-full rounded-2xl border-2 border-[#445944] bg-[#445944] py-4 text-lg font-black text-white shadow-[4px_4px_0px_#445944] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#445944] disabled:cursor-not-allowed disabled:opacity-50">
              {{ submitting ? '上傳中...' : '完成上傳' }}
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

.animate-bounce-slow {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}
</style>
