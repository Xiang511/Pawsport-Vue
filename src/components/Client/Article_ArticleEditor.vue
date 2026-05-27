<script setup>
import { ref, onMounted, watch, computed, shallowRef, markRaw, nextTick } from 'vue'
import { ArrowLeft, SquarePlus } from 'lucide-vue-next'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'

import { useAuthStore } from '@/stores/auth'
import { useEditorState } from '@/composables/useEditorState'

import Article_BaseButton from './Article_BaseButton.vue'
import NewArticleModal from './Article_NewArticleModal.vue'
import DraftListModal from './Article_DraftListModal.vue'
import Article_ToastAlert from './Article_ToastAlert.vue'

const authStore = useAuthStore()
const toastRef = ref(null)
const emit = defineEmits(['publish', 'save-draft', 'reset-id', 'load-draft', 'delete-draft'])

// 接收來自父組件傳入的分類和草稿陣列資料
const props = defineProps({
  categories: { type: Object, default: () => ({}) },
  drafts: { type: Array, default: () => [] },
})

const currentSubCategories = ref([])
const editorRef = ref(null)
// 建立一個讓 Composable 能夠安全讀取到 quillInstance 的橋樑
const quillWrapper = shallowRef(null)

const {
  post,
  isNewArticleModalOpen,
  isDraftListModalOpen,
  saveAndNew,
  discardAndNew,
  detectedTags,
  imageHandler,
  handleRealImageUpload,
  loadDraftToEditor: loadDraftBaseToEditor,
} = useEditorState(emit, quillWrapper)

//頁面必須等quill載入
onMounted(() => {
  if (!editorRef.value) return
  // 初始化編輯器
  const quillInstance = markRaw(
    new Quill(editorRef.value, {
      theme: 'snow',
      modules: {
        toolbar: {
          container: [
            [{ header: [1, 2, 3, 4, false] }],
            [{ font: [] }],
            ['bold', 'italic', { script: 'sub' }, { script: 'super' }, 'strike', 'underline'],
            [{ color: [] }, { background: [] }],
            [{ indent: '-1' }, { indent: '+1' }, { align: [] }],
            [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
            ['image', 'blockquote', 'link'],
            ['clean'],
          ],
          handlers: {
            image: imageHandler,
          },
        },
      },
    }),
  )

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
  if (!post.title.trim()) return toastRef.value?.trigger('請填寫文章標題！')
  if (!post.mainCategory) return toastRef.value?.trigger('請選擇文章大分類！')
  // 如果目前的大分類「有小分類存在」，但使用者卻沒選，才需要彈出警告
  if (currentSubCategories.value.length > 0 && !post.categoryId) {
    return toastRef.value?.trigger('請選擇文章小分類！')
  }
  emit('publish', getFormData())
}

// 選擇某篇草稿（點擊後載入）
const selectDraft = (draftId) => {
  console.log('ArticleEditor 收到草稿 id =', draftId)

  if (!draftId) {
    console.warn('草稿 ID 無效：', draftId)
    return
  }

  emit('load-draft', draftId)
  isDraftListModalOpen.value = false
}

// 刪除某篇草稿
const deleteDraftItem = (draftId) => {
  if (!draftId) {
    console.warn('刪除草稿失敗，草稿 ID 無效：', draftId)
    return
  }

  if (confirm('確定要永久刪除這篇草稿嗎？')) {
    emit('delete-draft', draftId)
  }
}

const findMainCategoryByCategoryId = (categoryId) => {
  const targetId = Number(categoryId)

  for (const [mainCategoryName, subCategories] of Object.entries(props.categories)) {
    const matched = subCategories.some((sub) => {
      return Number(sub.id) === targetId || Number(sub.categoryId) === targetId
    })

    if (matched) {
      return mainCategoryName
    }
  }

  return ''
}

const loadDraftToEditor = async (draftDetail) => {
  loadDraftBaseToEditor(draftDetail)

  const mainCategory = findMainCategoryByCategoryId(draftDetail.categoryId)

  post.mainCategory = mainCategory

  await nextTick()

  currentSubCategories.value = props.categories[mainCategory] || []
  post.categoryId = draftDetail.categoryId ? String(draftDetail.categoryId) : ''
}

const syncArticleId = (id) => {
  post.articleId = id
}
defineExpose({
  syncArticleId,
  loadDraftToEditor,
})
</script>

<template>
  <div class="mx-auto my-5 max-w-3xl text-gray-800">
    <!-- 頂部功能 -->
    <div
      class="mb-6 flex flex-col gap-4 border-b-4 border-[#445944] pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center gap-3">
        <button
          @click="$router.back()"
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-[#445944] bg-[#FCF4E5] text-[#445944] shadow-[3px_3px_0px_#445944] transition hover:bg-[#445944] hover:text-white active:translate-y-[1px]">
          <ArrowLeft :size="20" class="stroke-[3]" />
        </button>
        <div class="flex flex-col">
          <span class="text-2xl font-black tracking-wide text-[#445944]">建立貼文</span>
          <span class="text-xs font-bold text-gray-400">請選取適當大分類以獲得精確觸及</span>
        </div>
      </div>

      <div class="flex items-center gap-2.5">
        <button
          @click="isNewArticleModalOpen = true"
          class="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#445944] bg-amber-400 text-[#445944] shadow-[3px_3px_0px_#445944] transition hover:bg-[#445944] hover:text-white active:translate-y-[1px]"
          title="開新文章">
          <SquarePlus :size="20" class="stroke-[3]" />
        </button>

        <button
          @click="isDraftListModalOpen = true"
          class="rounded-xl border-2 border-[#445944] bg-[#FCF4E5] px-4 py-2 text-sm font-black text-[#445944] shadow-[3px_3px_0px_#445944] transition-all hover:bg-[#445944] hover:text-white active:translate-y-[1px]">
          📂 打開草稿匣
        </button>
      </div>
    </div>

    <!-- 主要發文區塊 (包覆標題與編輯器) -->
    <div
      class="mb-6 rounded-3xl border-4 border-[#445944] bg-white p-6 shadow-[6px_6px_0px_#445944]">
      <!-- 分類選取 -->
      <div class="mb-2 text-sm font-black text-[#445944]">選取發文主題分類 *</div>

      <div class="mb-4 flex flex-col gap-3 sm:flex-row">
        <!-- 大分類 -->
        <div class="w-full sm:w-1/2">
          <select
            v-model="post.mainCategory"
            class="w-full rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] px-4 py-2.5 text-sm font-black text-[#445944] shadow-[2px_2px_0px_#445944] outline-none focus:bg-white"
            :class="{ 'text-gray-800': post.mainCategory }">
            <option value="" disabled hidden>請選擇大分類主題</option>
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
            class="w-full rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] px-4 py-2.5 text-sm font-black text-[#445944] shadow-[2px_2px_0px_#445944] outline-none focus:bg-white disabled:cursor-not-allowed disabled:opacity-40"
            :class="{ 'text-gray-800': post.categoryId }">
            <option value="" disabled hidden>
              <template v-if="!post.mainCategory">請先選取大分類</template>
              <template v-else-if="currentSubCategories.length === 0">
                無子分類（直接填寫標題）
              </template>
              <template v-else>請選擇子分類</template>
            </option>
            <option v-for="sub in currentSubCategories" :key="sub.id" :value="sub.id">
              {{ sub.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- 標題輸入框 -->
      <div class="relative mt-2 mb-4">
        <input
          type="text"
          v-model="post.title"
          placeholder="請填寫貼文標題... *"
          maxlength="30"
          class="w-full rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] px-4 py-3.5 pr-16 text-sm font-bold text-gray-800 placeholder-gray-400 shadow-[2px_2px_0px_#445944] focus:border-[#445944] focus:ring-0 focus:outline-none" />

        <!-- 右側字數統計定位 -->
        <span
          class="absolute top-1/2 right-4 -translate-y-1/2 rounded-lg border border-[#445944]/20 bg-white px-2 py-0.5 text-xs font-black text-[#445944]/65">
          {{ post.title.length }}/30
        </span>
      </div>

      <!-- Quill 編輯器區塊 -->
      <div
        class="mt-3 overflow-hidden rounded-2xl border-2 border-[#445944] bg-white shadow-[2px_2px_0px_#445944] [&_.ql-container]:border-0 [&_.ql-editor]:text-base [&_.ql-editor_.ql-align-center_img]:mx-auto [&_.ql-editor_.ql-align-right_img]:mr-0 [&_.ql-editor_.ql-align-right_img]:ml-auto [&_.ql-editor_img]:my-4 [&_.ql-editor_img]:mr-auto [&_.ql-editor_img]:ml-0 [&_.ql-editor_img]:block [&_.ql-editor_img]:h-auto [&_.ql-editor_img]:max-h-[360px] [&_.ql-editor_img]:max-w-full [&_.ql-editor_img]:rounded-xl [&_.ql-editor_img]:object-contain [&_.ql-editor_img]:shadow-sm [&_.ql-toolbar]:border-0 [&_.ql-toolbar]:border-b-2 [&_.ql-toolbar]:border-[#445944] [&_.ql-toolbar]:bg-[#FCF4E5]">
        <div ref="editorRef" class="[&_.ql-editor]:min-h-62.5 [&_.ql-editor]:cursor-text"></div>
      </div>

      <!-- 標籤區 -->
      <div
        class="mt-5 mb-2 flex min-h-9 flex-wrap items-center gap-2 rounded-xl border-2 border-dashed border-[#445944]/30 bg-[#FDF9F3] p-3 px-4">
        <span
          v-for="(tag, index) in detectedTags"
          :key="index"
          class="rounded-xl border-2 border-[#445944] bg-[#FCF4E5] px-3 py-1 text-xs font-black text-[#445944] shadow-[2px_2px_0px_#445944]">
          #{{ tag }}
        </span>

        <span
          v-if="detectedTags.length === 0"
          class="self-center align-middle text-xs font-bold text-gray-400 italic">
          💡 提示：在內文中輸入 #標籤名稱 後用空白、換行或標點分隔，即可自動偵測標籤！
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

      <!-- 💡 拆分出去的子元件彈窗 -->
      <NewArticleModal
        v-model="isNewArticleModalOpen"
        @discard="discardAndNew"
        @save="saveAndNew(getFormData)" />

      <DraftListModal
        v-model="isDraftListModalOpen"
        :drafts="props.drafts"
        @select="selectDraft"
        @delete="deleteDraftItem" />

      <Article_ToastAlert ref="toastRef" />

      <input
        id="quill-hidden-image-input"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleRealImageUpload" />
    </div>
  </div>
</template>

<style scoped></style>
