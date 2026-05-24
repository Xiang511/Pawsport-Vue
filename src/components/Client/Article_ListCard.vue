<script setup>
import { computed } from 'vue'
import { Heart } from 'lucide-vue-next'

//defineProps用在顯示唯讀的資料
const props = defineProps({
  id: [Number, String],
  title: { type: String, required: true },
  summary: { type: String, default: '這篇文章沒有摘要' },
  author: { type: String, default: '未知作者' },
  date: { type: String, default: '' }, // 建議格式: "2026-05-13 10:30"
  image: { type: String, default: 'https://placehold.co/400x260' },
  categoryid: { type: Number, default: 0 },
  category: { type: String, default: '未分類' },
  tags: { type: Array, default: () => [] },
  viewCount: { type: Number, default: 0 },
  bookmarkCount: { type: Number, default: 0 },
  isBookmarked: { type: Boolean, default: false },
})

const emit = defineEmits(['toggle-bookmark', 'click-card'])

// 處理 yyyy-mm-dd-hh-MM 格式
const displayDate = computed(() => {
  if (!props.date) return '近期發表'
  try {
    const d = new Date(props.date.replace(/-/g, '/'))
    if (isNaN(d.getTime())) return props.date // 如果本來就是乾淨的字串就直接回傳
    const Y = d.getFullYear()
    const M = String(d.getMonth() + 1).padStart(2, '0')
    const D = String(d.getDate()).padStart(2, '0')
    const hh = String(d.getHours()).padStart(2, '0')
    const mm = String(d.getMinutes()).padStart(2, '0')
    return `${Y}-${M}-${D} ${hh}:${mm}`
  } catch {
    return props.date
  }
})

const handleCardClick = () => {
  emit('click-card', props.id)
}

const handleBookmark = (e) => {
  e.stopPropagation() // 防止觸發整張卡片的點擊
  emit('toggle-bookmark', props.id)
}
</script>

<template>
  <div class="article-card" @click="handleCardClick">
    <!-- 外層邊框裝飾 (Hover時出現) -->
    <div class="hover-border"></div>

    <div class="card-container">
      <!-- 區塊 A：左側分類 (固定寬度，文字垂直排列) -->
      <aside class="side-info">
        <div class="category-label" :data-category="categoryid">{{ category }}</div>
        <!-- 巴哈常見的推薦數/回覆數會放在這裡 -->
        <div class="bookmark-count-box">{{ bookmarkCount }}</div>
      </aside>

      <!-- 區塊 B：縮圖 (固定尺寸，不隨內容撐開) -->
      <div class="image-box">
        <img :src="image" :alt="title" />
      </div>

      <!-- 區塊 C：主標題與摘要 (彈性伸縮，佔據最大空間) -->
      <main class="main-content">
        <h2 class="article-title">
          <header class="meta-tags">
            <span v-for="tag in tags" :key="tag" class="tag">#{{ tag }}</span>
          </header>
          {{ title }}
        </h2>
        <p class="article-summary">{{ summary }}</p>
      </main>

      <!-- 區塊 D：右側資訊區 (日期、作者、收藏按鈕) -->
      <footer class="card-footer">
        <div class="interaction-group">
          <div class="counter">
            <span class="num">{{ viewCount }}</span>
            <span class="icon">次點閱</span>
          </div>
        </div>

        <div class="author-info">
          <span class="author-name">{{ author }}</span>
          <span class="post-date">{{ displayDate }}</span>
        </div>

        <slot name="action">
          <button
            class="bookmark-heart"
            :class="{ active: isBookmarked }"
            @click.stop="handleBookmark"
            aria-label="收藏文章">
            <Heart />
          </button>
        </slot>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.article-card {
  --c-primary: #d4a373;
  --c-border: #e8e4de;
  --c-bg-hover: #faf9f7;

  position: relative;
  background: #fff;
  cursor: pointer;
  padding: 12px 16px; /* 縮減上下 padding 變長型 */
  border-bottom: 1px solid var(--c-border);
  transition: background-color 0.2s;
}

.article-card:hover {
  background-color: var(--c-bg-hover);
}

.card-container {
  display: flex;
  align-items: center; /* 垂直居中 */
  gap: 20px;
}

/* 區塊 A: 分類 */
.side-info {
  width: 80px;
  flex-shrink: 0;
  text-align: center;
  border-right: 1px solid #f0f0f0;
}
.category-label {
  font-size: 13px;
  color: #999;
}
.bookmark-count-box {
  font-size: 18px;
  font-weight: bold;
  color: var(--c-primary);
  margin-top: 4px;
}

/* 區塊 B: 圖片縮小 */
.image-box {
  width: 110px;
  height: 70px;
  flex-shrink: 0;
  border-radius: 4px;
  overflow: hidden;
  background: #eee;
}
.image-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 區塊 C: 標題內容 */
.main-content {
  flex: 1;
  min-width: 0; /* 防止溢出 */
}
.meta-tags {
  display: inline-flex;
  gap: 5px;
  margin-right: 8px;
}
.tag {
  font-size: 12px;
  color: #999;
}
.article-title {
  font-size: 17px;
  font-weight: 600;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #333;
}
.article-summary {
  font-size: 13px;
  color: #888;
  margin: 4px 0 0 0;
  display: -webkit-box;
  -webkit-line-clamp: 1; /* 只給一行，保持長型 */
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 區塊 D: 右側數據區 (關鍵) */
.card-footer {
  width: 180px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 15px;
  text-align: right;
}

.author-info {
  display: flex;
  flex-direction: column;
  font-size: 12px;
  color: #778ca3;
}
.post-date {
  color: #bbb;
  margin-top: 2px;
}

.interaction-group {
  font-size: 12px;
  color: #aaa;
}
.counter .num {
  display: block;
  font-weight: bold;
  color: #666;
}

.bookmark-heart {
  background: none;
  border: none;
  color: #ddd;
  cursor: pointer;
  transition: color 0.2s;
  padding: 5px;
}
.bookmark-heart.active {
  color: #ff5252;
}
.bookmark-heart svg {
  fill: currentColor;
}

/* Hover 裝飾 */
.hover-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-left: 4px solid transparent;
  pointer-events: none;
}
.article-card:hover .hover-border {
  border-left-color: var(--c-primary);
}

@media (max-width: 768px) {
  .card-footer,
  .side-info {
    display: none;
  } /* 手機版簡化 */
}
</style>
