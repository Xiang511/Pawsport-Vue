<script setup>
defineProps({
  stories: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <section class="bg-[#FCF4E5] py-20">
    <div class="mx-auto w-[90%] max-w-7xl">
      <div class="mx-auto mb-16 max-w-2xl text-center">
        <span
          class="mb-3 inline-block rounded-full bg-[#7a6856] px-3 py-1 text-xs font-extrabold tracking-wider text-white">
          HAPPY ADOPTION STORIES
        </span>
        <h2 class="mb-4 text-3xl font-black text-[#445944] md:text-4xl">幸福見證，溫馨相遇</h2>
        <p class="text-gray-600">
          每一個毛孩都是不可多得的禮物，聽聽牠們找到新家後的幸福故事與感人分享。
        </p>
      </div>

      <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div
          v-for="story in stories"
          :key="story.id"
          class="story-card overflow-hidden rounded-3xl border-4 border-[#7a6856] bg-white shadow-[4px_4px_0px_#7a6856] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_#7a6856]">
          <div class="relative h-48 overflow-hidden border-b-2 border-[#7a6856] bg-gray-50">
            <img :src="story.familyPhoto" :alt="story.title" class="h-full w-full object-cover" />
            <div
              class="absolute right-3 bottom-3 h-16 w-16 overflow-hidden rounded-full border-2 border-[#7a6856] shadow-md">
              <img
                :src="story.petPhoto"
                :alt="story.petName"
                class="h-full w-full object-cover" />
            </div>
          </div>
          <div class="p-6">
            <div class="mb-3 flex items-center gap-2">
              <span class="rounded bg-[#445944]/10 px-2 py-1 text-xs font-bold text-[#445944]">
                領養家庭: {{ story.ownerName }}
              </span>
              <span class="rounded bg-[#9C6D6D]/10 px-2 py-1 text-xs font-bold text-[#9C6D6D]">
                {{ story.petName }}
              </span>
            </div>
            <h3 class="mb-3 text-lg font-black text-[#7a6856]">{{ story.title }}</h3>
            <p class="text-xs leading-relaxed font-medium text-gray-600 italic md:text-sm">
              {{ story.quote }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.story-card {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
</style>
