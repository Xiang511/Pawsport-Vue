<script setup>
import { ref, onMounted, watch } from 'vue'
import { ArrowLeft, SquarePlus } from 'lucide-vue-next'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import Article_BaseButton from './Article_BaseButton.vue'
import { useAuthStore } from '@/stores/auth'

import { useEditorState } from '@/composables/useEditorState'
import NewArticleModal from './Article_NewArticleModal.vue'
import DraftListModal from './Article_DraftListModal.vue'

const authStore = useAuthStore()
const emit = defineEmits(['publish', 'save-draft', 'reset-id', 'load-draft', 'delete-draft'])

// 接收來自父組件傳入的分類和草稿陣列資料
const props = defineProps({
  categories: { type: Object, default: () => ({}) },
  drafts: { type: Array, default: () => [] },
})

const currentSubCategories = ref([])
const editorRef = ref(null)
// 建立一個讓 Composable 能夠安全讀取到 quillInstance 的橋樑
const quillWrapper = ref(null)

const {
  post,
  isNewArticleModalOpen,
  isDraftListModalOpen,
  saveAndNew,
  discardAndNew,
  detectedTags,
} = useEditorState(emit, quillWrapper)

//頁面必須等quill載入
onMounted(() => {
  if (!editorRef.value) return
  // 初始化編輯器
  const quillInstance = new Quill(editorRef.value, {
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
  // 將實體提供給 Composable 之後做 clear 動作
  quillWrapper.value = quillInstance
})

// 封裝要外傳的完整資料包
const getFormData = () => {
  let finalTags = [...detectedTags.value]

  return {
    title: post.title,
    categoryId: Number(post.categoryId),
    // Quill 的 HTML 內文
    content: quillWrapper.value ? quillWrapper.value.root.innerHTML : '',
    tagNames: finalTags,
    userId: authStore.userInfo?.userId,
    // 以下為後端需要的其他擴充欄位，前端先給預設
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

// 選擇某篇草稿（點擊後載入）
const selectDraft = (draft) => {
  // 觸發 emit 讓父組件去抓那篇草稿的詳細資料並塞回編輯器
  emit('load-draft', draft.id)
  isDraftListModalOpen.value = false // 關閉彈窗
}
// 刪除某篇草稿
const deleteDraftItem = (draftId) => {
  if (confirm('確定要永久刪除這篇草稿嗎？')) {
    emit('delete-draft', draftId)
  }
}

const syncArticleId = (id) => {
  post.articleId = id
}
defineExpose({
  syncArticleId,
})
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
            @click="isNewArticleModalOpen = true">
            <SquarePlus />
          </button>
        </span>
        <span>
          <Article_BaseButton type="draft" @click="isDraftListModalOpen = true">
            草稿匣
          </Article_BaseButton>
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
      </div>

      <!-- 標籤區 -->
      <div class="mt-5 mb-2 flex min-h-9 flex-wrap items-center gap-2 px-4">
        <span
          v-for="(tag, index) in detectedTags"
          :key="index"
          class="bg-brand-success-600 hover:bg-brand-success-700 flex h-7 w-fit items-center justify-center rounded-full px-3 text-sm whitespace-nowrap text-white transition-all duration-200">
          #{{ tag }}
        </span>
        <!-- 防呆提示（可選）：沒標籤時顯示淡色提示 -->
        <span
          v-if="detectedTags.length === 0"
          class="self-center align-middle text-sm text-gray-400 italic">
          在文章中輸入 #標籤 將自動顯示在此處
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

      <!-- 💡 拆分出去的子元件彈窗，乾乾淨淨！ -->
      <NewArticleModal
        v-model="isNewArticleModalOpen"
        @discard="discardAndNew"
        @save="saveAndNew(getFormData)" />

      <DraftListModal
        v-model="isDraftListModalOpen"
        :drafts="props.drafts"
        @select="selectDraft"
        @delete="deleteDraftItem" />
    </div>
  </div>
</template>

<style scoped></style>
