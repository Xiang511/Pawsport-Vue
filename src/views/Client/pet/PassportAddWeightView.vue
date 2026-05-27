<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import request from '@/api/axios'
import { Undo2, Sparkles } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

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
    const userId = authStore.userInfo?.userId || authStore.userInfo?.id
    if (!userId) {
      alert('請先登入後再進行操作')
      submitting.value = false
      return
    }

    await request.post('/users/pet/passport/unified', {
      userId: userId,
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
            新增體重紀錄
          </h1>
          <div class="w-10"></div>
        </div>

        <!-- FORM BODY -->
        <div class="space-y-6">

          <!-- 體重 -->
          <div>
            <label class="mb-2 block text-sm font-black text-[#445944]">
              體重 <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                v-model="form.weight"
                type="number"
                step="0.01"
                min="0"
                placeholder="請輸入體重"
                class="w-full rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] px-4 pr-14 py-3.5 font-bold text-gray-800 focus:outline-none focus:ring-0 focus:border-[#445944] placeholder-gray-400 shadow-[2px_2px_0px_#445944]" />
              <span class="absolute right-4 top-1/2 -translate-y-1/2 font-black text-[#445944]">KG</span>
            </div>
          </div>

          <!-- 記錄日期 -->
          <div>
            <label class="mb-2 block text-sm font-black text-[#445944]">
              記錄日期 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.recordDate"
              type="date"
              class="w-full rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] px-4 py-3.5 font-bold text-gray-800 focus:outline-none focus:ring-0 focus:border-[#445944] shadow-[2px_2px_0px_#445944]" />
          </div>

          <!-- 健康備註 -->
          <div>
            <label class="mb-2 block text-sm font-black text-[#445944]">健康備註 (選填)</label>
            <textarea
              v-model="form.note"
              placeholder="例：飼料換新品牌後體重上升；獸醫建議控制飲食..."
              rows="4"
              class="w-full resize-none rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] p-4 shadow-[2px_2px_0px_#445944] outline-none focus:ring-0 focus:border-[#445944] placeholder-gray-400 font-bold" />
          </div>

          <!-- 體重預覽卡片 -->
          <div v-if="form.weight" class="flex items-center gap-4 rounded-2xl border-4 border-[#445944] bg-[#FCF4E5] p-5 shadow-[4px_4px_0px_#445944] transition-all">
            <span class="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[#445944] bg-white text-2xl shadow-[2px_2px_0px_#445944]">⚖️</span>
            <div>
              <p class="text-lg font-black text-[#445944]">{{ form.weight }} KG</p>
              <p class="text-xs font-bold text-gray-500">{{ form.recordDate }}</p>
            </div>
          </div>

          <!-- 提交按鈕 -->
          <div class="pt-4">
            <button
              @click="submitForm"
              :disabled="submitting"
              class="w-full rounded-2xl border-2 border-[#445944] bg-[#445944] py-4 text-lg font-black text-white shadow-[4px_4px_0px_#445944] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#445944] disabled:opacity-50 disabled:cursor-not-allowed">
              {{ submitting ? '儲存中...' : '完成新增' }}
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
