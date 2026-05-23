<!-- ArticleEditor.vue -->
<script setup>
import { useEditorState } from '@/composables/useEditorState'
import { useArticleAction } from '@/composables/useArticleAction'

// 1. 拿狀態
const { title, articleContent, detectedTags, clearEditorData } = useEditorState()

// 2. 拿動作
const { publishArticle } = useArticleAction()

// 3. 發佈時，直接把 state 內洗好的 detectedTags 塞給 action
const handlePublish = async () => {
  const articleData = {
    title: title.value,
    content: articleContent.value,
    tags: detectedTags.value // 👈 後端 API 的標籤清單直接從這裡拿！
  }
  
  await publishArticle(articleData)
  clearEditorData()
}
</script>

<!-- 編輯器區塊下方 -->
<div class="mt-4 min-h-[32px] px-2">
  <!-- 當有解析到標籤時才顯示這個容器 -->
  <div v-if="detectedTags.length > 0" class="flex flex-wrap gap-2">
    
    <!-- 💡 這裡會根據內文自動跑 v-for 生成標籤 -->
    <span
      v-for="(tag, index) in detectedTags"
      :key="index"
      class="inline-flex items-center rounded-full bg-emerald-600/10 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20 transition-all duration-200">
      #{{ tag }}
    </span>
    
  </div>
  
  <!-- 💡 防呆提示（可選）：如果沒有標籤，可以留空或顯示淡色提示 -->
  <p v-else class="text-xs text-gray-400 italic">在內文中輸入 #標籤 將會自動同步至此...</p>
</div>