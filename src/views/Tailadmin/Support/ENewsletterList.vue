<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Mail, Plus, Edit, Trash2, X } from 'lucide-vue-next'

const newsletterData = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const isLoading = ref(false)

const loadNewsletterData = async (page = 1) => {
  isLoading.value = true
  try {
    const response = await fetch(`https://localhost:7048/api/Support/ENewsletter?page=${page}`)
    if (response.ok) {
      const data = await response.json()
      newsletterData.value = data.items || []
      totalPages.value = data.totalPages || 1
      currentPage.value = page
    }
  } catch (error) {
    console.error('取得電子報資料失敗:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadNewsletterData(1)
})

// 新增
const showCreateModal = ref(false)
const isSubmitting = ref(false)

const newNewsletter = reactive({
  title: '',
  content: '',
  status: '待發佈',
})

const openCreateModal = () => {
  newNewsletter.title = ''
  newNewsletter.content = ''
  newNewsletter.status = '待發佈'
  showCreateModal.value = true
}

const submitCreate = async () => {
  if (!newNewsletter.title || !newNewsletter.content) {
    alert('請填寫必填欄位 (*)')
    return
  }
  isSubmitting.value = true
  try {
    const response = await fetch('https://localhost:7048/api/Support/ENewsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newNewsletter),
    })
    if (response.ok) {
      showCreateModal.value = false
      loadNewsletterData(1)
      alert('電子報新增成功！')
    } else {
      alert('新增失敗，請檢查資料格式')
    }
  } catch (error) {
    console.error('API 錯誤:', error)
  } finally {
    isSubmitting.value = false
  }
}

// 修改
const showEditModal = ref(false)
const isEditing = ref(false)

const currentEditNewsletter = reactive({
  enewsletterId: 0,
  title: '',
  content: '',
  status: '',
})

const openEditModal = (item) => {
  currentEditNewsletter.newsletterId = item.newsletterid
  currentEditNewsletter.title = item.title
  currentEditNewsletter.content = item.content
  currentEditNewsletter.status = item.status || '待發佈'
  showEditModal.value = true
}

const submitEdit = async () => {
  if (!currentEditNewsletter.title || !currentEditNewsletter.content) {
    alert('請填寫必填欄位 (*)')
    return
  }
  isEditing.value = true
  try {
    const response = await fetch(
      `https://localhost:7048/api/Support/Newsletter/${currentEditNewsletter.newsletterId}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: currentEditNewsletter.title,
          content: currentEditNewsletter.content,
          status: currentEditNewsletter.status,
        }),
      },
    )
    if (response.ok) {
      showEditModal.value = false
      loadNewsletterData(currentPage.value)
      alert('電子報修改成功！')
    } else {
      alert('修改失敗，請檢查資料格式')
    }
  } catch (error) {
    console.error('API 錯誤:', error)
  } finally {
    isEditing.value = false
  }
}

// 刪除功能專區
const showDeleteModal = ref(false)
const isDeleting = ref(false)
const deleteTargetId = ref(null)

const openDeleteModal = (id) => {
  deleteTargetId.value = id
  showDeleteModal.value = true
}

const submitDelete = async () => {
  if (!deleteTargetId.value) return
  isDeleting.value = true
  try {
    const response = await fetch(
      `https://localhost:7048/api/Support/Newsletter/${deleteTargetId.value}`,
      {
        method: 'DELETE',
      },
    )
    if (response.ok) {
      showDeleteModal.value = false
      loadNewsletterData(currentPage.value)
      alert('刪除成功！')
    } else {
      alert('刪除失敗')
    }
  } catch (error) {
    console.error('API 錯誤:', error)
  } finally {
    isDeleting.value = false
    deleteTargetId.value = null
  }
}
</script>

<template>
  <div class="relative p-6">
    <div class="mb-6 flex items-center justify-between">
      <h2 class="flex items-center gap-2 text-2xl font-bold text-gray-800">
        <Mail class="text-brand-info-500 h-6 w-6" />
        電子報管理
      </h2>
      <button
        @click="openCreateModal"
        class="bg-brand-success-500 text-theme-sm hover:bg-brand-success-600 shadow-theme-sm inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-white transition-all active:scale-95"
        title="新增電子報">
        <Plus class="h-5 w-5" />
        新增電子報
      </button>
    </div>

    <div class="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table class="w-full text-left text-sm text-gray-600">
        <thead class="bg-gray-50 text-gray-700">
          <tr>
            <th class="px-6 py-4 font-semibold">建立日期</th>
            <th class="px-6 py-4 font-semibold">電子報標題</th>
            <th class="px-6 py-4 text-center font-semibold">狀態</th>
            <th class="w-32 px-6 py-4 text-center font-semibold">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-if="isLoading">
            <td colspan="4" class="py-8 text-center text-gray-500">資料載入中...</td>
          </tr>
          <tr v-else-if="newsletterData.length === 0">
            <td colspan="4" class="py-8 text-center text-gray-500">目前沒有電子報資料</td>
          </tr>
          <tr
            v-for="item in newsletterData"
            :key="item.newsletterid"
            class="transition-colors hover:bg-gray-50">
            <td class="px-6 py-4">{{ item.createat }}</td>
            <td class="px-6 py-4 font-medium text-gray-800">{{ item.title }}</td>
            <td class="px-6 py-4 text-center">
              <span
                :class="
                  item.status === '已發佈'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                "
                class="rounded-full px-2 py-1 text-xs font-medium">
                {{ item.status || '待發佈' }}
              </span>
            </td>
            <td class="px-6 py-4 text-center">
              <div class="flex items-center justify-center gap-2">
                <button
                  @click="openEditModal(item)"
                  class="bg-brand-info-500 hover:bg-brand-info-600 inline-flex items-center justify-center rounded-lg p-2 text-white transition-all active:scale-95"
                  title="編輯">
                  <Edit class="h-4 w-4" />
                </button>
                <button
                  @click="openDeleteModal(item.newsletterid)"
                  class="bg-brand-error-500 hover:bg-brand-error-600 inline-flex items-center justify-center rounded-lg p-2 text-white transition-all active:scale-95"
                  title="刪除">
                  <Trash2 class="h-4 w-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 新增 -->
    <div
      v-if="showCreateModal"
      class="bg-opacity-50 fixed inset-0 z-[9999] flex items-center justify-center bg-black px-4">
      <div class="mx-auto w-full max-w-2xl rounded-lg bg-white shadow-lg">
        <div class="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h3 class="text-xl font-bold text-gray-800">新增電子報</h3>
            <p class="mt-1 text-sm text-gray-500"><span class="text-red-500">* 必填 *</span></p>
          </div>
          <button @click="showCreateModal = false" class="text-gray-400 hover:text-gray-600">
            <X class="h-6 w-6" />
          </button>
        </div>
        <div class="space-y-4 p-6">
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">
              標題
              <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              v-model="newNewsletter.title"
              placeholder="例如：12月寵物領養快訊"
              class="focus:border-brand-info-500 focus:ring-brand-info-500 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-1 focus:outline-none" />
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">
              內容
              <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="newNewsletter.content"
              rows="6"
              class="focus:border-brand-info-500 focus:ring-brand-info-500 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-1 focus:outline-none"></textarea>
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">狀態</label>
            <select
              v-model="newNewsletter.status"
              class="focus:border-brand-info-500 focus:ring-brand-info-500 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-1 focus:outline-none">
              <option value="待發佈">待發佈</option>
              <option value="已發佈">已發佈</option>
            </select>
          </div>
        </div>
        <div class="flex items-center justify-between border-t border-gray-200 px-6 py-4">
          <button
            @click="showCreateModal = false"
            class="bg-brand-error-500 hover:bg-brand-error-600 rounded-md px-6 py-2.5 text-sm font-medium text-white transition-all active:scale-95">
            取消
          </button>
          <button
            @click="submitCreate"
            :disabled="isSubmitting"
            class="bg-brand-info-500 hover:bg-brand-info-600 flex items-center gap-2 rounded-md px-6 py-2.5 text-sm font-medium text-white transition-all active:scale-95 disabled:opacity-50">
            <span v-if="isSubmitting">處理中...</span>
            <span v-else>確認新增</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 修改 -->
    <div
      v-if="showEditModal"
      class="bg-opacity-50 fixed inset-0 z-[9999] flex items-center justify-center bg-black px-4">
      <div class="mx-auto w-full max-w-2xl rounded-lg bg-white shadow-lg">
        <div class="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h3 class="text-xl font-bold text-gray-800">修改電子報</h3>
          <button @click="showEditModal = false" class="text-gray-400 hover:text-gray-600">
            <X class="h-6 w-6" />
          </button>
        </div>
        <div class="space-y-4 p-6">
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">
              標題
              <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              v-model="currentEditNewsletter.title"
              class="focus:border-brand-info-500 focus:ring-brand-info-500 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-1 focus:outline-none" />
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">
              內容
              <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="currentEditNewsletter.content"
              rows="6"
              class="focus:border-brand-info-500 focus:ring-brand-info-500 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-1 focus:outline-none"></textarea>
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">狀態</label>
            <select
              v-model="currentEditNewsletter.status"
              class="focus:border-brand-info-500 focus:ring-brand-info-500 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-1 focus:outline-none">
              <option value="待發佈">待發佈</option>
              <option value="已發佈">已發佈</option>
            </select>
          </div>
        </div>
        <div class="flex items-center justify-between border-t border-gray-200 px-6 py-4">
          <button
            @click="showEditModal = false"
            class="rounded-md border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 active:scale-95">
            取消
          </button>
          <button
            @click="submitEdit"
            :disabled="isEditing"
            class="bg-brand-info-500 hover:bg-brand-info-600 flex items-center gap-2 rounded-md px-6 py-2.5 text-sm font-medium text-white transition-all active:scale-95 disabled:opacity-50">
            <span v-if="isEditing">處理中...</span>
            <span v-else>確認修改</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 刪除確認 -->
    <div
      v-if="showDeleteModal"
      class="bg-opacity-50 fixed inset-0 z-[9999] flex items-center justify-center bg-black px-4">
      <div class="mx-auto w-full max-w-md overflow-hidden rounded-lg bg-white shadow-lg">
        <div class="p-6 text-center">
          <div
            class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
            <Trash2 class="text-brand-error-500 h-8 w-8" />
          </div>
          <h3 class="mb-2 text-xl font-bold text-gray-800">確定要刪除嗎？</h3>
          <p class="text-sm text-gray-500">此動作執行後將無法復原，請確認是否繼續。</p>
        </div>
        <div class="flex items-center justify-center gap-4 bg-gray-50 px-6 py-4">
          <button
            @click="showDeleteModal = false"
            class="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 active:scale-95">
            取消
          </button>
          <button
            @click="submitDelete"
            :disabled="isDeleting"
            class="bg-brand-error-500 hover:bg-brand-error-600 w-full rounded-md px-4 py-2 text-sm font-medium text-white transition-all active:scale-95 disabled:opacity-50">
            <span v-if="isDeleting">處理中...</span>
            <span v-else>確定刪除</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
