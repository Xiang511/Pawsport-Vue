<script setup>
import { useRoute } from 'vue-router'
import { Cat, Rabbit, PawPrint, Bird } from 'lucide-vue-next'

const route = useRoute()
</script>

<template>
  <div>
    <div class="mb-8 text-center">
      <h1 class="mb-3 flex items-center justify-center gap-3 text-3xl text-[#7a6856]">
        <Cat class="h-9 w-9 text-[#7a6856]" />
        <span class="font-extrabold">客服中心</span>
      </h1>
      <span class="text-lg font-normal text-[#968677]">
        關於 Petmily 的疑難雜症，都在這裡為您解答！
      </span>
    </div>
    <div class="mb-12 flex flex-col items-center justify-center gap-6 sm:flex-row">
      <router-link
        :to="{ name: 'Client-faq' }"
        :class="[
          'group flex w-full items-center justify-center gap-3 rounded-2xl px-8 py-4 text-lg font-bold shadow-sm transition-all duration-300 active:scale-95 sm:w-auto',
          route.name === 'Client-faq'
            ? 'bg-[#7a6856] text-white'
            : 'bg-[#e8dccb] text-[#7a6856] hover:-translate-y-1 hover:bg-[#d8ccbb] hover:shadow-md',
        ]">
        <Rabbit
          :class="[
            'h-6 w-6',
            route.name === 'Client-faq'
              ? 'scale-100' //當前頁
              : 'transition-transform group-hover:scale-110', //其他頁跳動
          ]" />
        常見問答 ｜ F A Q
      </router-link>

      <router-link
        :to="{ name: 'Client-qa' }"
        :class="[
          'group flex w-full items-center justify-center gap-3 rounded-2xl px-8 py-4 text-lg font-bold shadow-sm transition-all duration-300 active:scale-95 sm:w-auto',
          route.name === 'Client-qa'
            ? 'bg-[#7a6856] text-white'
            : 'bg-[#e8dccb] text-[#7a6856] hover:-translate-y-1 hover:bg-[#d8ccbb] hover:shadow-md',
        ]">
        <PawPrint
          :class="[
            'h-6 w-6',
            route.name === 'Client-qa' ? 'scale-100' : 'transition-transform group-hover:scale-110',
          ]" />
        聯絡我們 ｜ Contact US
      </router-link>

      <router-link
        :to="{ name: 'Client-enewsletter' }"
        :class="[
          'group flex w-full items-center justify-center gap-3 rounded-2xl px-8 py-4 text-lg font-bold shadow-sm transition-all duration-300 active:scale-95 sm:w-auto',
          route.name === 'Client-enewsletter'
            ? 'bg-[#7a6856] text-white'
            : 'bg-[#e8dccb] text-[#7a6856] hover:-translate-y-1 hover:bg-[#d8ccbb] hover:shadow-md',
        ]">
        <Bird
          :class="[
            'h-6 w-6',
            route.name === 'Client-enewsletter'
              ? 'scale-100'
              : 'transition-transform group-hover:scale-110',
          ]" />
        寵物專欄 ｜ E-Newsletter
      </router-link>
    </div>
  </div>
</template>
