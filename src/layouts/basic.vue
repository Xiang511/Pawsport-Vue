<script setup>
// Basic Layout - 簡單的 layout，沒有導航列和頁尾
</script>

<template>
  <div class="basic-layout">
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped>
.basic-layout {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
}

.content {
  width: 100%;
  max-width: 1200px;
  padding: 2rem;
}
</style>
