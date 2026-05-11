<script setup>
//defineProps用在顯示唯讀的資料
defineProps({
  title: String,
  summary: {
    type: String,
    default: '這篇文章沒有摘要',
  },
  author: String,
  date: String,
  image: {
    type: String,
    default: 'https://placehold.co/120x80',
  },
})
</script>

<template>
  <div class="article-card">
    <!-- 左側封面圖 -->
    <div class="image-container">
      <img :src="image" alt="cover" />
    </div>
    <!-- 右側文字 -->
    <div class="text-content">
      <h1 class="title">{{ title }}</h1>
      <p class="summary">{{ summary }}</p>
      <div class="footer">
        <span>{{ author }}</span>
        ·
        <span>{{ date }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.article-card {
  display: flex;
  gap: 20px;
  border-bottom: 2px solid rgb(57, 58, 51);
  margin: 10px;
  padding: 10px;
}
.image-container img {
  width: 120px;
  height: 80px;
  object-fit: cover; /* 避免圖片變形 */
  border-radius: 4px;
}
.title {
  font-size: 18px;
  margin: 0 0 8px 0;
  color: #2c3e50;
}
.summary {
  font-size: 14px;
  color: #666;
}
.footer {
  font-size: 12px;
  color: #666;
}
</style>
