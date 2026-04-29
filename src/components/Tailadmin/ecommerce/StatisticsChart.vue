<script setup>
import { ref } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import flatPickr from 'vue-flatpickr-component'

import 'flatpickr/dist/flatpickr.css'

const options = [
  { value: 'optionOne', label: 'Monthly' },
  { value: 'optionTwo', label: 'Quarterly' },
  { value: 'optionThree', label: 'Annually' },
]

const selected = ref('optionOne')
const date = ref('')

const flatpickrConfig = {
  mode: 'range',
  dateFormat: 'M j',
  defaultDate: [new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date()],
  animate: false,
}

const series = ref([
  {
    name: 'Sales',
    data: [180, 190, 170, 160, 175, 165, 170, 205, 230, 210, 240, 235],
  },
  {
    name: 'Revenue',
    data: [40, 30, 50, 40, 55, 40, 70, 100, 110, 120, 150, 140],
  },
])

const chartOptions = ref({
  legend: {
    show: false,
    position: 'top',
    horizontalAlign: 'left',
  },
  colors: ['#465FFF', '#9CB9FF'],
  chart: {
    fontFamily: 'Outfit, sans-serif',
    type: 'area',
    toolbar: {
      show: false,
    },
  },
  fill: {
    gradient: {
      enabled: true,
      opacityFrom: 0.55,
      opacityTo: 0,
    },
  },
  stroke: {
    curve: 'straight',
    width: [2, 2],
  },
  markers: {
    size: 0,
  },
  labels: {
    show: false,
    position: 'top',
  },
  grid: {
    xaxis: {
      lines: {
        show: false,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  tooltip: {
    x: {
      format: 'dd MMM yyyy',
    },
  },
  xaxis: {
    type: 'category',
    categories: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    tooltip: {
      enabled: false,
    },
  },
  yaxis: {
    title: {
      style: {
        fontSize: '0px',
      },
    },
  },
})
</script>

<template>
  <div
    class="rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-5 sm:px-6 sm:pt-6 dark:border-gray-800 dark:bg-white/[0.03]">
    <div class="mb-6 flex flex-col gap-5 sm:flex-row sm:justify-between">
      <div class="w-full">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Statistics</h3>
        <p class="text-theme-sm mt-1 text-gray-500 dark:text-gray-400">
          Target you’ve set for each month
        </p>
      </div>

      <div class="flex items-center gap-3">
        <div class="relative">
          <div
            class="inline-flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
            <button
              v-for="option in options"
              :key="option.value"
              @click="selected = option.value"
              :class="[
                selected === option.value
                  ? 'shadow-theme-xs bg-white text-gray-900 dark:bg-gray-800 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400',
                'text-theme-sm hover:shadow-theme-xs rounded-md px-3 py-2 font-medium hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white',
              ]">
              {{ option.label }}
            </button>
          </div>
        </div>

        <div class="relative">
          <flat-pickr
            v-model="date"
            :config="flatpickrConfig"
            class="dark:bg-dark-900 sm:text-theme-sm shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-10 w-10 rounded-lg border border-gray-200 bg-white pl-3 text-transparent placeholder:text-transparent focus:ring-3 focus:outline-hidden sm:w-40 sm:pl-9 sm:text-gray-800 sm:placeholder:text-gray-400 dark:border-gray-800 dark:bg-white/[0.03] dark:text-transparent dark:placeholder:text-transparent sm:dark:text-gray-400 sm:dark:placeholder:text-gray-400"
            placeholder="Select Date" />
          <span
            class="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-500 sm:left-3 sm:translate-x-0 dark:text-gray-400">
            <svg
              class="fill-current"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M6.66659 1.5415C7.0808 1.5415 7.41658 1.87729 7.41658 2.2915V2.99984H12.5833V2.2915C12.5833 1.87729 12.919 1.5415 13.3333 1.5415C13.7475 1.5415 14.0833 1.87729 14.0833 2.2915V2.99984L15.4166 2.99984C16.5212 2.99984 17.4166 3.89527 17.4166 4.99984V7.49984V15.8332C17.4166 16.9377 16.5212 17.8332 15.4166 17.8332H4.58325C3.47868 17.8332 2.58325 16.9377 2.58325 15.8332V7.49984V4.99984C2.58325 3.89527 3.47868 2.99984 4.58325 2.99984L5.91659 2.99984V2.2915C5.91659 1.87729 6.25237 1.5415 6.66659 1.5415ZM6.66659 4.49984H4.58325C4.30711 4.49984 4.08325 4.7237 4.08325 4.99984V6.74984H15.9166V4.99984C15.9166 4.7237 15.6927 4.49984 15.4166 4.49984H13.3333H6.66659ZM15.9166 8.24984H4.08325V15.8332C4.08325 16.1093 4.30711 16.3332 4.58325 16.3332H15.4166C15.6927 16.3332 15.9166 16.1093 15.9166 15.8332V8.24984Z"
                fill="" />
            </svg>
          </span>
        </div>
      </div>
    </div>
    <div class="custom-scrollbar max-w-full overflow-x-auto">
      <div id="chartThree" class="-ml-4 min-w-[1000px] pl-2 xl:min-w-full">
        <VueApexCharts type="area" height="310" :options="chartOptions" :series="series" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.area-chart {
  width: 100%;
}
</style>
