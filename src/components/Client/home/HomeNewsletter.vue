<template>
  <section class="relative overflow-hidden bg-[#445944] py-16 text-white">
    <div class="pointer-events-none absolute inset-0 flex items-center justify-around opacity-10">
      <svg class="h-16 w-16 rotate-12 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M12 14c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3.5-8c.83 0 1.5-.67 1.5-1.5S16.33 3 15.5 3 14 3.67 14 4.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 3 8.5 3 7 3.67 7 4.5s.67 1.5 1.5 1.5zM3 10.5c.83 0 1.5-.67 1.5-1.5S3.83 7.5 3 7.5 1.5 8.17 1.5 9s.67 1.5 1.5 1.5zm18 0c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5z" />
      </svg>
      <svg class="h-20 w-20 -rotate-45 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M12 14c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3.5-8c.83 0 1.5-.67 1.5-1.5S16.33 3 15.5 3 14 3.67 14 4.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 3 8.5 3 7 3.67 7 4.5s.67 1.5 1.5 1.5zM3 10.5c.83 0 1.5-.67 1.5-1.5S3.83 7.5 3 7.5 1.5 8.17 1.5 9s.67 1.5 1.5 1.5zm18 0c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5z" />
      </svg>
    </div>

    <div class="relative z-10 mx-auto w-[90%] max-w-4xl text-center">
      <h2 class="mb-4 text-3xl font-black md:text-4xl">加入我們</h2>
      <p class="mx-auto mb-8 max-w-xl text-sm text-gray-200 md:text-base">
        訂閱我們的電子報，第一時間取得最新領養資訊、協尋警報、專業養寵知識，讓我們一起給牠們更好的明天。
      </p>
      <div class="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
        <input
          type="email"
          placeholder="請輸入您的電子信箱"
          class="flex-1 rounded-xl border-2 border-black px-5 py-4 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#FAE4AE] focus:outline-none" />
        <router-link
          to="/enewsletter"
          class="rounded-xl border-2 border-black bg-[#FAE4AE] px-6 py-4 font-extrabold text-black shadow-[3px_3px_0px_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_#000]">
          立即訂閱
        </router-link>
      </div>
    </div>
  </section>
</template>
