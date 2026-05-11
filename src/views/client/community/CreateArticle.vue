<script setup>
import { ref, onMounted } from 'vue'

const editorRef = ref(null)
let quillInstance = null

// 動態載入 Quill CDN
const loadQuill = () => {
  return new Promise((resolve) => {
    // 1. 載入 CSS
    const link = document.createElement('link')
    link.href = 'https://cdn.quilljs.com/1.3.6/quill.snow.css'
    link.rel = 'stylesheet'
    document.head.appendChild(link)

    // 2. 載入 JS
    const script = document.createElement('script')
    script.src = 'https://cdn.quilljs.com/1.3.6/quill.min.js'
    script.onload = () => resolve(window.Quill)
    document.head.appendChild(script)
  })
}

onMounted(async () => {
  const Quill = await loadQuill()

  // 初始化編輯器
  quillInstance = new Quill(editorRef.value, {
    theme: 'snow',
    modules: {
      toolbar: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline'],
        ['image', 'code-block'],
      ],
    },
  })
})

const handleSave = () => {
  // 取得 HTML 內容送給 API
  const htmlContent = quillInstance.root.innerHTML
  console.log('準備送往 C# API 的內容：', htmlContent)
  // axios.post('/api/Article', { content: htmlContent, ... });
}
</script>

<template>
  <div class="editor-wrapper">
    <div id="editor-container" ref="editorRef"></div>
    <button @click="handleSave" class="mt-4 rounded bg-blue-500 px-4 py-2 text-white">
      儲存文章
    </button>
  </div>
</template>

<style>
/* 局部調整樣式，不影響他人 */
.editor-wrapper {
  padding: 20px;
  background: white;
}

#editor-container {
  height: 400px;
}
</style>
