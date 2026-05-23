import { ref, reactive, watch } from 'vue'

export function useEditorState(emit, quillInstanceRef) {
  const isNewArticleModalOpen = ref(false)
  const isDraftListModalOpen = ref(false)
  const detectedTags = ref([])

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
      alert('請至少填寫文章標題，才能為您儲存草稿！')
      return
    }
    emit('save-draft', getFormData())
    clearEditorData()
    isNewArticleModalOpen.value = false
    alert('草稿已儲存，已為您開啟新檔！')
  }

  // 放棄不儲存，直接開新檔
  const discardAndNew = () => {
    clearEditorData()
    isNewArticleModalOpen.value = false
    alert('已放棄變更，已開啟全新文章！')
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

      quill.on('text-change', () => {
        const htmlContent = quill.root.innerHTML
        detectedTags.value = extractTags(htmlContent)
      })
    },
  )

  return {
    post,
    isNewArticleModalOpen,
    isDraftListModalOpen,
    clearEditorData,
    saveAndNew,
    discardAndNew,
    detectedTags,
  }
}
