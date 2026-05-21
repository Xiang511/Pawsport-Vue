<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { ArrowLeft, SquarePlus } from 'lucide-vue-next'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import Article_BaseButton from './Article_BaseButton.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const emit = defineEmits(['publish', 'save-draft', 'reset-id', 'load-draft', 'delete-draft'])

// 接收來自父組件傳入的分類和草稿陣列資料
const props = defineProps({
  categories: { type: Object, default: () => ({}) },
  drafts: { type: Array, default: () => [] },
})
const currentSubCategories = ref([])

const post = reactive({
  title: '',
  mainCategory: '',
  categoryId: '',
  content: '',
  tag: '',
})

//控制Quill的響應式變數
const editorRef = ref(null)
//存放new Quill()後產生的物件實體
let quillInstance = null

//頁面必須等quill載入
onMounted(() => {
  if (!editorRef.value) return
  // 初始化編輯器
  quillInstance = new Quill(editorRef.value, {
    theme: 'snow',
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, 4, false] }],
        [{ font: [] }],
        ['bold', 'italic', { script: 'sub' }, { script: 'super' }, 'strike', 'underline'],
        [{ color: [] }, { background: [] }],
        [{ indent: '-1' }, { indent: '+1' }, { align: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
        ['image', 'blockquote', 'link'],
        ['clean'],
      ],
    },
  })
})

// 封裝要外傳的完整資料包
const getFormData = () => {
  let finalTags = []
  if (Array.isArray(post.tag)) {
    // 未來：如果是標籤選擇器（已經是陣列），直接用
    finalTags = post.tag
  } else if (typeof post.tag === 'string' && post.tag.trim() !== '') {
    // 手動輸入字串（例如 "#貓咪 #飼料"）
    finalTags = post.tag
      .replace(/#/g, ' ') // 把所有 # 換成空格，這樣 "#貓咪" 就變成 "貓咪"
      .split(' ') // 用空格切開成陣列
      .map((t) => t.trim()) // 去除前後空白
      .filter((t) => t !== '') // 濾掉空字串
  }

  return {
    title: post.title,
    categoryId: Number(post.categoryId),
    // Quill 的 HTML 內文
    content: quillInstance ? quillInstance.root.innerHTML : '',
    // 傳送純文字陣列 ["貓咪", "飼料"]
    tagNames: finalTags,

    // 以下為後端需要的其他擴充欄位，前端先給預設
    userId: authStore.userInfo?.userId || authStore.userInfo?.id, // TODO: 從登入資訊取得真實 userId
    eventStartDate: null,
    eventEndDate: null,
    eventLocation: null,
  }
}

// 監聽大分類變化，自動更新小分類選項
watch(
  () => post.mainCategory,
  (newMain) => {
    if (newMain) {
      currentSubCategories.value = props.categories[newMain] || []
    } else {
      currentSubCategories.value = []
    }
    post.categoryId = ''
  },
)

// 點擊按鈕時，不自己發 API，而是透過 emit 丟給 View
const onSaveDraft = () => {
  emit('save-draft', getFormData())
}

const onSubmit = () => {
  if (!post.title.trim()) return alert('請填寫文章標題！')
  if (!post.mainCategory) return alert('請選擇文章大分類！')
  // 如果目前的大分類「有小分類存在」，但使用者卻沒選，才需要彈出警告
  if (currentSubCategories.value.length > 0 && !post.categoryId) {
    return alert('請選擇文章小分類！')
  }
  emit('publish', getFormData())
}

// 控制自訂彈窗的顯示/隱藏
const isNewArticleModalOpen = ref(false)

// 點擊新增按鈕時，打開自訂彈窗
const onAddNewArticle = () => {
  isNewArticleModalOpen.value = true
}

// 把所有欄位與 Quill 恢復原狀
const clearEditorData = () => {
  post.title = ''
  post.mainCategory = ''
  post.categoryId = ''
  post.tag = ''
  if (quillInstance) {
    quillInstance.setContents([]) // 洗清 Quill 編輯器
  }
  emit('reset-id') // 通知父組件把 articleId 變回 null
}

// 選項一：儲存草稿並開啟新檔
const saveAndNew = () => {
  if (!post.title.trim()) {
    alert('請至少填寫文章標題，才能為您儲存草稿！')
    return
  }
  // 1. 觸發原本的儲存草稿機制
  emit('save-draft', getFormData())
  // 2. 執行清空
  clearEditorData()
  // 3. 關閉彈窗
  isNewArticleModalOpen.value = false
  alert('草稿已儲存，已為您開啟新檔！')
}

// 💡 選項二：放棄不儲存，直接開新檔
const discardAndNew = () => {
  clearEditorData()
  isNewArticleModalOpen.value = false
  alert('✨ 已放棄變更，已開啟全新文章！')
}

// 控制草稿匣彈窗開關
const isDraftListModalOpen = ref(false)

// 打開草稿匣
const onOpenDraftList = () => {
  isDraftListModalOpen.value = true
}

// 選擇某篇草稿（點擊後載入）
const selectDraft = (draft) => {
  // 💡 觸發 emit 讓父組件去抓那篇草稿的詳細資料並塞回編輯器
  emit('load-draft', draft.id)
  isDraftListModalOpen.value = false // 關閉彈窗
}
// 刪除某篇草稿
const deleteDraftItem = (draftId) => {
  if (confirm('確定要永久刪除這篇草稿嗎？')) {
    emit('delete-draft', draftId)
  }
}
// 簡單的文字截斷輔助函式（防止內容太長撐壞卡片）
const truncateText = (text, length = 60) => {
  if (!text) return '無內文...'
  // 如果內容帶有 HTML 標籤，先簡單過濾掉
  const cleanText = text.replace(/<[^>]*>/g, '')
  return cleanText.length > length ? cleanText.substring(0, length) + '...' : cleanText
}
</script>

<template>
  <div class="mx-auto my-5 max-w-3xl font-sans text-gray-800">
    <!-- 頂部功能 -->
    <div class="mb-4 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="cursor-pointer" @click="$router.back()">
          <ArrowLeft />
        </span>
        <span class="text-2xl font-bold">建立貼文</span>
      </div>
      <div class="flex items-center gap-2">
        <span>
          <button
            class="bg-brand-success-300 hover:bg-brand-success-100 rounded-full p-2"
            @click="onAddNewArticle">
            <SquarePlus />
          </button>
        </span>
        <span>
          <Article_BaseButton type="draft" @click="onOpenDraftList">草稿匣</Article_BaseButton>
        </span>
      </div>
    </div>
    <!-- 主要發文區塊 (包覆標題與編輯器) -->
    <div class="rounded-2xl border border-gray-200 bg-white p-4">
      <div class="mb-2 text-sm font-medium text-gray-500">分類選取*</div>
      <div class="flex flex-col gap-3 sm:flex-row">
        <!-- 大分類 -->
        <div class="w-full sm:w-1/2">
          <!-- 大分類 select -->
          <select
            v-model="post.mainCategory"
            class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-gray-500 outline-none focus:bg-white"
            :class="{ 'text-gray-800': post.mainCategory }">
            <option value="" disabled hidden>請選擇分類</option>
            <option v-for="(subs, main) in props.categories" :key="main" :value="main">
              {{ main }}
            </option>
          </select>
        </div>
        <!-- 小分類 -->
        <div class="w-full sm:w-1/2">
          <select
            v-model="post.categoryId"
            :disabled="!post.mainCategory || currentSubCategories.length === 0"
            class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-gray-500 outline-none focus:bg-white disabled:opacity-50"
            :class="{ 'text-gray-800': post.categoryId }">
            <option value="" disabled hidden>
              <template v-if="!post.mainCategory">請先選擇大分類</template>
              <template v-else-if="currentSubCategories.length === 0">無子分類（免選）</template>
              <template v-else>請選擇小分類</template>
            </option>
            <option v-for="sub in currentSubCategories" :key="sub.id" :value="sub.id">
              {{ sub.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- 標題輸入框 -->
      <!-- note:這裡之後加上require的動態顯示 -->
      <div class="relative mt-2 mb-2">
        <input
          type="text"
          v-model="post.title"
          placeholder="標題*"
          maxlength="30"
          class="text-md w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 pr-16 transition-colors outline-none focus:border-gray-300" />
        <!-- 右側字數統計定位 -->
        <span class="absolute top-1/2 right-4 -translate-y-1/2 text-sm text-gray-400">
          {{ post.title.length }}/30
        </span>
      </div>
      <!-- Quill 編輯器區塊 -->
      <div
        class="mt-3 bg-white [&_.ql-container]:rounded-b-xl [&_.ql-container]:border-gray-200 [&_.ql-editor]:text-base [&_.ql-toolbar]:rounded-t-xl [&_.ql-toolbar]:border-gray-200">
        <div ref="editorRef" class="[&_.ql-editor]:min-h-62.5 [&_.ql-editor]:cursor-text"></div>
        <!-- note:之後可以加一個字數計數器(可能需要npm install Quill) -->
      </div>

      <!-- 標籤區 -->
      <div class="mt-5 mb-2 flex px-4">
        <span
          class="bg-brand-success-600 hover:bg-brand-success-700 w-fit rounded-full px-3 py-1 text-sm whitespace-nowrap text-white">
          #標籤
        </span>
      </div>
    </div>
    <!-- 底部按鈕 -->
    <div class="mt-5 flex justify-end gap-2.5">
      <Article_BaseButton type="draft" @click="onSaveDraft">儲存草稿</Article_BaseButton>
      <Article_BaseButton
        type="primary"
        :disabled="
          !post.title.trim() ||
          !post.mainCategory ||
          (currentSubCategories.length > 0 && !post.categoryId)
        "
        @click="onSubmit">
        發佈貼文
      </Article_BaseButton>
    </div>
  </div>

  <!-- ================= 這裡開始是自訂彈窗 ================= -->
  <div
    v-if="isNewArticleModalOpen"
    @click.self="isNewArticleModalOpen = false"
    class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
    <!-- 彈窗本體 -->
    <div
      class="w-full max-w-md transform cursor-default rounded-2xl border border-gray-100 bg-white p-6 shadow-xl transition-all">
      <!-- 標題與圖示 -->
      <div class="flex items-center space-x-3 text-amber-500">
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 class="text-lg font-bold text-gray-900">您想儲存目前的變更嗎？</h3>
      </div>

      <!-- 說明內文 -->
      <p class="mt-3 text-sm leading-relaxed text-gray-500">
        您正在嘗試建立一篇全新文章。點擊儲存將會把目前的進度留存為草稿，避免內容遺失。
      </p>

      <!-- 按鈕控制區 -->
      <div
        class="mt-6 flex flex-col space-y-2 text-sm sm:flex-row sm:justify-end sm:space-y-0 sm:space-x-2">
        <!-- 取消 -->
        <button
          @click="isNewArticleModalOpen = false"
          class="w-full rounded-xl px-4 py-2.5 font-medium text-gray-500 transition-colors hover:bg-gray-100 sm:w-auto">
          取消
        </button>

        <!-- 不儲存直接新建 -->
        <button
          @click="discardAndNew"
          class="w-full rounded-xl px-4 py-2.5 font-medium text-rose-400 transition-colors hover:bg-red-50 sm:w-auto">
          直接新建
        </button>

        <!-- 儲存並新建 -->
        <button
          @click="saveAndNew"
          class="bg-brand-success-300 hover:bg-brand-success-400 w-full rounded-xl px-4 py-2.5 font-medium text-white shadow-sm transition-colors sm:w-auto">
          儲存草稿並新建
        </button>
      </div>
    </div>
  </div>
  <!-- ================= 彈窗結束 ================= -->
  <!-- ================= 這裡是 Reddit 風格草稿匣彈窗 ================= -->
  <div
    v-if="isDraftListModalOpen"
    @click.self="isDraftListModalOpen = false"
    class="fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-slate-900/50 backdrop-blur-sm">
    <!-- 彈窗本體 -->
    <div
      class="w-full max-w-xl transform cursor-default overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl transition-all">
      <!-- 頂部標題列 -->
      <div class="flex items-center justify-between border-b border-gray-100 bg-slate-50 px-6 py-4">
        <div class="flex items-center space-x-2">
          <h3 class="text-lg font-bold text-gray-800">所有草稿</h3>
        </div>
        <!-- 關閉按鈕 -->
        <button
          @click="isDraftListModalOpen = false"
          class="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
          <svg
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L16 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- 草稿清單區 -->
      <div class="max-h-[400px] divide-y divide-gray-100 overflow-y-auto">
        <!-- 沒草稿時的狀態 -->
        <div
          v-if="drafts.length === 0"
          class="flex flex-col items-center justify-center py-12 text-gray-400">
          <svg
            class="mb-2 h-12 w-12 stroke-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p class="text-sm">目前沒有任何草稿</p>
        </div>

        <!-- 草稿卡片項目 -->
        <div
          v-for="draft in drafts"
          :key="draft.id"
          class="group flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-slate-50/80"
          @click="selectDraft(draft)">
          <!-- 左側：內文資訊 -->
          <div class="min-w-0 flex-1 pr-4">
            <div class="mb-1 flex items-center space-x-2">
              <h4
                class="group-hover:text-brand-success-400 truncate text-base font-semibold text-gray-900 transition-colors">
                {{ draft.title || '（未命名文章）' }}
              </h4>
              <span
                v-if="draft.categoryName"
                class="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                {{ draft.categoryName }}
              </span>
            </div>
            <p class="truncate text-sm text-gray-500">
              {{ truncateText(draft.content) }}
            </p>
            <span class="mt-1 block text-xs text-gray-400">
              最後修改：{{ draft.updatedAt || '剛剛' }}
            </span>
          </div>

          <!-- 右側：獨立刪除按鈕（阻止冒泡免得觸發點擊載入） -->
          <button
            @click.stop="deleteDraftItem(draft.id)"
            class="rounded-xl p-2.5 text-gray-400 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500">
            <svg
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- ================= 草稿匣彈窗結束 ================= -->
</template>

<style scoped></style>
