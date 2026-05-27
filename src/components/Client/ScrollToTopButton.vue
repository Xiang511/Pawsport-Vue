<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { ChevronUp } from 'lucide-vue-next'

const isVisible = ref(false)

const handleScroll = () => {
  isVisible.value = window.scrollY > 300
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

onMounted(() => {
  handleScroll()
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <button
    v-show="isVisible"
    type="button"
    class="fixed right-6 bottom-6 z-50 flex h-12 w-12 items-center justify-center rounded-2xl border-4 border-[#445944] bg-[#FCF4E5] text-[#445944] shadow-[4px_4px_0px_#445944] transition-all duration-300 hover:bg-amber-400 hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_#445944] active:translate-y-[1px] active:shadow-[2px_2px_0px_#445944] cursor-pointer"
    @click="scrollToTop"
    aria-label="回到最上方">
    <ChevronUp class="h-6 w-6 stroke-[3]" />
  </button>
</template>

<style scoped></style>
