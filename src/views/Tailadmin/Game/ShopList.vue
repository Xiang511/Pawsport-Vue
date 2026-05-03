<script setup>
import { ref } from 'vue'
import Modal from '@/components/Tailadmin/ui/Modal.vue'

// 測試用的假資料 (Mock Data)
const skins = ref([
  { id: 1, name: '黃金雄獅', image: '/images/skins/lion.jpg', description: '擁有耀眼金鬃的萬獸之王，象徵至高無上的權力。', price: 1200, isPublish: true },
  { id: 2, name: '極地寒狐', image: '/images/skins/fox.jpg', description: '來自北極荒原的靈狐，周身環繞著淡淡的冰霜氣息。', price: 800, isPublish: true },
  { id: 3, name: '翠竹大貓熊', image: '/images/skins/panda.jpg', description: '身著傳統武術服飾的貓熊，看起來既憨厚又威猛。', price: 750, isPublish: true },
  { id: 4, name: '熔岩巨猩', image: '/images/skins/gorilla.jpg', description: '體表覆蓋著流動岩漿的巨獸，每一步都能震碎大地。', price: 1500, isPublish: true },
  { id: 5, name: '機械蒼鷹', image: '/images/skins/eagle.jpg', description: '全身由精密零件打造的空中偵察兵，具備雷射瞄準器。', price: 1100, isPublish: true },
])

const isModalOpen = ref(false)
const newSkin = ref({
  name: '',
  image: '',
  description: '',
  price: 0,
  isPublish: true
})

const openModal = () => { isModalOpen.value = true }
const closeModal = () => { isModalOpen.value = false }

const saveSkin = () => {
  // 儲存邏輯
  console.log('Saving Skin:', newSkin.value)
  closeModal()
}
</script>

<template>
  <!-- 頁面頂部：標題 + 新增按鈕 -->
  <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h2 class="text-2xl font-bold text-gray-800">商店管理</h2>
    </div>
    <button
      @click="openModal"
      class="bg-brand-info-500 text-theme-sm hover:bg-brand-info-600 shadow-theme-sm inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 font-semibold text-white transition-all active:scale-95"
    > 新增造型
    </button>
  </div>

  <!-- 表格 -->
  <div class="rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03]">
    <div class="max-w-full overflow-x-auto">
      <table class="w-full table-auto border-collapse">
        <thead>
          <tr class="border-b border-gray-200 text-center dark:border-gray-700">
            <th class="text-theme-sm px-4 py-4 font-medium text-gray-500">編號</th>
            <th class="text-theme-sm px-4 py-4 font-medium text-gray-500">造型名稱</th>
            <th class="text-theme-sm px-4 py-4 font-medium text-gray-500">圖片</th>
            <th class="text-theme-sm px-4 py-4 font-medium text-gray-500 text-left">描述</th>
            <th class="text-theme-sm px-4 py-4 font-medium text-gray-500">價格</th>
            <th class="text-theme-sm px-4 py-4 font-medium text-gray-500">狀態</th>
            <th class="text-theme-sm px-4 py-4 font-medium text-gray-500">動作</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-100 dark:divide-gray-800 text-center">
          <tr v-for="skin in skins" :key="skin.id" class="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
            <td class="text-theme-sm px-4 py-4 text-gray-800 dark:text-white/90">{{ skin.id }}</td>
            <td class="text-theme-sm px-4 py-4 font-bold text-gray-700">{{ skin.name }}</td>
            
            <!-- 圖片預覽格 -->
            <td class="px-4 py-4">
              <div class="mx-auto h-16 w-16 overflow-hidden rounded-lg border border-gray-100 bg-gray-100 flex items-center justify-center text-[10px] text-gray-400">
                <!-- 這裡未來放 <img> 標籤 -->
                <span class="p-1 leading-tight">{{ skin.name }}<br>Image</span>
              </div>
            </td>
            
            <td class="text-theme-sm max-w-md px-4 py-4 text-left text-gray-500 leading-relaxed">{{ skin.description }}</td>
            <td class="text-theme-sm px-4 py-4 font-semibold text-gray-800">{{ skin.price }}</td>
            
            <td class="px-4 py-4">
              <span 
                :class="skin.isPublish ? 'text-brand-success-900 bg-brand-success-50' : 'text-error-600 bg-error-50'"
                class="text-theme-sm rounded-full px-4 py-1 font-medium"
              >
                {{ skin.isPublish ? '上架' : '下架' }}
              </span>
            </td>

            <td class="px-4 py-4">
              <div class="flex items-center justify-center gap-2">
                <button class="bg-brand-warning-500 text-theme-xs hover:bg-brand-warning-600 shadow-theme-sm flex items-center gap-1 rounded px-3 py-1.5 font-bold text-white transition-all active:scale-95">
                  編輯
                </button>
                <button class="bg-brand-error-500 text-theme-xs hover:bg-brand-error-600 shadow-theme-sm flex items-center gap-1 rounded px-3 py-1.5 font-bold text-white transition-all active:scale-95">
                  刪除
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Modal: 新增造型 -->
  <Modal v-if="isModalOpen" :fullScreenBackdrop="false" @close="closeModal">
    <template #body>
      <div class="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" @click="closeModal"></div>
      <div class="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-gray-900">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <h3 class="text-xl font-bold text-gray-800 dark:text-white">新增造型</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <span class="text-2xl">&times;</span>
          </button>
        </div>

        <!-- Body -->
        <div class="custom-scrollbar max-h-[70vh] space-y-4 overflow-y-auto p-6">
          <div>
            <label class="text-theme-sm mb-1 block font-medium text-gray-700">造型名稱 <span class="text-error-500">*</span></label>
            <input v-model="newSkin.name" type="text" placeholder="例如：黃金雄獅" class="text-theme-sm focus:border-brand-500 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none" />
          </div>

          <div>
            <label class="text-theme-sm mb-1 block font-medium text-gray-700">描述 <span class="text-error-500">*</span></label>
            <textarea v-model="newSkin.description" rows="3" placeholder="輸入造型描述..." class="text-theme-sm focus:border-brand-500 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none"></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-theme-sm mb-1 block font-medium text-gray-700">價格 <span class="text-error-500">*</span></label>
              <input v-model="newSkin.price" type="number" class="text-theme-sm focus:border-brand-500 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none" />
            </div>
            <div>
              <label class="text-theme-sm mb-1 block font-medium text-gray-700">上架狀態</label>
              <select v-model="newSkin.isPublish" class="text-theme-sm focus:border-brand-500 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none">
                <option :value="true">上架</option>
                <option :value="false">下架</option>
              </select>
            </div>
          </div>

          <div>
          <label class="text-theme-sm mb-1 block font-medium text-gray-700">
            造型圖片 <span class="text-error-500">*</span>
          </label>
          <input 
            type="file" 
            accept="image/*"
            class="text-theme-sm w-full cursor-pointer rounded-lg border border-gray-300 bg-white outline-none 
                   file:mr-4 file:border-0 file:bg-gray-100 file:px-4 file:py-2 
                   file:text-gray-600 file:font-semibold hover:file:bg-gray-200"
          />
          <p class="mt-1 text-xs text-gray-400">支援 JPG, PNG 格式</p>
        </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50/50 px-6 py-4 dark:border-gray-800">
          <button @click="saveSkin" class="bg-brand-info-500 text-theme-sm hover:bg-brand-info-600 shadow-theme-sm rounded-lg px-5 py-2 font-semibold text-white active:scale-95">新增造型</button>
          <button @click="closeModal" class="text-theme-sm rounded-lg border border-gray-300 bg-white px-5 py-2 font-semibold text-gray-700 hover:bg-gray-50 active:scale-95">取消</button>
        </div>
      </div>
    </template>
  </Modal>
</template>