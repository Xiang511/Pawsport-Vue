<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

//存放文章的陣列
const Articles = ref([])

//取得文章資料
//async=表示這是非同步函式
//await=表示在取得資料前先不要讀下一行(先停在這裡)
const FetchArticles = async () => {
  //確認可以連後端api
  //data=後端傳來的資料包
  try {
    const response = await axios.get('https://localhost:7048/api/Article')
    console.log('API 回傳資料結構：', response.data)
    Articles.value = response.data.data
  } catch (error) {
    console.error('無法取得文章：', error)
  }
}

//定義status
const StatusMap = {
  0: '草稿',
  1: '公開',
  2: '私人',
}
const GetStatusLabel = (status) => {
  return StatusMap[status] || '未知狀態'
}

//打開網頁就自動執行(取得文章資料)
onMounted(() => {
  FetchArticles()
})
</script>

<template>
  <div
    class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
    <div class="custom-scrollbar max-w-full overflow-x-auto">
      <table class="min-w-full">
        <thead>
          <tr class="border-b border-gray-200 dark:border-gray-700">
            <th class="w-1/12 px-5 py-3 text-left sm:px-6">
              <p class="text-theme-xs font-medium text-gray-500">首圖</p>
            </th>
            <th class="w-3/12 px-5 py-3 text-left sm:px-6">
              <p class="text-theme-xs font-medium text-gray-500">標題/作者</p>
            </th>
            <th class="w-2/12 px-5 py-3 text-left sm:px-6">
              <p class="text-theme-xs font-medium text-gray-500">發文日期</p>
            </th>
            <th class="w-2/12 px-5 py-3 text-left sm:px-6">
              <p class="text-theme-xs font-medium text-gray-500">狀態</p>
            </th>
            <th class="w-2/12 px-5 py-3 text-left sm:px-6">
              <p class="text-theme-xs font-medium text-gray-500">分類</p>
            </th>
            <th class="w-2/12 px-5 py-3 text-left sm:px-6">
              <p class="text-theme-xs font-medium text-gray-500">功能</p>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <!-- 💡 這裡統一使用小寫 article 變數名，避免混淆 -->
          <tr
            v-for="article in Articles"
            :key="article.articleId || article.articleid"
            class="border-t border-gray-100">
            <!-- 首圖 -->
            <td class="px-5 py-4 sm:px-6">
              <div class="flex items-center gap-3">
                <div
                  class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-100 text-lg">
                  🍕
                </div>
              </div>
            </td>

            <!-- 標題/作者 -->
            <td class="px-5 py-4 sm:px-6">
              <div>
                <span class="text-theme-sm block font-medium text-gray-800">
                  {{ article.title }}
                </span>
                <span class="text-theme-xs block text-gray-500">
                  {{ article.userName }}
                </span>
              </div>
            </td>

            <!-- 發文日期 -->
            <td class="px-5 py-4 sm:px-6">
              <p class="text-theme-sm text-gray-500">
                {{ new Date(article.createAt).toLocaleDateString() }}
              </p>
            </td>

            <!-- 狀態 -->
            <td class="px-5 py-4 sm:px-6">
              <span
                :class="[
                  'rounded-full px-2 py-0.5 text-xs font-medium',
                  {
                    'bg-gray-100 text-gray-600': article.status === 0, // 草稿用灰色
                    'bg-success-50 text-success-700': article.status === 1, // 公開用綠色
                    'bg-blue-50 text-blue-700': article.status === 2, // 私人用藍色
                  },
                ]">
                {{ GetStatusLabel(article.status) }}
              </span>
            </td>

            <!-- 分類 -->
            <td class="px-5 py-4 sm:px-6">
              <p class="text-theme-sm text-gray-500">
                {{ article.categoryName }}
              </p>
            </td>

            <!-- 功能 -->
            <td class="px-5 py-4 sm:px-6">
              <button class="text-theme-sm mr-3 text-blue-500 hover:underline">編輯</button>
              <button class="text-theme-sm text-red-500 hover:underline">刪除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
/* Add any additional styles here if needed */
</style>
