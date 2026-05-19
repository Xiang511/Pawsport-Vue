<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import Article_BaseButton from './Article_BaseButton.vue'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'

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

const editorRef = ref(null)
let quillInstance = null

onMounted(() => {
  if (!editorRef.value) return
  quillInstance = new Quill(editorRef.value, {
    theme: 'snow',
    placeholder: '在此撰寫...',
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, 4, false] }],
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['image', 'link'],
      ],
    },
  })
})

const post = reactive({
  title: '',
  mainCategory: '',
  subCategory: '',
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
  <!-- 外層容器：對應 .post-container -->
  <div class="mx-auto my-5 max-w-3xl font-sans text-gray-800">
    <!-- 頂部功能：對應 .post-header -->
    <div class="mb-4 flex items-center justify-between">
      <span class="text-xl font-bold">建立貼文</span>
      <Article_BaseButton type="draft">草稿匣</Article_BaseButton>
    </div>

    <!-- 主要發文區塊：對應 .editor-card -->
    <div class="rounded-2xl border border-gray-200 bg-white p-4">
      <div class="mb-2 text-sm text-gray-500">分類選取區</div>

      <!-- 標題輸入框：對應 .title-section -->
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

      <!-- Quill 編輯器區塊：對應 .quill-wrapper 與 #editor-container -->
      <div class="mt-3 min-h-[200px] bg-white [&_.ql-editor]:text-base">
        <div ref="editorRef" class="min-h-[200px]"></div>
      </div>

      <!-- 標籤輸入框：對應 .tag-section -->
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

    <!-- 底部按鈕：對應 .footer-actions -->
    <div class="mt-5 flex justify-end gap-2.5">
      <Article_BaseButton type="draft" @click="handleSaveDraft">儲存草稿</Article_BaseButton>
      <Article_BaseButton type="primary" :disabled="!post.title" @click="handleSubmit">
        發佈貼文
      </Article_BaseButton>
    </div>
  </div>
</template>
