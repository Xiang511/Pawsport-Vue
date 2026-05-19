<script setup>
const colorPalette = [
  {
    name: 'Primary / Success',
    colors: [
      { hex: '#99cc99' },
      { hex: '#91c191' },
      { hex: '#88b588' },
      { hex: '#80aa80' },
      { hex: '#779e77' },
      { hex: '#6f936f' },
      { hex: '#668766' },
      { hex: '#5e7c5e' },
      { hex: '#557055' },
      { hex: '#4d654d' },
      { hex: '#445944' },
    ],
  },
  {
    name: 'Secondary / Info',
    colors: [
      { hex: '#99ccda' },
      { hex: '#92c2cf' },
      { hex: '#8ab8c5' },
      { hex: '#83aeba' },
      { hex: '#7ba4b0' },
      { hex: '#749ba5' },
      { hex: '#6d919a' },
      { hex: '#658790' },
      { hex: '#5e7d85' },
      { hex: '#56737b' },
      { hex: '#4f6970' },
    ],
  },
  {
    name: 'Warning',
    colors: [
      { hex: '#f2e572' },
      { hex: '#f2e36e' },
      { hex: '#f2e26b' },
      { hex: '#f2e067' },
      { hex: '#f2de63' },
      { hex: '#f2dd60' },
      { hex: '#f2db5c' },
      { hex: '#f2d958' },
      { hex: '#f2d754' },
      { hex: '#f2d651' },
      { hex: '#f2d44d' },
    ],
  },
  {
    name: 'Error',
    colors: [
      { hex: '#f5ba88' },
      { hex: '#f5b485' },
      { hex: '#f5ae82' },
      { hex: '#f5a880' },
      { hex: '#f5a27d' },
      { hex: '#f59c7a' },
      { hex: '#f59677' },
      { hex: '#f59074' },
      { hex: '#f58a72' },
      { hex: '#f5846f' },
      { hex: '#f57e6c' },
    ],
  },
]
</script>
<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <h1 class="mb-8 text-2xl font-bold text-gray-800">系統顏色範本 (Color Palette)</h1>

    <div v-for="category in colorPalette" :key="category.name" class="mb-10">
      <h2
        :style="{ color: category.colors[5].hex }"
        class="mb-4 text-lg font-bold tracking-wider uppercase">
        {{ category.name }}
      </h2>

      <div class="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-11">
        <div
          v-for="(color, index) in category.colors"
          :key="index"
          class="flex flex-col items-center">
          <div
            class="mb-2 flex h-16 w-full items-center justify-center rounded-md font-mono text-[10px] text-white shadow-sm"
            :style="{ backgroundColor: color.hex }">
            <span class="rounded bg-black/20 px-1">{{ color.hex }}</span>
          </div>
          <span class="text-xs font-medium text-gray-500 italic">Level {{ index + 1 }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
