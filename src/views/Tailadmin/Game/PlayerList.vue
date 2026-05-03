<script setup>
import { ref } from 'vue'

// 模擬玩家資料
const players = ref([
  { id: 1, createdAt: '2026-03-26 22:15', points: 15000, skins: 1, progress: '第 100 關', lastLogin: '2026-03-26 22:15' },
  { id: 2, createdAt: '2026-03-25 14:30', points: 450, skins: 3, progress: '第 15 關', lastLogin: '2026-03-25 14:30' },
  { id: 3, createdAt: '2025-11-12 09:00', points: 0, skins: 2, progress: '第 2 關', lastLogin: '2025-11-12 09:00' },
  { id: 4, createdAt: '2026-03-26 23:45', points: 88200, skins: 2, progress: '第 50 關', lastLogin: '2026-03-26 23:45' },
  { id: 5, createdAt: '2026-03-20 18:22', points: 2100, skins: 2, progress: '第 68 關', lastLogin: '2026-03-20 18:22' },
])

// 分頁狀態（假資料用）
const currentPage = ref(1)
</script>

<template>
  <!-- 標題欄 -->
  <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div class="flex items-center gap-6">
      <h2 class="text-2xl font-bold text-gray-800">玩家管理</h2>
    </div>
  </div>

  <!-- 表格主體 -->
  <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
    <div class="max-w-full overflow-x-auto">
      <table class="w-full table-auto">
        <thead>
          <tr class="border-b border-gray-100 dark:border-gray-800 text-center">
            <th class="px-4 py-4 font-semibold text-gray-500 text-theme-sm uppercase tracking-wider">會員檔案</th>
            <th class="px-4 py-4 font-semibold text-gray-500 text-theme-sm uppercase tracking-wider">玩家ID</th>
            <th class="px-4 py-4 font-semibold text-gray-500 text-theme-sm uppercase tracking-wider">玩家資料建立時間</th>
            <th class="px-4 py-4 font-semibold text-gray-500 text-theme-sm uppercase tracking-wider">現有點數</th>
            <th class="px-4 py-4 font-semibold text-gray-500 text-theme-sm uppercase tracking-wider">持有造型數量</th>
            <th class="px-4 py-4 font-semibold text-gray-500 text-theme-sm uppercase tracking-wider">遊玩進度</th>
            <th class="px-4 py-4 font-semibold text-gray-500 text-theme-sm uppercase tracking-wider">最後遊玩時間</th>
            <th class="px-4 py-4 font-semibold text-gray-500 text-theme-sm uppercase tracking-wider">動作</th>
          </tr>
        </thead>
        
        <tbody class="divide-y divide-gray-50 dark:divide-gray-800">
          <tr v-for="player in players" :key="player.id" class="hover:bg-gray-25/50 transition-colors text-center">
            <!-- 查看會員檔案按鈕 -->
            <td class="px-4 py-4">
              <button
                  class="bg-brand-info-800 text-theme-sm hover:bg-brand-info-900 shadow-theme-sm inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 font-semibold text-white transition-all active:scale-95">
                  查看會員檔案
                </button>
            </td>
            
            <td class="px-4 py-4 text-theme-sm text-gray-800">{{ player.id }}</td>
            <td class="px-4 py-4 text-theme-sm text-gray-500 ">{{ player.createdAt }}</td>
            <td class="px-4 py-4 text-theme-sm text-gray-500 font-medium">{{ player.points.toLocaleString() }}</td>
            <td class="px-4 py-4 text-theme-sm text-gray-500">{{ player.skins }}</td>
            <td class="px-4 py-4 text-theme-sm text-gray-500">{{ player.progress }}</td>
            <td class="px-4 py-4 text-theme-sm text-gray-500 ">{{ player.lastLogin }}</td>
            
            <!-- 動作按鈕群 -->
            <td class="px-4 py-4 text-center">
              <div class="flex items-center justify-center gap-2">
                <button
                  class="bg-brand-warning-800 text-theme-sm hover:bg-brand-warning-900 shadow-theme-sm inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 font-semibold text-white transition-all active:scale-95">
                  編輯
                </button>
                <button
                  class="bg-brand-error-500 text-theme-sm hover:bg-brand-error-600 shadow-theme-sm inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 font-semibold text-white transition-all active:scale-95">
                  刪除
                </button>
                <button
                  class="bg-brand-info-800 text-theme-sm hover:bg-brand-info-900 shadow-theme-sm inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 font-semibold text-white transition-all active:scale-95">
                  交易紀錄
                </button>
                <button
                  class="bg-brand-success-800 text-theme-sm hover:bg-brand-success-900 shadow-theme-sm inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 font-semibold text-white transition-all active:scale-95">
                  消費紀錄
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 底部：分頁控制 -->
    <div class="mt-6 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-6 sm:flex-row dark:border-gray-800">
      <p class="text-theme-sm text-gray-500">
        第 {{ currentPage }} 頁，共 2 頁 (總計 20 筆玩家)
      </p>
      <div class="flex items-center gap-2">
        <button class="rounded-lg border border-gray-200 px-3 py-1 text-theme-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">〈 上一頁</button>
        <button class="rounded-lg bg-brand-info-800 px-3 py-1 text-theme-sm font-medium text-white shadow-sm">1</button>
        <button class="rounded-lg border border-gray-200 px-3 py-1 text-theme-sm font-medium text-gray-500 hover:bg-gray-50">2</button>
        <button class="rounded-lg border border-gray-200 px-3 py-1 text-theme-sm font-medium text-gray-500 hover:bg-gray-50">下一頁 〉</button>
      </div>
    </div>
  </div>
</template>