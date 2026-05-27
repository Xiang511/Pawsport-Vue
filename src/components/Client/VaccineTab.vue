<script setup>
// 接收父層 (View) 傳遞過來的資料
defineProps({
  vaccines: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['add-vaccine'])
</script>

<template>
  <div>
    <div class="mb-4 flex items-center justify-between border-b pb-2">
      <h2 class="text-lg font-bold text-gray-800">施打紀錄</h2>
      <button
        @click="emit('add-vaccine')"
        class="rounded-full border border-[#9C6D6D] px-3 py-1 text-sm text-[#9C6D6D] transition hover:bg-[#9C6D6D] hover:text-white">
        + 新增紀錄
      </button>
    </div>

    <div class="space-y-4">
      <div
        v-for="item in vaccines"
        :key="item.historyId"
        class="rounded-xl border border-gray-100 bg-gray-50 p-4">
        <h3 class="mb-2 flex items-center gap-2 font-bold text-[#9C6D6D]">💉 {{ item.type }}</h3>
        <ul class="space-y-2 text-sm text-gray-600">
          <li class="flex justify-between">
            <span>施打日期</span>
            <span>{{ new Date(item.time).toLocaleDateString() }}</span>
          </li>
          <li class="flex justify-between">
            <span>施打診所</span>
            <span>{{ item.location }}</span>
          </li>
          <li class="flex justify-between font-bold text-orange-600">
            <span>下次預測施打日</span>
            <span>{{ item.forecast }}</span>
          </li>
        </ul>
      </div>

      <div v-if="vaccines.length === 0" class="py-4 text-center text-gray-400">
        目前尚無疫苗紀錄
      </div>
    </div>
  </div>
</template>
