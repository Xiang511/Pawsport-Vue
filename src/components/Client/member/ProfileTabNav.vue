<script setup>
const props = defineProps({
  activeTab: { type: String, default: 'pets' },
})

const emit = defineEmits(['update:activeTab'])

const tabs = [
  { id: 'pets', label: '🐾 寵物概況' },
  { id: 'game', label: '🎮 遊戲概況' },
  { id: 'posts', label: '📝 我的文章' },
]
</script>

<template>
  <div
    class="flex gap-2 rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] p-1.5 shadow-[3px_3px_0px_#445944]">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      @click="emit('update:activeTab', tab.id)"
      :class="[
        'flex-1 rounded-xl py-2.5 text-sm font-bold transition-all',
        activeTab === tab.id
          ? 'border-2 border-[#445944] bg-[#445944] text-white shadow-[2px_2px_0px_#445944]'
          : 'text-gray-600',
      ]">
      {{ tab.label }}
    </button>
  </div>
</template>
