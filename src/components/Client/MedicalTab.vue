<script setup>
// 接收來自父組件的 MedicalHistory 陣列
defineProps({
  records: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['add-medical'])
</script>

<template>
  <div>
    <div class="mb-4 flex items-center justify-between border-b pb-2">
      <h2 class="text-lg font-bold text-gray-800">醫療診斷紀錄</h2>
      <button
        @click="emit('add-medical')"
        class="rounded-full border border-[#9C6D6D] px-3 py-1 text-sm text-[#9C6D6D] transition hover:bg-[#9C6D6D] hover:text-white">
        + 新增診斷
      </button>
    </div>

    <div class="space-y-4">
      <div
        v-for="item in records"
        :key="item.medicalDetailId"
        class="rounded-r-xl border-l-4 border-[#9C6D6D] bg-gray-50 p-4 shadow-sm">
        <div class="mb-2 flex items-start justify-between">
          <h3 class="text-lg font-bold text-gray-800">{{ item.disease }}</h3>
          <span class="rounded-md bg-white px-2 py-1 text-xs text-gray-400 shadow-sm">
            {{ new Date(item.time).toLocaleDateString() }}
          </span>
        </div>

        <div class="grid grid-cols-1 gap-2 text-sm">
          <p class="text-gray-600">
            <span class="font-bold text-gray-800">📍 診所：</span>
            {{ item.location }}
          </p>
          <div class="mt-2 rounded-lg border border-gray-100 bg-white p-3">
            <span class="mb-1 block font-bold text-[#9C6D6D]">📋 治療說明：</span>
            <p class="leading-relaxed text-gray-700">{{ item.diseaseTreatment }}</p>
          </div>
        </div>
      </div>

      <div v-if="records.length === 0" class="py-10 text-center">
        <p class="text-gray-400">目前尚無醫療紀錄</p>
      </div>
    </div>
  </div>
</template>
