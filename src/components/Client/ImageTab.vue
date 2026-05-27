<script setup>
// 接收父組件傳入的 HealthPassport 陣列（裡面含有 Photo 與 Note）
defineProps({
  passportRecords: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['add-image'])

const DEFAULT_PET_IMAGE = 'https://placehold.co/600x600?text=Petmily'

const handleImageError = (e) => {
  e.target.src = DEFAULT_PET_IMAGE
}
</script>

<template>
  <div>
    <div class="mb-4 flex items-center justify-between border-b pb-2">
      <h2 class="text-lg font-bold text-gray-800">影像與照片</h2>
      <button
        @click="emit('add-image')"
        class="rounded-full bg-[#9C6D6D] px-4 py-1 text-sm text-white shadow-sm hover:opacity-90">
        上傳影像
      </button>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div
        v-for="(record, index) in passportRecords.filter((r) => r.photo)"
        :key="record.passportId || record.id || index"
        class="group relative">
        <div class="aspect-square overflow-hidden rounded-2xl border border-gray-100 bg-gray-200">
          <img
            :src="record.photo || DEFAULT_PET_IMAGE"
            @error="handleImageError"
            class="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
        </div>
        <div class="mt-2">
          <p class="text-xs font-bold text-gray-800">{{ record.recordDate }}</p>
          <p class="truncate text-xs text-gray-500">{{ record.note || '無備註描述' }}</p>
        </div>
      </div>

      <div
        v-if="!passportRecords.some((r) => r.photo)"
        class="col-span-2 py-10 text-center text-gray-400">
        尚無影像紀錄照片
      </div>
    </div>
  </div>
</template>
