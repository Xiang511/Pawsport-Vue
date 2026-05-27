<script setup>
import { ChevronRight, Search } from 'lucide-vue-next'
import { Rss } from 'lucide-vue-next'
import { Mail } from 'lucide-vue-next'
import { Instagram } from 'lucide-vue-next'
import { Dog } from 'lucide-vue-next'
</script>

<template>
  <footer class="bg-[#2e2e2e] text-white lg:hidden">
    <div class="mx-auto w-11/12">
      <a href="#" class="flex items-center justify-between border-b border-white/15">
        <span class="py-6 font-bold" href="#">寵物 Pet</span>
        <span class="py-3"><ChevronRight /></span>
      </a>
      <a href="#" class="flex items-center justify-between border-b border-white/15">
        <span class="py-6 font-bold" href="#">遊戲 Game</span>
        <span class="py-3"><ChevronRight /></span>
      </a>
      <a href="#" class="flex items-center justify-between border-b border-white/15">
        <span class="py-6 font-bold" href="#">社群 Community</span>
        <span class="py-3"><ChevronRight /></span>
      </a>
      <router-link
        :to="{ name: 'Client-faq' }"
        class="flex items-center justify-between border-b border-white/15">
        <span class="py-6 font-bold" href="#">客服 Support</span>
        <span class="py-3"><ChevronRight /></span>
      </router-link>
    </div>
    <div class="mx-auto mt-8 flex w-11/12 justify-center">
      <div class="mx-auto inline-block">
        <p class="text-center text-xl font-bold">Petmily</p>
        <ul class="flex justify-evenly gap-4 pt-4">
          <li class="icon inline-block">
            <a href="#">
              <span>
                <Instagram size="14" />
              </span>
            </a>
          </li>
          <li class="icon inline-block">
            <a href="#">
              <span>
                <Mail size="14" />
              </span>
            </a>
          </li>
          <li class="icon inline-block">
            <a href="#">
              <span>
                <Rss size="14" />
              </span>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div class="mx-auto mt-8 flex w-11/12 justify-center">
      <a href="#" class="btn">
        <span class="font-bold">
          <Dog />
          &nbsp; 加入我們
        </span>
      </a>
    </div>
    <div class="mx-auto mt-7 w-11/12 justify-center gap-4 sm:flex">
      <a href="#" class="block py-3 text-center text-sm">最新消息</a>
      <a href="#" class="block py-3 text-center text-sm">關於我們</a>
      <a href="#" class="block py-3 text-center text-sm">會員專區</a>
      <router-link :to="{ name: 'Client-faq' }" class="block py-3 text-center text-sm">
        客服中心
      </router-link>
    </div>
    <div class="py-8 text-center text-xs text-[#8a8a8a]">Copyright © 2026 Petmily.</div>
  </footer>

  <footer class="hidden w-full bg-[#2e2e2e] text-white lg:block">
    <div class="mx-auto flex w-[95%] justify-center pt-20">
      <div class="flex w-full flex-wrap justify-center">
        <div class="w-4/12 border-b-2 border-white/15 pb-12 xl:w-3/12">
          <div class="flex gap-1">
            <Dog size="48" class="mt-0.5 inline align-middle" />
            <div class="leading-snug">
              <span class="mt-2 ml-3 block text-2xl font-extrabold">PETMILY 寵物媒合平台</span>
            </div>
          </div>

          <div class="">
            <p class="mt-8 mb-8 inline-block bg-[#434343] px-2 py-1 text-[14px] tracking-widest">
              我想給所有寵物一個溫暖又幸福的家
            </p>
            <div class="flex items-center">
              <p class="mr-6 text-sm font-bold tracking-widest">官方帳號</p>
              <ul class="flex justify-evenly gap-4">
                <li class="icon inline-block hover:bg-[#434343]">
                  <a href="#">
                    <span>
                      <Instagram size="20" />
                    </span>
                  </a>
                </li>
                <li class="icon inline-block hover:bg-[#434343]">
                  <a href="#">
                    <span>
                      <Mail size="20" />
                    </span>
                  </a>
                </li>
                <li class="icon inline-block hover:bg-[#434343]">
                  <a href="#">
                    <span>
                      <Rss size="20" />
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <!-- <div>
            <div class="mt-12">
              <a href="#" class="btn">
                <span class="font-bold">
                  <Dog />
                  &nbsp; 加入我們
                </span>
              </a>
            </div>
          </div> -->
        </div>
        <div class="w-8/12 border-b-2 border-white/15 pb-12 xl:w-7/12">
          <div class="flex items-center justify-between">
            <div class="flex gap-6 xl:gap-8 2xl:gap-12">
              <a class="inline-block text-sm font-normal xl:text-lg">最新消息</a>
              <a class="inline-block text-sm font-normal xl:text-lg">關於我們</a>
              <a class="inline-block text-sm font-normal xl:text-lg">會員專區</a>
              <a class="inline-block text-sm font-normal xl:text-lg">社群分享</a>
              <router-link
                :to="{ name: 'Client-faq' }"
                class="inline-block cursor-pointer text-sm font-normal transition-colors hover:text-[#8a8a8a] xl:text-lg">
                客服中心
              </router-link>
            </div>
            <!-- search bar -->
            <div class="w-4/12">
              <div class="">
                <div
                  class="flex items-center bg-[#434343] pl-3 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-amber-50">
                  <input
                    id="search"
                    type="text"
                    name="search"
                    placeholder="請輸入關鍵字"
                    class="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-amber-50 placeholder:text-[#8a8a8a] focus:outline-none sm:text-sm/6" />
                  <div class="grid shrink-0 grid-cols-1 focus-within:relative">
                    <Search class="mr-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-12 flex gap-0">
            <div class="mt-6 w-1/5">
              <span>• 寵物</span>
              <ul class="mt-4 text-[#8a8a8a]">
                <li class="mt-4">領養資訊</li>
                <li class="mt-4">健康護照</li>
                <li class="mt-4">遺失協尋</li>
                <!-- <li class="mt-4">其他</li> -->
              </ul>
            </div>
            <div class="mt-6 w-1/5">
              <span>• 遊戲</span>
              <ul class="mt-4 text-[#8a8a8a]">
                <li class="mt-4">寵物知識問答</li>
                <!-- <li class="mt-4">狗</li>
                <li class="mt-4">鳥</li>
                <li class="mt-4">其他</li> -->
              </ul>
            </div>

            <div class="mt-6 w-1/5">
              <span>• 社群</span>
              <ul class="mt-4 text-[#8a8a8a]">
                <li class="mt-4">社群首頁</li>
                <li class="mt-4">專業科普</li>
              </ul>
            </div>
            <div class="mt-6 w-1/5">
              <span>• 客服</span>
              <ul class="mt-4 text-[#8a8a8a]">
                <li class="mt-4">常見問答</li>
                <li class="mt-4">聯絡我們</li>
                <li class="mt-4">寵物專欄</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="mx-auto flex w-[83%] justify-between">
          <div class="my-6 inline-block w-4/12 xl:w-auto">
            <div>
              <a href="https://livestock.kcg.gov.tw/Pets/DongwuShourong" class="mr-4 inline-block">
                高雄市動物保護處
              </a>
              <a
                href="https://www.pet.gov.tw/AnimalApp/AnnounceMent_Announce.aspx"
                class="mx-4 inline-block">
                全國動物收容系統
              </a>
              <a href="https://animal.moa.gov.tw/#tab0" class="mx-4 inline-block">動物保護資訊網</a>
            </div>
          </div>
          <div class="my-6 inline-block w-8/12 xl:w-8/12">
            <p class="text-right text-sm text-[#8a8a8a]">Copyright © 2026 PETMILY.</p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
* {
  /* border: 1px solid #ccc; */
}
.btn {
  display: inline-block;
  width: 100px;
  height: 40px;
  background-color: #fff;
  background-color: #338751;
  border-radius: 26px;
  max-width: 232px;
  width: 100%;
  height: 52px;
  border-radius: 26px;
  margin-inline: auto;
  padding-inline: 18px;
}
.btn span {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  text-align: center;
  padding: 12px;
  margin-top: 0.1555555555em;
}
.icon {
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 50%;
  padding: 0.8em;
}

@media screen and (min-width: 1024px) {
  .btn {
    max-width: 80%;
  }
}
</style>
