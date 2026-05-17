<script setup>
// 接收父層 (View) 傳遞過來的資料
defineProps({
  vaccines: {
    type: Array,
    required: true
  }
});
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-4 border-b pb-2">
      <h2 class="text-lg font-bold text-gray-800">施打紀錄</h2>
      <button class="text-[#9C6D6D] text-sm border border-[#9C6D6D] px-3 py-1 rounded-full hover:bg-[#9C6D6D] hover:text-white transition">
        + 新增紀錄
      </button>
    </div>

    <div class="space-y-4">
      <div v-for="item in vaccines" :key="item.historyId" class="border border-gray-100 rounded-xl p-4 bg-gray-50">
        <h3 class="font-bold text-[#9C6D6D] mb-2 flex items-center gap-2">
          💉 {{ item.type }}
        </h3>
        <ul class="text-sm text-gray-600 space-y-2">
          <li class="flex justify-between">
            <span>施打日期</span>
            <span>{{ new Date(item.time).toLocaleDateString() }}</span>
          </li>
          <li class="flex justify-between">
            <span>施打診所</span>
            <span>{{ item.location }}</span>
          </li>
          <li class="flex justify-between text-orange-600 font-bold">
            <span>下次預測施打日</span>
            <span>{{ item.forecast }}</span>
          </li>
        </ul>
      </div>

      <div v-if="vaccines.length === 0" class="text-center text-gray-400 py-4">
        目前尚無疫苗紀錄
      </div>
    </div>
  </div>
</template>