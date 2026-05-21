import { ref, reactive } from 'vue'

export function useEditorState(emit, quillInstanceRef) {
  const isNewArticleModalOpen = ref(false)
  const isDraftListModalOpen = ref(false)

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

  return {
    post,
    isNewArticleModalOpen,
    isDraftListModalOpen,
    clearEditorData,
    saveAndNew,
    discardAndNew,
  }
}
