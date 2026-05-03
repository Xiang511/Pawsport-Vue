<script setup>
import { ref } from 'vue'
import PlusIcon from '@/components/Tailadmin/icons/PlusIcon.vue'
import Modal from '@/components/Tailadmin/ui/Modal.vue'
// import SelectInput from '@/components/Tailadmin/forms/FormElements/SelectInput.vue'

// 測試用的資料 (Mock Data)
const questions = ref([
  {
    gameId: 1,
    gameName: '認養須知',
    questions: '夏季氣溫高，將寵物單獨留在熄火且窗戶緊閉的車內，即使只有十分鐘也是危險且違法的。',
    answers: '是',
    answersDetail: '車內高溫會迅速導致寵物中暑、器官衰竭甚至死亡，這屬於虐待行為。',
    isActive: true,
    rewards: 10,
    type: '問答',
  },
  {
    gameId: 2,
    gameName: '認養須知',
    questions: '若毛孩不小心走失，只要有植入晶片，就不需要去報案或掛失，等通知就好。',
    answers: '否',
    answersDetail:
      '發現走失應立即聯繫寵物登記站點掛失，並透過社群、鄰里擴大搜尋，主動出擊成功率更高。',
    isActive: true,
    rewards: 10,
    type: '問答',
  },
])
const isModalOpen = ref(false)
const newQuestion = ref({
  gameName: '',
  questions: '',
  answers: '',
  answersDetail: '',
  rewards: 0,
  type: '問答',
  isActive: true,
})
const openModal = () => {
  isModalOpen.value = true
}
const closeModal = () => {
  isModalOpen.value = false
}
</script>

<template>
  <!-- 頁面頂部：標題 + 新增按鈕 + 篩選功能 -->
  <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div class="flex items-center gap-6">
      <h2 class="text-2xl font-bold text-gray-800">題庫管理</h2>

      <div class="flex items-center gap-2">
        <span class="text-theme-sm font-medium whitespace-nowrap text-gray-500">
          按照題目類型篩選：
        </span>
        <select
          v-model="selectedCategory"
          class="text-theme-sm focus:border-brand-info-500 focus:shadow-focus-ring rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-gray-700 transition-all outline-none">
          <option value="">-- 全部 --</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>
    </div>
    <button
      @click="openModal"
      class="bg-brand-info-500 text-theme-sm hover:bg-brand-info-600 shadow-theme-sm inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 font-semibold text-white transition-all active:scale-95">
      新增題目
    </button>
  </div>

  <!-- 表格 -->
  <div
    class="rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03]">
    <div class="max-w-full overflow-x-auto">
      <table class="w-full table-auto border-collapse">
        <thead>
          <tr class="border-b border-gray-100 dark:border-gray-800 text-center">
            <th class="px-4 py-4 font-semibold text-gray-500 text-theme-sm uppercase tracking-wider">編號</th>
            <th class="px-4 py-4 font-semibold text-gray-500 text-theme-sm uppercase tracking-wider">題目類型</th>
            <th class="px-4 py-4 font-semibold text-gray-500 text-theme-sm uppercase tracking-wider">題目內容</th>
            <th class="px-4 py-4 font-semibold text-gray-500 text-theme-sm uppercase tracking-wider">詳細解答</th>
            <th class="px-4 py-4 font-semibold text-gray-500 text-theme-sm uppercase tracking-wider">Y/N</th>
            <th class="px-4 py-4 font-semibold text-gray-500 text-theme-sm uppercase tracking-wider">狀態</th>
            <th class="px-4 py-4 font-semibold text-gray-500 text-theme-sm uppercase tracking-wider">獎勵</th>
            <th class="px-4 py-4 font-semibold text-gray-500 text-theme-sm uppercase tracking-wider">形式</th>
            <th class="px-4 py-4 font-semibold text-gray-500 text-theme-sm uppercase tracking-wider">動作</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-100 dark:divide-gray-800 ">
          <tr
            v-for="(item, index) in questions"
            :key="item.gameId"
            class="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
            <td class="text-theme-sm px-4 py-4 text-gray-800 dark:text-white/90 text-center">
              {{ index + 1 }}
            </td>
            <td class="text-theme-sm px-4 py-4 text-gray-500 text-center">{{ item.gameName }}</td>
            <td class="text-theme-sm max-w-xs px-4 py-4 text-gray-500 text-left">{{ item.questions }}</td>
            <td class="text-theme-sm max-w-xs px-4 py-4 text-gray-500 text-left">{{ item.answersDetail }}</td>
            <td class="px-4 py-4 text-center">
              <input
                type="checkbox"
                :checked="item.answers === '是'"
                disabled
                class="accent-primary h-4 w-4 rounded border-gray-300" />
            </td>
            <td class="px-4 py-4 text-center">
              <span
                :class="
                  item.isActive
                    ? 'text-brand-success-900 bg-brand-success-50'
                    : 'text-error-600 bg-error-50'
                "
                class="text-theme-sm rounded-full px-3 py-1 font-medium">
                {{ item.isActive ? '啟用' : '停用' }}
              </span>
            </td>
            <td class="text-theme-sm px-4 py-4 text-center text-gray-500">{{ item.rewards }}</td>
            <td class="text-theme-sm px-4 py-4 text-center text-gray-500">{{ item.type }}</td>
            <td class="px-4 py-4 text-center">
              <div class="flex items-center justify-center gap-2">
                <button
                  class="bg-brand-warning-800 text-theme-sm hover:bg-brand-warning-900 shadow-theme-sm inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 font-semibold text-white transition-all active:scale-95">
                  編輯
                </button>
                <button
                  class="bg-brand-error-500 text-theme-sm hover:bg-brand-error-600 shadow-theme-sm inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 font-semibold text-white transition-all active:scale-95">
                  刪除
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Modal 新增題目-->
  <Modal v-if="isModalOpen" :fullScreenBackdrop="false" @close="closeModal">
    <template #body>
      <div class="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" @click="closeModal"></div>
      <div
        class="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-gray-900">
        <!-- Header -->
        <div
          class="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <h3 class="text-xl font-bold text-gray-800 dark:text-white">新增題目</h3>
          <button @click="closeModal" class="text-gray-400 transition-colors hover:text-gray-600">
            <span class="text-2xl">&times;</span>
          </button>
        </div>

        <!-- Body (表單內容) -->
        <div class="custom-scrollbar max-h-[70vh] space-y-4 overflow-y-auto p-6">
          <!-- 題目類型 -->
          <div>
            <label class="text-theme-sm mb-1 block font-medium text-gray-700">
              題目類型
              <span class="text-error-500">*</span>
            </label>
            <input
              v-model="newQuestion.gameName"
              type="text"
              placeholder="輸入題目類型"
              class="text-theme-sm focus:border-brand-500 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none" />
          </div>

          <!-- 題目內容 -->
          <div>
            <label class="text-theme-sm mb-1 block font-medium text-gray-700">
              題目內容
              <span class="text-error-500">*</span>
            </label>
            <textarea
              v-model="newQuestion.questions"
              rows="3"
              placeholder="輸入題目內容"
              class="text-theme-sm focus:border-brand-500 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none"></textarea>
          </div>

          <!-- 正確答案 -->
          <div>
            <label class="text-theme-sm mb-1 block font-medium text-gray-700">
              正確答案
              <span class="text-error-500">*</span>
            </label>
            <select
              v-model="newQuestion.answers"
              class="text-theme-sm focus:border-brand-500 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none">
              <option value="">-- 請選擇 --</option>
              <option value="是">是 (Yes)</option>
              <option value="否">否 (No)</option>
            </select>
          </div>

          <!-- 詳細解答 -->
          <div>
            <label class="text-theme-sm mb-1 block font-medium text-gray-700">
              詳細解答
              <span class="text-error-500">*</span>
            </label>
            <textarea
              v-model="newQuestion.answersDetail"
              rows="3"
              placeholder="輸入詳細解答"
              class="text-theme-sm focus:border-brand-500 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none"></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
          <!-- 解題獎勵 -->
          <div>
            <label class="text-theme-sm mb-1 block font-medium text-gray-700">
              解題獎勵 (點數) <span class="text-error-500">*</span>
            </label>
            <input
              v-model="newQuestion.rewards"
              type="number"
              placeholder="輸入獎勵點數"
              class="text-theme-sm focus:border-brand-500 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none transition-all" />
          </div>

          <!-- 啟用狀態 (改回 Select 方式) -->
          <div>
            <label class="text-theme-sm mb-1 block font-medium text-gray-700">
              啟用狀態 <span class="text-error-500">*</span>
            </label>
            <select
              v-model="newQuestion.isActive"
              class="text-theme-sm focus:border-brand-500 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none transition-all">
              <option :value="true">啟用</option>
              <option :value="false">停用</option>
            </select>
          </div>
        </div>

          <!-- 題目形式 (唯讀範例) -->
          <div>
            <label class="text-theme-sm mb-1 block font-medium text-gray-700">題目形式</label>
            <input
              v-model="newQuestion.type"
              type="text"
              readonly
              class="text-theme-sm w-full rounded-lg border border-gray-100 bg-gray-50 px-4 py-2 text-gray-500" />
            </div>

        </div>

        <!-- Footer -->
        <div
          class="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50/50 px-6 py-4 dark:border-gray-800">
          <button
            @click="saveQuestion"
            class="bg-brand-info-500 text-theme-sm hover:bg-brand-info-600 shadow-theme-sm rounded-lg px-5 py-2 font-semibold text-white active:scale-95">
            新增題目
          </button>
          <button
            @click="closeModal"
            class="text-theme-sm rounded-lg border border-gray-300 bg-white px-5 py-2 font-semibold text-gray-700 hover:bg-gray-50 active:scale-95">
            取消
          </button>
        </div>
      </div>
    </template>
  </Modal>
</template>