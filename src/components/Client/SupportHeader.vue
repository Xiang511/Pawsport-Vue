<script setup>
import { useRoute } from 'vue-router'
import { Cat, Rabbit, PawPrint, Bird } from 'lucide-vue-next'

const route = useRoute()
</script>

<template>
  <div>
    <!-- Support Header Section -->
    <div class="mb-10 text-center">
      <h1
        class="mb-4 flex items-center justify-center gap-3 text-4xl leading-tight font-black text-[#445944] md:text-5xl">
        <Cat class="h-10 w-10 animate-bounce text-[#445944]" />
        <span class="relative z-10 inline-block px-3 py-1">
          客服中心
          <span
            class="absolute right-0 bottom-1 left-0 -z-10 h-3 -rotate-1 transform rounded bg-[#FAE4AE] md:h-4"></span>
        </span>
      </h1>
      <p class="text-lg font-bold text-[#7a6856]">關於 Petmily 的疑難雜症，都在這裡為您解答！ 🐾</p>
    </div>

    <!-- Navigation Tab Buttons -->
    <div class="mb-12 flex flex-col items-center justify-center gap-6 sm:flex-row">
      <!-- FAQ Link -->
      <router-link
        :to="{ name: 'Client-faq' }"
        :class="[
          'group flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-[#445944] px-8 py-4 text-lg font-black transition-all duration-300 active:scale-95 sm:w-auto',
          route.name === 'Client-faq'
            ? 'bg-[#445944] text-white shadow-[4px_4px_0px_#445944]'
            : 'bg-white text-[#445944] shadow-[4px_4px_0px_#445944] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_#445944] active:translate-y-[3px] active:shadow-[1px_1px_0px_#445944]',
        ]">
        <Rabbit
          :class="[
            'h-6 w-6 transition-transform duration-300',
            route.name === 'Client-faq'
              ? 'scale-110 rotate-3'
              : 'group-hover:scale-110 group-hover:-rotate-3',
          ]" />
        常見問答 ｜ F A Q
      </router-link>

      <!-- Contact Us Link -->
      <router-link
        :to="{ name: 'Client-qa' }"
        :class="[
          'group flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-[#445944] px-8 py-4 text-lg font-black transition-all duration-300 active:scale-95 sm:w-auto',
          route.name === 'Client-qa'
            ? 'bg-[#445944] text-white shadow-[4px_4px_0px_#445944]'
            : 'bg-white text-[#445944] shadow-[4px_4px_0px_#445944] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_#445944] active:translate-y-[3px] active:shadow-[1px_1px_0px_#445944]',
        ]">
        <PawPrint
          :class="[
            'h-6 w-6 transition-transform duration-300',
            route.name === 'Client-qa'
              ? 'scale-110 rotate-3'
              : 'group-hover:scale-110 group-hover:-rotate-3',
          ]" />
        聯絡我們 ｜ Contact US
      </router-link>

      <!-- E-Newsletter Link -->
      <router-link
        :to="{ name: 'Client-enewsletter' }"
        :class="[
          'group flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-[#445944] px-8 py-4 text-lg font-black transition-all duration-300 active:scale-95 sm:w-auto',
          route.name === 'Client-enewsletter'
            ? 'bg-[#445944] text-white shadow-[4px_4px_0px_#445944]'
            : 'bg-white text-[#445944] shadow-[4px_4px_0px_#445944] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_#445944] active:translate-y-[3px] active:shadow-[1px_1px_0px_#445944]',
        ]">
        <Bird
          :class="[
            'h-6 w-6 transition-transform duration-300',
            route.name === 'Client-enewsletter'
              ? 'scale-110 rotate-3'
              : 'group-hover:scale-110 group-hover:-rotate-3',
          ]" />
        寵物專欄 ｜ E-Newsletter
      </router-link>
    </div>
  </div>
</template>
