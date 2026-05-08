<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Modal from '@/components/Tailadmin/ui/Modal.vue'
import { EditIcon, Trash2 } from 'lucide-vue-next'

// 資料狀態
const skins = ref([])
const isLoading = ref(false)
const isModalOpen = ref(false)
const isSubmitting = ref(false)

// 編輯狀態
const isEditMode = ref(false)
const editingId = ref(null)

// 1. 定義初始狀態 (與截圖欄位對齊)
const getInitialSkinState = () => ({
  SkinName: '',
  Description: '',
  Price: 0,
  IsAvailable: true, // 你的 Service 用 IsAvailable
  ImageBase64: '', // 用於上傳
  SkinImage: '', // 用於顯示現有圖片
})

const newSkin = ref(getInitialSkinState())

// 取得資料
const fetchSkins = async () => {
  isLoading.value = true
  try {
    const response = await axios.get('https://localhost:7048/api/Shop')
    if (response.data && response.data.success) {
      skins.value = response.data.data
    }
  } catch (error) {
    console.error('抓取失敗:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchSkins()
})

const closeModal = () => {
  isModalOpen.value = false
  isEditMode.value = false
  editingId.value = null
  newSkin.value = getInitialSkinState()
}

const openModal = (item = null) => {
  if (item) {
    isEditMode.value = true
    editingId.value = item.skinId
    newSkin.value = {
      SkinName: item.skinName,
      Description: item.description,
      Price: item.price,
      IsAvailable: item.isAvailable,
      SkinImage: item.skinImage ? `https://localhost:7048${item.skinImage}` : '',
      ImageBase64: '', // 編輯時若沒重選檔案則保持空
    }
  } else {
    isEditMode.value = false
    newSkin.value = getInitialSkinState()
  }
  isModalOpen.value = true
}

const saveSkin = async () => {
  isSubmitting.value = true
  try {
    const payload = {
      SkinId: isEditMode.value ? editingId.value : 0,
      SkinName: newSkin.value.SkinName,
      Description: newSkin.value.Description,
      Price: newSkin.value.Price,
      IsAvailable: newSkin.value.IsAvailable,
      ImageBase64: newSkin.value.ImageBase64, // 後端會處理這個字串
    }

    if (isEditMode.value) {
      await axios.put(`https://localhost:7048/api/Shop/${editingId.value}`, payload)
    } else {
      await axios.post('https://localhost:7048/api/Shop', payload)
    }

    alert('儲存成功')
    closeModal()
    fetchSkins()
  } catch (error) {
    console.error('儲存失敗:', error)
  } finally {
    isSubmitting.value = false
  }
}

// 刪除功能也順便補給你
const deleteSkin = async (id) => {
  if (!confirm('確定要從商店移除這個造型嗎？這可能影響玩家的持有紀錄！')) return

  try {
    const response = await axios.delete(`https://localhost:7048/api/Shop/${id}`)
    if (response.data && response.data.success) {
      alert('造型已成功刪除')
      await fetchSkins()
    }else {
      alert('刪除失敗：' + (response.data?.message || '伺服器拒絕請求'))
    }
  } catch (error) {
    console.error('刪除失敗:', error)

    if (error.response) {
      // 伺服器有回應但狀態碼錯誤 (如 404 或 500)
      alert(`刪除失敗 (${error.response.status})：${error.response.data?.message || '後端發生錯誤'}`)
    } else if (error.request) {
      // 請求發出但沒收到回應
      alert('無法連線到伺服器，請檢查後端服務是否正常。')
    } else {
      alert('發生錯誤：' + error.message)
    }
  }
}

// 處理圖片檔案上傳
const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    const base64Data = e.target.result
    // 這裡存入 ImageBase64 供後端存檔
    newSkin.value.ImageBase64 = base64Data
    // 同時更新 SkinImage 讓預覽圖能立刻切換到新選的圖片
    newSkin.value.SkinImage = base64Data
  }
  reader.readAsDataURL(file)
}
</script>

<template>
  <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <h2 class="text-title-md text-gray-800 dark:text-white/90">商店管理</h2>
    <button
      @click="openModal()"
      class="bg-brand-success-500 text-theme-sm hover:bg-brand-success-600 shadow-theme-sm text-white inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-xl transition-all active:scale-95">
      新增造型
    </button>
  </div>

  <div
    class="rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03]">
    <div class="max-w-full overflow-x-auto">
      <table class="w-full table-fixed border-collapse text-center">
        <thead>
          <tr class="border-b border-gray-100 text-sm text-gray-500 dark:border-gray-800">
            <th class="w-[10%] text-theme-xl px-4 py-4 tracking-wider text-gray-500 uppercase dark:text-white/90">編號</th>
            <th class="w-[10%] text-theme-xl px-4 py-4 tracking-wider text-gray-500 uppercase dark:text-white/90">造型名稱</th>
            <th class="w-[15%] text-theme-xl px-4 py-4 tracking-wider text-gray-500 uppercase dark:text-white/90">圖片</th>
            <th class="w-[25%] text-theme-xl px-4 py-4 tracking-wider text-gray-500 uppercase dark:text-white/90">描述</th>
            <th class="w-[10%] text-theme-xl px-4 py-4 tracking-wider text-gray-500 uppercase dark:text-white/90">價格</th>
            <th class="w-[10%] text-theme-xl px-4 py-4 tracking-wider text-gray-500 uppercase dark:text-white/90">是否上架</th>
            <th class="w-[20%] text-theme-xl px-4 py-4 tracking-wider text-gray-500 uppercase dark:text-white/90">動作</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
          <tr v-if="isLoading">
            <td colspan="7" class="py-10 text-center text-gray-500">資料載入中...</td>
          </tr>

          <tr
            v-for="(item, index) in skins"
            :key="item.skinId"
            class="transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.02]">
            <td class="text-theme-sm px-4 py-4 text-center text-gray-500 dark:text-white/90">{{ index + 1 }}</td>
            <td class="text-theme-sm px-4 py-4 text-center text-gray-500 dark:text-white/90">{{ item.skinName }}</td>
            <td class="px-2 py-4">
              <div class="flex justify-center">
                <div
                  class="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg bg-gray-200">
                  <img
                    v-if="item.skinImage"
                    :src="'https://localhost:7048' + item.skinImage"
                    class="h-full w-full object-cover" />
                  <span v-else class="text-[10px] text-gray-400">No Image</span>
                </div>
              </div>
            </td>
            <td class="text-theme-sm px-4 py-4 text-center text-gray-500 dark:text-white/90">
              {{ item.description }}
            </td>
            <td class="text-theme-sm px-4 py-4 text-center text-gray-500 dark:text-white/90">{{ item.price }}</td>
            <td class="px-2 py-4">
              <span :class="item.isAvailable ? 'text-brand-success-600' : 'text-brand-error-400'">
                {{ item.isAvailable ? '是' : '否' }}
              </span>
            </td>
            <td class="px-4 py-4">
              <div class="flex items-center justify-center gap-2">
                <button
                  @click="openModal(item)"
                  class="bg-brand-success-500 text-theme-xl hover:bg-brand-success-600 shadow-theme-sm text-white inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 transition-all active:scale-95">
                  <EditIcon />
                </button>
                <button
                  @click="deleteSkin(item.skinId)"
                  class="bg-brand-error-500 text-theme-xl hover:bg-brand-error-600 shadow-theme-sm text-white inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 transition-all active:scale-95">
                  <Trash2 />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <Modal v-if="isModalOpen" :fullScreenBackdrop="false" @close="closeModal">
    <template #body>
      <div class="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" @click="closeModal"></div>
      <div
        class="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-gray-900">
        <div
          class="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <h3 class="text-xl text-gray-800 dark:text-white">
            {{ isEditMode ? '編輯造型' : '新增造型' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 transition-colors hover:text-gray-600">
            <span class="text-2xl">&times;</span>
          </button>
        </div>

        <div class="custom-scrollbar max-h-[75vh] space-y-4 overflow-y-auto p-6">
          <div>
            <label class="text-theme-sm mb-1 block font-medium text-gray-800 dark:text-white">
              造型名稱
              <span class="text-red-500">*</span>
            </label>
            <input
              v-model="newSkin.SkinName"
              type="text"
              placeholder="例如：黃金雄獅"
              class="text-theme-sm focus:border-brand-500 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none dark:bg-gray-900 dark:text-gray-500" />
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div class="sm:col-span-3">
              <label class="text-theme-sm mb-1 block font-medium text-gray-800 dark:text-white">
                上傳造型圖片
                <span class="text-xs text-gray-400">(建議 1:1 比例)</span>
              </label>
              <input
                type="file"
                accept="image/*"
                @change="handleFileUpload"
                class="text-theme-sm file:bg-brand-success-50 file:text-white hover:file:bg-brand-success-100 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none file:mr-4 file:rounded-md file:border-0 file:px-4 file:py-1 file:text-sm  dark:bg-gray-900 dark:text-gray-500" />
            </div>
            <div class="flex flex-col items-center">
              <span class="text-theme-sm mb-1 block font-medium text-gray-800 dark:text-white">
                預覽
              </span>
              <div class="h-16 w-16 overflow-hidden rounded-lg border border-gray-200">
                <img
                  v-if="newSkin.SkinImage"
                  :src="newSkin.SkinImage"
                  class="h-full w-full object-cover" />
                <span v-else class="text-[10px] text-gray-400">無圖片</span>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-theme-sm mb-1 block font-medium text-gray-800 dark:text-white">
                價格 (點數)
                <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="newSkin.Price"
                type="number"
                class="text-theme-sm focus:border-brand-500 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none dark:bg-gray-900 dark:text-gray-500" />
            </div>
            <div>
              <label class="text-theme-sm mb-1 block font-medium text-gray-800 dark:text-white">
                是否上架
              </label>
              <select
                v-model="newSkin.IsAvailable"
                class="text-theme-sm focus:border-brand-500 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none dark:bg-gray-900 dark:text-gray-500">
                <option :value="true">是 (上架)</option>
                <option :value="false">否 (下架)</option>
              </select>
            </div>
          </div>

          <div>
            <label class="text-theme-sm mb-1 block font-medium text-gray-800 dark:text-white">
              造型描述
            </label>
            <textarea
              v-model="newSkin.Description"
              rows="4"
              placeholder="輸入該造型的詳細介紹..."
              class="text-theme-sm focus:border-brand-500 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none dark:bg-gray-900 dark:text-gray-500"></textarea>
          </div>
        </div>

        <div
          class="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50/50 px-6 py-4 dark:border-gray-800 dark:bg-gray-900/50">
          <button
            @click="saveSkin"
            :disabled="isSubmitting"
            class="bg-brand-success-500 text-white dark:text-white flex items-center gap-2 rounded-lg px-6 py-2.5 transition-all active:scale-95 disabled:opacity-50">
            <span v-if="isSubmitting" class="animate-spin text-lg">⏳</span>
            {{ isSubmitting ? '處理中...' : isEditMode ? '確認修改' : '確認新增' }}
          </button>
          <button
            @click="closeModal"
            class="rounded-lg border border-gray-300 bg-white px-6 py-2.5 font-semibold text-gray-700 transition-all hover:bg-gray-50 active:scale-95">
            取消
          </button>
        </div>
      </div>
    </template>
  </Modal>
</template>
