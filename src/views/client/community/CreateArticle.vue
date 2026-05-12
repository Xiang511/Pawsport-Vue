<script setup>
import ArticleEditor from '@/components/Client/ArticleEditor.vue'

const handleSave = () => {
  //這裡應該要觸發儲存?
}
</script>

<template>
  <!-- 頁面最外層：只寫背景顏色 -->
  <div class="min-h-screen bg-[#FCF8F2]">
    <!-- 內容區：最大1280px -->
    <div class="container mx-auto w-full max-w-7xl px-4">
      <div class="page-container">
        <!-- 編輯器元件 -->
        <ArticleEditor @save="handleSave" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
