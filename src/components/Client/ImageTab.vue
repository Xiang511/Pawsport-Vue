<script setup>
// 接收父組件傳入的 HealthPassport 陣列（裡面含有 Photo 與 Note）
defineProps({
  passportRecords: {
    type: Array,
    default: () => []
  }
});
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-4 border-b pb-2">
      <h2 class="text-lg font-bold text-gray-800">影像與照片</h2>
      <button class="bg-[#9C6D6D] text-white text-sm px-4 py-1 rounded-full shadow-sm hover:opacity-90">
        上傳影像
      </button>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div v-for="record in passportRecords.filter(r => r.photo)" :key="record.passportId" class="group relative">
        <div class="aspect-square overflow-hidden rounded-2xl border border-gray-100 bg-gray-200">
          <img :src="record.photo" class="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
        </div>
        <div class="mt-2">
          <p class="text-xs font-bold text-gray-800">{{ record.recordDate }}</p>
          <p class="text-xs text-gray-500 truncate">{{ record.note || '無備註描述' }}</p>
        </div>
      </div>
      
      <div v-if="!passportRecords.some(r => r.photo)" class="col-span-2 text-center py-10 text-gray-400">
        尚無影像紀錄照片
      </div>
    </div>
  </div>
</template>