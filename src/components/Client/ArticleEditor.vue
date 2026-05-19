<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
// Quill
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
// 自己做的按鈕樣式
import Article_BaseButton from './Article_BaseButton.vue'

// 定義從父組件傳進來的 props
const props = defineProps({
  categories: {
    type: Object,
    required: true,
    default: () => ({}),
  },
})

// 定義要傳回給父組件的事件
const emit = defineEmits(['publish', 'save-draft'])

//控制Quill的響應式變數
const editorRef = ref(null)
//存放new Quill()後產生的物件實體
let quillInstance = null

//頁面必須等quill載入
onMounted(() => {
  if (!editorRef.value) return
  // 初始化編輯器 // 確保拿到 Quill 之後才執行初始化
  quillInstance = new Quill(editorRef.value, {
    theme: 'snow',
    placeholder: '在此撰寫...',
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, 4, false] }],
        [{ font: [] }],
        ['bold', 'italic', { script: 'sub' }, { script: 'super' }, 'strike', 'underline'],
        [{ indent: '-1' }, { indent: '+1' }, { align: [] }],
        [{ color: [] }, { background: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
        ['image', 'blockquote', 'link'],
        ['clean'],
      ],
    },
  })
})

//接住貼文內容的變數
const post = reactive({
  title: '',
  content: '',
  tag: '',
})

const currentSubCategories = ref([])

// 監聽大分類（資料來源改用 props.categories）
watch(
  () => post.mainCategory,
  (newMain) => {
    if (newMain) {
      currentSubCategories.value = props.categories[newMain] || []
    } else {
      currentSubCategories.value = []
    }
    post.subCategory = ''
  },
)

// 封裝要外傳的完整資料包
const getFormData = () => {
  return {
    title: post.title,
    mainCategory: post.mainCategory,
    subCategory: post.subCategory,
    tag: post.tag,
    content: quillInstance ? quillInstance.root.innerHTML : '',
  }
}

// 點擊按鈕時，不自己發 API，而是透過 emit 丟給 View
const onSaveDraft = () => {
  emit('save-draft', getFormData())
}

const onSubmit = () => {
  emit('publish', getFormData())
}
</script>

<template>
  <div class="mx-auto my-5 max-w-3xl font-sans text-gray-800">
    <!-- 頂部功能 -->
    <div class="mb-4 flex items-center justify-between">
      <span class="text-2xl font-bold">建立貼文</span>
      <Article_BaseButton type="draft">草稿匣</Article_BaseButton>
    </div>
    <!-- 主要發文區塊 (包覆標題與編輯器) -->
    <div class="rounded-2xl border border-gray-200 bg-white p-4">
      <div class="mb-2 text-sm font-medium text-gray-500">分類選取*</div>
      <div class="flex flex-col gap-3 sm:flex-row">
        <!-- 大分類 -->
        <div class="w-full sm:w-1/2">
          <select
            v-model="post.mainCategory"
            class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 outline-none">
            <option value="" disabled selected>請選擇大分類</option>
            <!-- 這裡改用 props.categories 跑迴圈 -->
            <option v-for="(subs, main) in props.categories" :key="main" :value="main">
              {{ main }}
            </option>
          </select>
        </div>
        <!-- 小分類 -->
        <div class="w-full sm:w-1/2">
          <select
            v-model="post.subCategory"
            :disabled="!post.mainCategory"
            class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 outline-none disabled:opacity-50">
            <option value="" disabled selected>
              {{ post.mainCategory ? '請選擇小分類' : '請先選擇大分類' }}
            </option>
            <option v-for="sub in currentSubCategories" :key="sub" :value="sub">
              {{ sub }}
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
      <div class="mt-3 min-h-50 bg-white [&_.ql-editor]:text-base">
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
      <Article_BaseButton type="draft" @click="handleSaveDraft">儲存草稿</Article_BaseButton>
      <Article_BaseButton type="primary" :disabled="!post.title" @click="handleSubmit">
        發佈貼文
      </Article_BaseButton>
    </div>
  </div>
</template>

<style scoped></style>
