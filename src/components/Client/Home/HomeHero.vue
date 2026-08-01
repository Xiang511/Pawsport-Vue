<script setup>
import { Dog, MessageCircle, Sparkles } from 'lucide-vue-next'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/effect-fade'
import { carouselImages } from '@/constants/Client/Home/carouselData'
</script>

<template>
  <header class="hero-container relative overflow-hidden bg-[#FCF4E5] pt-8 pb-16 lg:py-24">
    <!-- Background floating ornaments -->
    <div class="pointer-events-none absolute inset-0 z-0 opacity-15">
      <svg
        class="animate-float absolute top-12 left-10 h-24 w-24 text-[#445944]"
        viewBox="0 0 100 100">
        <path
          fill="currentColor"
          d="M30,50 C30,35 40,25 50,25 C60,25 70,35 70,50 C70,65 60,75 50,75 C40,75 30,65 30,50 Z" />
        <circle cx="25" cy="30" r="10" fill="currentColor" />
        <circle cx="42" cy="15" r="10" fill="currentColor" />
        <circle cx="62" cy="15" r="10" fill="currentColor" />
        <circle cx="78" cy="30" r="10" fill="currentColor" />
      </svg>
      <svg
        class="animate-float-delayed absolute right-16 bottom-16 h-32 w-32 text-[#9C6D6D]"
        viewBox="0 0 100 100">
        <path
          fill="currentColor"
          d="M10,40 C10,30 20,20 30,20 C45,20 50,35 50,35 C50,35 55,20 70,20 C80,20 90,30 90,40 C90,65 50,85 50,85 C50,85 10,65 10,40 Z" />
      </svg>
    </div>

    <div
      class="relative z-10 mx-auto grid w-[90%] max-w-7xl grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
      <!-- Hero Left Info -->
      <div class="hero-left flex flex-col justify-center lg:col-span-6">
        <div
          class="font-fredoka mb-6 inline-flex w-max items-center gap-2 rounded-full bg-[#7a6856] px-4 py-1.5 text-sm font-semibold tracking-wider text-white shadow-sm">
          <Sparkles :size="16" class="animate-spin-slow" />
          WELCOME TO PETMILY
        </div>
        <h1 class="mb-6 text-4xl leading-tight font-black text-[#445944] md:text-5xl lg:text-6xl">
          為愛啓航，與命定的
          <br class="hidden md:block" />
          <span class="relative z-10 inline-block px-2 text-[#7a6856]">
            毛茸夥伴
            <span
              class="absolute right-0 bottom-1.5 left-0 -z-10 h-3 -rotate-1 transform rounded bg-[#FAE4AE] md:h-5"></span>
          </span>
          不期而遇
        </h1>
        <p class="mb-8 max-w-xl text-base leading-relaxed text-gray-700 md:text-lg">
          在寵物飼養風氣盛行的當下，Petmily
          致力於打造讓人安心的寵物整合平台。我們以「領養代替購買」為核心，不僅為浪浪尋找溫暖歸屬，更全方位守護寵物與飼主的一生。給牠一個家，就是給自己最真摯的幸福。
        </p>
        <div class="flex flex-col gap-4 sm:flex-row">
          <router-link
            to="/adopt"
            class="group flex items-center justify-center gap-2 rounded-2xl border-2 border-[#445944] bg-[#445944] px-8 py-4 text-lg font-bold text-white transition-all hover:translate-x-[3px] hover:translate-y-[3px]">
            <Dog :size="22" class="group-hover:bounce" />
            立即探索領養
          </router-link>
          <router-link
            to="/community-home"
            class="flex items-center justify-center gap-2 rounded-2xl border-2 border-[#445944] bg-white px-8 py-4 text-lg font-bold text-[#445944] transition-all hover:translate-x-[3px] hover:translate-y-[3px]">
            <MessageCircle :size="20" />
            前往社群交流
          </router-link>
        </div>
      </div>

      <!-- Hero Right Carousel -->
      <div class="hero-right lg:col-span-6">
        <div
          class="relative rounded-3xl border-4 border-[#445944] bg-white p-4 shadow-[8px_8px_0px_#445944]">
          <swiper
            :modules="[Autoplay, Pagination, Navigation, EffectFade]"
            :slides-per-view="1"
            :loop="true"
            :effect="'fade'"
            :autoplay="{ delay: 4000, disableOnInteraction: false }"
            :pagination="{ clickable: true, el: '.custom-hero-pagination' }"
            class="h-[300px] overflow-hidden rounded-2xl md:h-[400px]">
            <swiper-slide v-for="(img, idx) in carouselImages" :key="idx" class="relative">
              <img :src="img.url" :alt="img.title" class="h-full w-full object-cover" />
              <div
                class="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 text-white">
                <h3 class="mb-2 text-xl font-bold md:text-2xl">{{ img.title }}</h3>
                <p class="line-clamp-2 text-sm text-gray-200">{{ img.sub }}</p>
              </div>
            </swiper-slide>
          </swiper>
          <div class="custom-hero-pagination mt-4 flex justify-center gap-2"></div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&family=Quicksand:wght@300..700&display=swap');

.font-fredoka {
  font-family: 'Fredoka', 'GenJyuu', sans-serif;
}

:deep(.custom-hero-pagination) {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
}

:deep(.custom-hero-pagination .swiper-pagination-bullet) {
  background-color: #d1d5db;
  opacity: 1;
  width: 10px;
  height: 10px;
  border-radius: 9999px;
  transition: all 0.2s ease;
}

:deep(.custom-hero-pagination .swiper-pagination-bullet-active) {
  background-color: #445944;
  width: 24px;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-10px) rotate(3deg);
  }
}

@keyframes float-delayed {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(8px) rotate(-3deg);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 7s ease-in-out infinite;
  animation-delay: 1.5s;
}

.animate-spin-slow {
  animation: spin 12s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.group:hover .group-hover\:bounce {
  animation: bounce 0.6s ease infinite alternate;
}

@keyframes bounce {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-4px);
  }
}
</style>
