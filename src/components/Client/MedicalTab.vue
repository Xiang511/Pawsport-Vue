<script setup>
// 接收來自父組件的 MedicalHistory 陣列
defineProps({
  records: {
    type: Array,
    default: () => []
  }
});
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-4 border-b pb-2">
      <h2 class="text-lg font-bold text-gray-800">醫療診斷紀錄</h2>
      <button class="text-[#9C6D6D] text-sm border border-[#9C6D6D] px-3 py-1 rounded-full hover:bg-[#9C6D6D] hover:text-white transition">
        + 新增診斷
      </button>
    </div>

    <div class="space-y-4">
      <div v-for="item in records" :key="item.medicalDetailId" class="border-l-4 border-[#9C6D6D] bg-gray-50 p-4 rounded-r-xl shadow-sm">
        <div class="flex justify-between items-start mb-2">
          <h3 class="font-bold text-lg text-gray-800">{{ item.disease }}</h3>
          <span class="text-xs text-gray-400 bg-white px-2 py-1 rounded-md shadow-sm">
            {{ new Date(item.time).toLocaleDateString() }}
          </span>
        </div>
        
        <div class="grid grid-cols-1 gap-2 text-sm">
          <p class="text-gray-600">
            <span class="font-bold text-gray-800">📍 診所：</span>{{ item.location }}
          </p>
          <div class="bg-white p-3 rounded-lg border border-gray-100 mt-2">
            <span class="font-bold text-[#9C6D6D] block mb-1">📋 治療說明：</span>
            <p class="text-gray-700 leading-relaxed">{{ item.diseaseTreatment }}</p>
          </div>
        </div>
      </div>

      <div v-if="records.length === 0" class="text-center py-10">
        <p class="text-gray-400">目前尚無醫療紀錄</p>
      </div>
    </div>
  </div>
</template>