<script setup>
// 定義 Props
const props = defineProps({
  pageTitle: String,
  items: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <h2 class="text-title-md2 font-bold text-black dark:text-white">
      {{ pageTitle }}
    </h2>

    <nav>
      <ol class="flex items-center gap-2">
        <template v-for="(item, index) in items" :key="index">
          <li>
            <router-link
              v-if="item.route && index !== items.length - 1"
              :to="item.route"
              class="hover:text-primary font-medium text-gray-500">
              {{ item.name }}
            </router-link>

            <span v-else class="text-primary font-medium">
              {{ item.name }}
            </span>
          </li>

          <li v-if="index !== items.length - 1" class="font-medium text-gray-500">/</li>
        </template>
      </ol>
    </nav>
  </div>
</template>
