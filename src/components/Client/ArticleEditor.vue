<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
// 自己做的按鈕樣式
import Article_BaseButton from './Article_BaseButton.vue'

//控制Quill的響應式變數
const editorRef = ref(null)
//存放new Quill()後產生的物件實體
let quillInstance = null

// 動態載入 Quill CDN
// 使用appendchild模擬加入<head>區塊中的效果
const loadQuill = () => {
  return new Promise((resolve) => {
    // 1. 載入 CSS
    const link = document.createElement('link')
    link.href = 'https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.snow.css'
    link.rel = 'stylesheet'
    document.head.appendChild(link)

    // 2. 載入 JS
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.js'
    //onload觸發才算完成
    script.onload = () => resolve(window.Quill)
    //若載入失敗
    script.onerror = () => reject(new Error('Quill 載入失敗'))
    document.head.appendChild(script)
  })
}

//頁面必須等quill載入
onMounted(async () => {
  const Quill = await loadQuill()

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

// ==函式==
// 儲存為草稿
const handleSaveDraft = () => {
  // 取得 HTML 內容送給 API
  const htmlContent = quillInstance.root.innerHTML
  console.log('準備送往 C# API 的內容：', htmlContent)
  // axios.post('/api/Article', { content: htmlContent, ... });
}
//發布文章
const handleSubmit = () => {
  // 取得 HTML 內容送給 API
  const htmlContent = quillInstance.root.innerHTML
  console.log('準備送往 C# API 的內容：', htmlContent)
  // axios.post('/api/Article', { content: htmlContent, ... });
}
</script>

<template>
  <div class="post-container">
    <!-- 頂部功能 -->
    <div class="post-header">
      <span class="main-title">建立貼文</span>
      <Article_BaseButton type="draft">草稿匣</Article_BaseButton>
    </div>
    <!-- 主要發文區塊 (包覆標題與編輯器) -->
    <div class="editor-card">
      <div>分類選取區</div>
      <!-- 標題輸入框 -->
      <!-- note:這裡之後加上require的動態顯示 -->
      <div class="title-section">
        <input type="text" v-model="post.title" placeholder="標題*" maxlength="100" />
        <span class="char-count">{{ post.title.length }}/100</span>
      </div>
      <!-- Quill 編輯器區塊 -->
      <div class="quill-wrapper">
        <div id="editor-container" ref="editorRef"></div>
        <!-- note:之後可以加一個字數計數器(可能需要npm install Quill) -->
      </div>
      <!-- 標籤輸入框 -->
      <div class="tag-section">
        <input type="text" v-model="post.tag" placeholder="#標籤" maxlength="100" />
        <span class="char-count">{{ post.tag.length }}/100</span>
      </div>
    </div>
    <!-- 底部按鈕 -->
    <div class="footer-actions">
      <Article_BaseButton type="draft" @click="handleSaveDraft">儲存草稿</Article_BaseButton>
      <Article_BaseButton type="primary" :disabled="!post.title" @click="handleSubmit">
        發佈貼文
      </Article_BaseButton>
    </div>
  </div>
</template>

<style scoped>
.post-container {
  max-width: 700px;
  margin: 20px auto;
  font-family: sans-serif;
  color: #333;
}
.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}
.main-title {
  font-size: 20px;
  font-weight: bold;
}
.status-text {
  color: #888;
  font-size: 14px;
}
.quill-wrapper {
  margin-top: 10px;
  background: white;
  min-height: 200px;
}
/* Quill的外層容器高度 */
#editor-container {
  min-height: 200px;
}
/* 覆寫Quill字體大小設定 */
:deep(.ql-editor) {
  font-size: 16px;
}

/* 核心編輯卡片樣式 (對應 image_0ad233.png 的灰色圓角框) */
.editor-card {
  border: 1px solid #ddd;
  border-radius: 15px;
  padding: 15px;
  background-color: #fff;
}

.title-section {
  position: relative;
  margin-top: 10px;
  margin-bottom: 10px;
}
.title-section input {
  width: 100%;
  padding: 12px 15px;
  font-size: 18px;
  border: 1px solid #eee;
  border-radius: 10px;
  outline: none;
  background: #f9f9f9;
}
.tag-section {
  position: relative;
  margin-top: 20px;
  margin-bottom: 10px;
}
.tag-section input {
  width: 100%;
  padding: 12px 15px;
  font-size: 18px;
  border: 1px solid #eee;
  border-radius: 10px;
  outline: none;
  background: #f9f9f9;
}
/* 底部按鈕 */
.footer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
</style>
