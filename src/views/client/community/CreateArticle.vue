<script setup>
import ArticleEditor from '@/components/Client/ArticleEditor.vue'

const handleSave = () => {
  //這裡應該要觸發儲存?
}
</script>

<template>
  <!-- 頁面最外層：只寫背景顏色 -->
  <div class="min-h-screen bg-[#f9f6f4] pt-6">
    <!-- 內容區：最大1280px -->
    <div class="container mx-auto w-full max-w-6xl px-4">
      <!-- 左右分邊容器，flex -->
      <div class="flex flex-col gap-6 py-8 md:flex-row">
        <div class="page-container">
          <!-- 編輯器元件 -->
          <ArticleEditor @save="handleSave" />
        </div>
        <!-- 左邊30% -->
        <aside class="w-full md:w-1/4">
          <div class="rounded-lg bg-white p-4 shadow">
            <h2 class="mb-4 font-bold">個人資料</h2>
            <!-- 這裡可以放你的分類、標籤等 -->
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
