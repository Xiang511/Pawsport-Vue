import { ref, reactive, watch } from 'vue'
import request from '@/api/axios'

export function useEditorState(emit, quillInstanceRef) {
  const isNewArticleModalOpen = ref(false)
  const isDraftListModalOpen = ref(false)
  const detectedTags = ref([])
  const toastRef = ref(null)
  let isUploading = false
  let savedIndex = 0

  const post = reactive({
    title: '',
    articleId: null,
    mainCategory: '',
    categoryId: '',
    content: '',
    tag: '',
  })

  // 清空編輯器與欄位
  const clearEditorData = () => {
    post.title = ''
    post.mainCategory = ''
    post.categoryId = ''
    post.tag = ''
    detectedTags.value = []
    if (quillInstanceRef.value) {
      quillInstanceRef.value.setContents([])
    }
    emit('reset-id') // 通知父組件把 articleId 變回 null
  }

  // 儲存草稿並開啟新檔
  const saveAndNew = (getFormData) => {
    if (!post.title.trim()) {
      toastRef.value?.trigger('請至少填寫文章標題，才能為您儲存草稿！')
      return
    }
    emit('save-draft', getFormData())
    clearEditorData()
    isNewArticleModalOpen.value = false
    toastRef.value?.trigger('草稿已儲存，已為您開啟新檔！')
  }

  // 放棄不儲存，直接開新檔
  const discardAndNew = () => {
    clearEditorData()
    isNewArticleModalOpen.value = false
    toastRef.value?.trigger('已放棄變更，已開啟全新文章！')
  }

  const extractTags = (htmlContent) => {
    if (!htmlContent) return []
    try {
      const doc = new DOMParser().parseFromString(htmlContent, 'text/html')
      const pureText = doc.body.textContent || ''
      const regex = /#([^#\s,、.]+)/g
      const matches = pureText.match(regex)
      if (!matches) return []

      const cleanTags = matches.map((tag) => tag.replace('#', '').trim())
      return [...new Set(cleanTags)].filter((tag) => tag.length > 0)
    } catch (e) {
      return []
    }
  }
  //因為內文在 Quill 實體裡，我們利用 Quill 的 text-change 事件或直接監聽實體
  watch(
    () => quillInstanceRef.value,
    (quill) => {
      if (!quill) return

      // 標籤偵測
      quill.on('text-change', () => {
        const htmlContent = quill.root.innerHTML
        detectedTags.value = extractTags(htmlContent)
      })

      // 游標監聽：只要游標一有變動，立刻存起來
      quill.on('selection-change', (range) => {
        console.log('selection=', range)
        if (range && range.index !== undefined) {
          savedIndex = range.index
        }
      })
    },
  )

  const imageHandler = () => {
    console.log('imageHandler triggered')

    const input = document.getElementById('quill-hidden-image-input')

    console.log('input=', input)

    if (input) {
      input.click()
    }
  }

  const handleRealImageUpload = async (event) => {
    if (isUploading) return

    const file = event.target.files?.[0]
    const quill = quillInstanceRef.value

    if (!file || !quill) return

    try {
      isUploading = true

      const formData = new FormData()
      formData.append('file', file)

      const response = await request.post('/Users/community/upload', formData)

      console.log('圖片上傳 response.data=', response.data)

      const imageUrl =
        response.data?.url || response.data?.data?.url || response.data?.data || response.data

      console.log('imageUrl=', imageUrl)

      if (!imageUrl || typeof imageUrl !== 'string') {
        console.error('無效的圖片網址:', response.data)
        toastRef.value?.trigger('後端未回傳有效圖片網址')
        return
      }

      const insertIndex = Math.min(savedIndex, quill.getLength() - 1)

      quill.insertEmbed(insertIndex, 'image', imageUrl, 'user')

      setTimeout(() => {
        quill.setSelection(insertIndex + 1, 0, 'silent')
      }, 0)
    } catch (err) {
      console.error(err)

      toastRef.value?.trigger('圖片上傳失敗，請檢查後端連線')
    } finally {
      isUploading = false
      event.target.value = ''
    }
  }

  const loadDraftToEditor = (draftDetail) => {
    post.articleId = draftDetail.articleId
    post.title = draftDetail.title || ''
    post.categoryId = draftDetail.categoryId || ''
    post.content = draftDetail.content || ''
    post.tag = draftDetail.tags?.map((tag) => `#${tag}`).join(' ') || ''

    detectedTags.value = draftDetail.tags || []

    if (quillInstanceRef.value) {
      quillInstanceRef.value.root.innerHTML = draftDetail.content || ''
    }
  }

  return {
    post,
    isNewArticleModalOpen,
    isDraftListModalOpen,
    clearEditorData,
    saveAndNew,
    discardAndNew,
    detectedTags,
    imageHandler,
    toastRef,
    handleRealImageUpload,
    loadDraftToEditor,
  }
}
