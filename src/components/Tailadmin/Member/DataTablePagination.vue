<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  totalEntries: {
    type: Number,
    required: false,
  },
  startEntry: {
    type: Number,
    required: false,
  },
  endEntry: {
    type: Number,
    required: false,
  },
})

const emit = defineEmits(['goToPage', 'nextPage', 'prevPage'])

const pagesAroundCurrent = computed(() => {
  let pages = []
  const startPage = Math.max(2, props.currentPage - 2)
  const endPage = Math.min(props.totalPages - 1, props.currentPage + 2)
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }
  return pages
})

function goToPage(page) {
  emit('goToPage', page)
}

function nextPage() {
  emit('nextPage')
}

function prevPage() {
  emit('prevPage')
}
</script>
<template>
  <div
    class="flex flex-col items-center justify-between gap-4 border-t border-gray-200 px-5 py-4 sm:flex-row dark:border-gray-800">
    <div class="text-theme-sm text-gray-500 dark:text-gray-400">
      顯示 {{ startEntry }} 到 {{ endEntry }} 筆，共 {{ totalEntries }} 筆
    </div>
    <div class="flex items-center gap-2">
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        :class="[
          'flex h-9 w-9 items-center justify-center rounded-lg border transition-all',
          currentPage === 1
            ? 'cursor-not-allowed border-gray-200 text-gray-400 dark:border-gray-800 dark:text-gray-600'
            : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800',
        ]">
        <svg
          class="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        v-if="totalPages > 0"
        @click="goToPage(1)"
        :class="[
          'flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition-all',
          currentPage === 1
            ? 'border-brand-success-500 bg-brand-success-500 text-white'
            : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800',
        ]">
        1
      </button>

      <span
        v-if="pagesAroundCurrent.length > 0 && pagesAroundCurrent[0] > 2"
        class="text-gray-500 dark:text-gray-400">
        ...
      </span>

      <button
        v-for="page in pagesAroundCurrent"
        :key="page"
        @click="goToPage(page)"
        :class="[
          'flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition-all',
          currentPage === page
            ? 'border-brand-success-500 bg-brand-success-500 text-white'
            : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800',
        ]">
        {{ page }}
      </button>

      <span
        v-if="
          pagesAroundCurrent.length > 0 &&
          pagesAroundCurrent[pagesAroundCurrent.length - 1] < totalPages - 1
        "
        class="text-gray-500 dark:text-gray-400">
        ...
      </span>

      <button
        v-if="totalPages > 1"
        @click="goToPage(totalPages)"
        :class="[
          'flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition-all',
          currentPage === totalPages
            ? 'border-brand-success-500 bg-brand-success-500 text-white'
            : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800',
        ]">
        {{ totalPages }}
      </button>

      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        :class="[
          'flex h-9 w-9 items-center justify-center rounded-lg border transition-all',
          currentPage === totalPages
            ? 'cursor-not-allowed border-gray-200 text-gray-400 dark:border-gray-800 dark:text-gray-600'
            : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800',
        ]">
        <svg
          class="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
</template>
<style scoped></style>
