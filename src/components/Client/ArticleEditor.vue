<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { ArrowLeft } from 'lucide-vue-next'
// Quill
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
// 自己做的按鈕樣式
import Article_BaseButton from './Article_BaseButton.vue'

const props = defineProps(['categories'])
// 定義要傳回給父組件的事件
const emit = defineEmits(['publish', 'save-draft'])
// 接住貼文內容的變數
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

const currentSubCategories = ref([])

//頁面必須等quill載入
onMounted(() => {
  if (!editorRef.value) return
  // 初始化編輯器 // 確保拿到 Quill 之後才執行初始化
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
    // 現在：如果是手動輸入字串（例如 "#貓咪 #飼料"）
    finalTags = post.tag
      .replace(/#/g, ' ') // 把所有 # 換成空格，這樣 "#貓咪" 就變成 "貓咪"
      .split(' ') // 用空格切開成陣列
      .map((t) => t.trim()) // 去除前後空白
      .filter((t) => t !== '') // 濾掉空字串
  }

  return {
    title: post.title,
    // 確保傳給後端的是數字數字
    categoryId: Number(post.categoryId),
    // Quill 的 HTML 內文
    content: quillInstance ? quillInstance.root.innerHTML : '',
    // 傳送純文字陣列 ["貓咪", "飼料"]
    tagNames: finalTags,

    // 以下為後端需要的其他擴充欄位，前端先給預設
    userId: 1, // TODO: 從登入資訊取得真實 userId
    eventStartDate: null,
    eventEndDate: null,
    eventLocation: null,
  }
}

// 監聽大分類（資料來源改用 props.categories）
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
  if (!post.categoryId) return alert('請選擇文章分類！')
  emit('publish', getFormData())
}
</script>

<template>
  <div class="mx-auto my-5 max-w-3xl font-sans text-gray-800">
    <!-- 頂部功能 -->
    <div class="mb-4 flex items-center justify-between">
      <!-- 💡 加上 flex、垂直置中與間距 -->
      <div class="flex items-center gap-2">
        <!-- 如果你想讓箭頭可以點擊回上一頁，可以加上 cursor-pointer 與 @click -->
        <span class="cursor-pointer" @click="$router.back()">
          <ArrowLeft />
        </span>
        <span class="text-2xl font-bold">建立貼文</span>
      </div>

      <div>
        <Article_BaseButton type="draft">草稿匣</Article_BaseButton>
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
          maxlength="100"
          class="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 pr-16 text-lg transition-colors outline-none focus:border-gray-300" />
        <!-- 右側字數統計定位 -->
        <span class="absolute top-1/2 right-4 -translate-y-1/2 text-sm text-gray-400">
          {{ post.title.length }}/100
        </span>
      </div>
      <!-- Quill 編輯器區塊 -->
      <div
        class="mt-3 bg-white [&_.ql-container]:rounded-b-xl [&_.ql-container]:border-gray-200 [&_.ql-editor]:text-base [&_.ql-toolbar]:rounded-t-xl [&_.ql-toolbar]:border-gray-200">
        <div ref="editorRef" class="min-h-50"></div>
        <!-- note:之後可以加一個字數計數器(可能需要npm install Quill) -->
      </div>

      <!-- 標籤輸入框 -->
      <div class="relative mt-5 mb-2">
        <input
          type="text"
          v-model="post.tag"
          placeholder="#標籤"
          maxlength="100"
          class="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 pr-16 text-lg transition-colors outline-none focus:border-gray-300" />
        <span class="absolute top-1/2 right-4 -translate-y-1/2 text-sm text-gray-400">
          {{ post.tag.length }}/100
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
</template>

<style scoped></style>
