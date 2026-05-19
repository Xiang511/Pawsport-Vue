<script setup></script>

<template>
  <div class="min-h-screen bg-[#f9f8f3]">
    <div class="container mx-auto w-full max-w-6xl px-4">
      <!-- 左右分邊容器，flex -->
      <div class="flex flex-col gap-6 py-8 md:flex-row">
        <!-- 右邊70% -->
        <main class="w-full md:w-3/4">
          <div class="mb-4 rounded-lg bg-white p-4 shadow">
            <!-- 頭像 -->
            <div class="flex flex-row gap-3 bg-[#b8d8d4] p-4">
              <div class="h-32 w-32 overflow-hidden rounded-2xl bg-gray-200">
                <img
                  src="https://placecats.com/1000/1000"
                  alt=""
                  class="h-full w-full object-cover" />
              </div>
              <!-- 用戶資訊 -->
              <div class="flex flex-col border-l p-4">
                <h3 class="font-bold">用戶名稱</h3>
                <p class="text-sm text-gray-600">用戶簡介</p>
              </div>
            </div>
          </div>
          <div class="rounded-lg bg-white p-4 shadow">這裡放我的貼文/頁籤切換</div>
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
