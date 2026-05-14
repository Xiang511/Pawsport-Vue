<script setup></script>

<template>
  <div class="min-h-screen bg-[#FCF8F2]">
    <div class="container mx-auto w-full max-w-6xl px-4">
      <!-- 左右分邊容器，flex -->
      <div class="flex flex-col gap-6 py-8 md:flex-row">
        <!-- 右邊70% -->
        <main class="w-full md:w-3/4">
          <div class="rounded-lg bg-white p-4 shadow"></div>
        </main>
        <!-- 左邊30% -->
        <aside class="w-full md:w-1/4">
          <div class="rounded-lg bg-white p-4 shadow">
            <h2 class="mb-4 font-bold">個人資料</h2>
            <!-- 這裡可以放你的分類、標籤等 -->
            <h2 class="mb-4 font-bold">我的貼文</h2>
            <h2 class="mb-4 font-bold">我的留言</h2>
            <h2 class="mb-4 font-bold">我的收藏</h2>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
