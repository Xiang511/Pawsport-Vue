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
    class="fixed right-6 bottom-6 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-transparent bg-[#f7ebe5] text-[#9c6d6d] shadow-md transition-all hover:-translate-y-0.5 hover:border-[#d4a373] hover:bg-[#fbf5f1]"
    @click="scrollToTop"
    aria-label="回到最上方">
    <ChevronUp class="h-5 w-5" />
  </button>
</template>
