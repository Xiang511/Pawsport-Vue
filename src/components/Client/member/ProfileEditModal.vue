<script setup>
import { ref, watch } from 'vue'
import { CheckCircle } from 'lucide-vue-next'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  editForm: { type: Object, required: true },
  isSaving: { type: Boolean, default: false },
  isLoadingForm: { type: Boolean, default: false },
  saveError: { type: String, default: '' },
  avatarInitials: { type: String, default: 'U' },
})

const emit = defineEmits(['update:modelValue', 'save'])

// Modal 開啟時建立表單的本地副本，避免直接修改 prop
const localForm = ref({})

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) localForm.value = { ...props.editForm }
  },
)

const handleSave = () => emit('save', { ...localForm.value })
const handleClose = () => emit('update:modelValue', false)
</script>

<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    @click.self="handleClose">
    <Transition name="modal">
      <div v-if="modelValue" class="mt-40 flex h-[70%] w-full max-w-lg justify-center">
        <div
          class="w-full rounded-3xl border-4 border-[#445944] bg-[#FCF4E5] p-8 shadow-[8px_8px_0px_#445944]">
          <div class="mb-6 flex items-center justify-between">
            <h2 class="font-fredoka text-2xl font-black text-[#445944]">編輯個人資料</h2>
            <button
              @click="handleClose"
              class="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-[#445944] bg-white shadow-[2px_2px_0px_#445944] hover:bg-red-50">
              ✕
            </button>
          </div>

          <!-- 資料載入中 -->
          <div v-if="isLoadingForm" class="flex items-center justify-center py-16">
            <span class="animate-pulse text-sm font-bold text-[#445944]">資料載入中...</span>
          </div>

          <div v-else class="max-h-[50vh] space-y-5 overflow-y-auto pr-1">
            <div class="space-y-4">
              <!-- 電子郵件（唯讀） -->
              <div>
                <label class="mb-1.5 block text-sm font-bold text-gray-700">
                  電子郵件
                  <span class="ml-1 text-xs font-normal text-gray-400">（不可修改）</span>
                </label>
                <input
                  :value="localForm.email"
                  type="email"
                  disabled
                  class="w-full cursor-not-allowed rounded-2xl border-2 border-gray-200 bg-gray-100 px-4 py-3 text-sm font-bold text-gray-400" />
              </div>

              <!-- 頭像網址 -->
              <div>
                <label class="mb-1.5 block text-sm font-bold text-gray-700">頭像網址</label>
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-[#445944] bg-[#445944]">
                    <img
                      v-if="localForm.photo"
                      :src="localForm.photo"
                      class="h-full w-full object-cover"
                      alt="頭像預覽"
                      @error="localForm.photo = ''" />
                    <span v-else class="text-lg font-black text-[#FAE4AE]">
                      {{ avatarInitials }}
                    </span>
                  </div>
                  <input
                    v-model="localForm.photo"
                    type="text"
                    placeholder="貼上圖片網址"
                    class="flex-1 rounded-2xl border-2 border-gray-300 bg-white px-4 py-3 text-sm font-bold focus:border-[#445944] focus:ring-2 focus:ring-[#445944]/20 focus:outline-none" />
                </div>
              </div>

              <!-- 姓名 -->
              <div>
                <label class="mb-1.5 block text-sm font-bold text-gray-700">姓名 / 暱稱</label>
                <input
                  v-model="localForm.name"
                  type="text"
                  placeholder="請輸入姓名"
                  class="w-full rounded-2xl border-2 border-gray-300 bg-white px-4 py-3 text-sm font-bold focus:border-[#445944] focus:ring-2 focus:ring-[#445944]/20 focus:outline-none" />
              </div>

              <!-- 電話 -->
              <div>
                <label class="mb-1.5 block text-sm font-bold text-gray-700">電話</label>
                <input
                  v-model="localForm.phone"
                  type="tel"
                  placeholder="請輸入電話號碼"
                  maxlength="10"
                  class="w-full rounded-2xl border-2 border-gray-300 bg-white px-4 py-3 text-sm font-bold focus:border-[#445944] focus:ring-2 focus:ring-[#445944]/20 focus:outline-none" />
              </div>

              <!-- 職業 + 城市 -->
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="mb-1.5 block text-sm font-bold text-gray-700">職業</label>
                  <input
                    v-model="localForm.job"
                    type="text"
                    placeholder="例：學生、上班族"
                    class="w-full rounded-2xl border-2 border-gray-300 bg-white px-4 py-3 text-sm font-bold focus:border-[#445944] focus:ring-2 focus:ring-[#445944]/20 focus:outline-none" />
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-bold text-gray-700">居住城市</label>
                  <input
                    v-model="localForm.city"
                    type="text"
                    placeholder="例：台北市"
                    class="w-full rounded-2xl border-2 border-gray-300 bg-white px-4 py-3 text-sm font-bold focus:border-[#445944] focus:ring-2 focus:ring-[#445944]/20 focus:outline-none" />
                </div>
              </div>

              <!-- 生日 -->
              <div>
                <label class="mb-1.5 block text-sm font-bold text-gray-700">生日</label>
                <input
                  v-model="localForm.birthday"
                  type="date"
                  class="w-full rounded-2xl border-2 border-gray-300 bg-white px-4 py-3 text-sm font-bold focus:border-[#445944] focus:ring-2 focus:ring-[#445944]/20 focus:outline-none" />
              </div>

              <!-- 個人簡介 -->
              <div>
                <label class="mb-1.5 block text-sm font-bold text-gray-700">個人簡介</label>
                <textarea
                  v-model="localForm.note"
                  rows="3"
                  placeholder="介紹一下自己和你的毛孩..."
                  class="w-full resize-none rounded-2xl border-2 border-gray-300 bg-white px-4 py-3 text-sm font-bold focus:border-[#445944] focus:ring-2 focus:ring-[#445944]/20 focus:outline-none" />
              </div>

              <!-- 飼養經驗 + 訂閱電子報 -->
              <div class="grid grid-cols-2 gap-3">
                <label
                  class="flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-gray-300 bg-white px-4 py-3 transition-colors"
                  :class="localForm.hasPriorExp ? 'border-[#445944] bg-[#D4E6D0]' : ''">
                  <input
                    v-model="localForm.hasPriorExp"
                    type="checkbox"
                    class="h-4 w-4 accent-[#445944]" />
                  <span class="text-sm font-bold text-gray-700">有飼養經驗</span>
                </label>
                <label
                  class="flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-gray-300 bg-white px-4 py-3 transition-colors"
                  :class="localForm.isSubscribe ? 'border-[#445944] bg-[#D4E6D0]' : ''">
                  <input
                    v-model="localForm.isSubscribe"
                    type="checkbox"
                    class="h-4 w-4 accent-[#445944]" />
                  <span class="text-sm font-bold text-gray-700">訂閱電子報</span>
                </label>
              </div>

              <!-- 錯誤訊息 -->
              <p
                v-if="saveError"
                class="rounded-xl border-2 border-red-300 bg-red-50 px-4 py-2 text-sm font-bold text-red-600">
                {{ saveError }}
              </p>

              <!-- 操作按鈕 -->
              <div class="flex gap-3 pt-2">
                <button
                  @click="handleSave"
                  :disabled="isSaving"
                  class="flex-1 rounded-2xl border-2 border-[#445944] bg-[#445944] py-3 text-sm font-bold text-white transition-all hover:translate-x-[2px] hover:translate-y-[2px] disabled:translate-x-0 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60">
                  <CheckCircle class="mr-1.5 inline" :size="16" />
                  {{ isSaving ? '儲存中...' : '儲存變更' }}
                </button>
                <button
                  @click="handleClose"
                  :disabled="isSaving"
                  class="flex-1 rounded-2xl border-2 border-[#445944] bg-white py-3 text-sm font-bold text-[#445944] transition-all hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-60">
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-thumb {
  background: #445944;
  border-radius: 9999px;
}
</style>
