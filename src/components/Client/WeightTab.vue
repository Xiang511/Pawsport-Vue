<script setup>
import { ref } from 'vue'
import apexchart from 'vue3-apexcharts'

const emit = defineEmits(['add-weight'])

// 接收來自父組件的體重紀錄
const props = defineProps({
  records: {
    type: Array,
    default: () => [
      // 提供一些預設的假資料，以便在沒有資料時也能顯示圖表
      { id: 1, date: '2024-01-10', weight: 5.2 },
      { id: 2, date: '2024-02-15', weight: 5.5 },
      { id: 3, date: '2024-03-12', weight: 5.8 },
      { id: 4, date: '2024-04-18', weight: 5.6 },
      { id: 5, date: '2024-05-10', weight: 6.0 },
    ],
  },
})

// 圖表設定
const chartOptions = ref({
  chart: {
    id: 'weight-chart',
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },
  xaxis: {
    categories: props.records.map((r) => r.date),
    labels: {
      style: {
        colors: '#64748b',
        fontSize: '12px',
      },
    },
  },
  yaxis: {
    labels: {
      formatter: (val) => `${val} kg`,
      style: {
        colors: '#64748b',
        fontSize: '12px',
      },
    },
  },
  stroke: {
    curve: 'smooth',
    colors: ['#9C6D6D'],
    width: 3,
  },
  markers: {
    size: 5,
    colors: ['#9C6D6D'],
    strokeColors: '#fff',
    strokeWidth: 2,
  },
  colors: ['#9C6D6D'],
  grid: {
    borderColor: '#f1f5f9',
    xaxis: {
      lines: {
        show: true,
      },
    },
  },
  tooltip: {
    y: {
      formatter: (val) => `${val} kg`,
    },
  },
})

// 圖表資料
const series = ref([
  {
    name: '體重',
    data: props.records.map((r) => r.weight),
  },
])
</script>

<template>
  <div>
    <div class="mb-4 flex items-center justify-between border-b pb-2">
      <h2 class="text-lg font-bold text-gray-800">體重紀錄</h2>
      <button
        @click="emit('add-weight')"
        class="rounded-full border border-[#9C6D6D] px-3 py-1 text-sm text-[#9C6D6D] transition hover:bg-[#9C6D6D] hover:text-white">
        + 新增體重
      </button>
    </div>

    <!-- 圖表區塊 -->
    <div class="mb-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <apexchart type="line" height="250" :options="chartOptions" :series="series" />
    </div>

    <!-- 列表區塊 -->
    <div class="space-y-3">
      <div
        v-for="item in records"
        :key="item.id"
        class="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4 transition hover:bg-gray-100">
        <div class="flex items-center gap-3">
          <span class="flex h-10 w-10 items-center justify-center rounded-full bg-[#F7F3F1] text-[#9C6D6D]">
            ⚖️
          </span>
          <div>
            <p class="font-bold text-gray-800">{{ item.weight }} kg</p>
            <p class="text-xs text-gray-400">{{ new Date(item.date).toLocaleDateString() }}</p>
          </div>
        </div>
        <button class="text-xs text-gray-400 hover:text-[#9C6D6D]">編輯</button>
      </div>

      <div v-if="records.length === 0" class="py-10 text-center text-gray-400">目前尚無體重紀錄</div>
    </div>
  </div>
</template>

<style scoped>
/* 可以加入一些局部的樣式調整 */
</style>
