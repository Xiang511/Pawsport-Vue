import { ref, reactive, watch } from 'vue'
import axios from 'axios'

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

  const imageHandler = () => {
    // 1. 動態建立一個隱藏的 <input type="file">
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*') // 只允許圖片
    input.click()

    // 2. 當使用者選好圖片後觸發
    input.onchange = async () => {
      const file = input.files[0]
      if (!file) return

      // 3. 將圖片檔案包裝成 FormData 格式
      const formData = new FormData()
      formData.append('file', file) // 👈 這裡的 'file' 要對齊後端的 IFormFile file 參數名稱

      try {
        // 4. 發送請求到你剛剛寫好的後端 API
        // ⚠️ 請根據你本機的後端埠號修改 (例如先前看到的 7048)
        const response = await axios.post('https://localhost:7048/api/Image/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        // 5. 拿到後端回傳的完整網址 { url: "https://..." }
        const imageUrl = response.data.url

        // 6. 取得當前 Quill 的實體與光標位置，把 <img> 標籤插進去
        const quill = quillInstanceRef.value // 確保這能拿到你的 Quill 實體
        const range = quill.getSelection()

        // 在當前游標位置插入圖片，並把游標往後移一格
        quill.insertEmbed(range.index, 'image', imageUrl)
        quill.setSelection(range.index + 1)
      } catch (error) {
        console.error('圖片上傳失敗:', error)
        alert(error.response?.data?.message || '圖片上傳失敗，請稍後再試。')
      }
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
  }
}
