<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import {
  LucideTrainFront,
  Instagram,
  X,
  MenuIcon,
  Rss,
  Mail,
  Heart,
  LogIn,
  User,
} from 'lucide-vue-next'
import { useAlgoliaSearch } from '@/composables/useAlgoliaSearch'
import SearchBarAlgolia from '@/components/Client/SearchBarAlgolia.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const isMenuOpen = ref(false)
const isScrolled = ref(false)
const hoveredMenu = ref(null)
let leaveTimeout = null

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
  hoveredMenu.value = null
}

const handleScroll = () => {
  // isScrolled.value = window.scrollY > 150
  isScrolled.value = true
}

const handleMenuHover = (menu) => {
  if (leaveTimeout) {
    clearTimeout(leaveTimeout)
    leaveTimeout = null
  }
  hoveredMenu.value = menu
}

const handleMenuLeave = () => {
  leaveTimeout = setTimeout(() => {
    hoveredMenu.value = null
    leaveTimeout = null
  }, 200)
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (leaveTimeout) {
    clearTimeout(leaveTimeout)
  }
})
</script>

<template>
  <nav class="relative sticky top-0 bg-[#FCF4E5] transition-all duration-300">
    <div class="border-b-4">
      <div
        class="mx-auto w-[95%] transition-all duration-300"
        :class="isScrolled ? 'py-8' : 'py-14'">
        <div class="relative flex items-center justify-between gap-4">
          <div class="hidden gap-4 md:flex">
            <Instagram
              class="inline h-5 w-5 cursor-pointer text-black duration-300 hover:opacity-40 md:h-8 md:w-8" />
            <Mail
              class="inline h-5 w-5 cursor-pointer text-black duration-300 hover:opacity-40 md:h-8 md:w-8" />
          </div>
          <div class="flex">
            <router-link
              to="/"
              class="logo-group -top-1.5 flex text-center text-4xl text-black sm:text-5xl md:-top-3 md:text-5xl lg:text-5xl">
              <img class="logo" src="/images/logo/LOGO-WHITE.svg" alt="" />
              <h1 class="ml-3 inline-block font-bold text-[#445944]">PETMILY</h1>
            </router-link>
          </div>
          <div class="relative flex cursor-pointer items-center justify-between gap-3 md:gap-1">
            <SearchBarAlgolia />

            <router-link v-if="!authStore.isLoggedIn" to="/login" cursor-pointer title="登入">
              <log-in class="inline h-5 w-5 cursor-pointer text-black md:h-8 md:w-8" />
            </router-link>
            <router-link v-else to="/user/profile" cursor-pointer title="個人資料">
              <User class="inline h-5 w-5 cursor-pointer text-black md:h-8 md:w-8" />
            </router-link>

            <Transition name="menu-icon" mode="out-in">
              <MenuIcon
                v-if="!isMenuOpen"
                key="menu"
                class="inline h-5 w-5 text-black md:h-8 md:w-8"
                @click="toggleMenu" />
              <X
                v-else
                key="close"
                class="inline h-5 w-5 text-black md:h-8 md:w-8"
                @click="toggleMenu" />
            </Transition>
          </div>
        </div>
      </div>
      <Transition name="menu-panel">
        <div
          v-if="isMenuOpen"
          class="hide-scrollbar absolute h-dvh w-full overflow-scroll border-t-4 bg-[#FAE4AE]">
          <div class="mx-auto h-full w-[1286px] pt-[.5em] pl-3 md:pt-[72px]">
            <router-link
              to="/"
              @click="closeMenu"
              class="menu-item fontmdxtrabold relative block py-7 text-center text-left text-xl font-bold tracking-widest md:text-3xl">
              Home
            </router-link>
            <router-link
              to="/"
              @click="closeMenu"
              @mouseenter="handleMenuHover('pets')"
              @mouseleave="handleMenuLeave"
              class="menu-item textmdl relative block py-7 text-center text-left font-bold tracking-widest md:text-3xl">
              Pets
            </router-link>
            <router-link
              to="/"
              @click="closeMenu"
              @mouseenter="handleMenuHover('games')"
              @mouseleave="handleMenuLeave"
              class="menu-item textmdl relative block py-7 text-center text-left font-bold tracking-widest md:text-3xl">
              Games
            </router-link>
            <router-link
              to="/"
              @click="closeMenu"
              @mouseenter="handleMenuHover('community')"
              @mouseleave="handleMenuLeave"
              class="menu-item textmdl relative block py-7 text-center text-left font-bold tracking-widest md:text-3xl">
              Community
            </router-link>
            <router-link
              to="/"
              @click="closeMenu"
              @mouseenter="handleMenuHover('support')"
              @mouseleave="handleMenuLeave"
              class="menu-item text-md relative block py-7 text-center text-left font-bold tracking-widest md:text-3xl">
              Support
            </router-link>
            <div class="ml-3">
              <p class="mt-20 mb-3 text-sm font-bold tracking-widest">FOLLOW</p>
              <div class="flex gap-4">
                <Instagram
                  class="inline h-5 w-5 cursor-pointer text-black duration-300 hover:opacity-40 md:h-6 md:w-6" />
                <Mail
                  class="inline h-5 w-5 cursor-pointer text-black duration-300 hover:opacity-40 md:h-6 md:w-6" />
                <Rss
                  class="inline h-5 w-5 cursor-pointer text-black duration-300 hover:opacity-40 md:h-6 md:w-6" />
              </div>
            </div>

            <div class="mt-8 ml-3">
              <router-link
                @click="closeMenu"
                class="mt-10 mb-3 block text-sm font-bold tracking-widest duration-300 hover:opacity-40">
                SITEMAP
              </router-link>
              <router-link
                @click="closeMenu"
                class="mb-2 block text-sm font-bold tracking-widest duration-300 hover:opacity-40">
                PRIVACY POLICY
              </router-link>
              <router-link
                :to="{ name: 'Client-login' }"
                class="rounded-md bg-orange-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-500">
                🚧登入
              </router-link>
            </div>
            <Transition name="sidebar-panel">
              <div
                v-if="hoveredMenu"
                @mouseenter="handleMenuHover(hoveredMenu)"
                @mouseleave="handleMenuLeave"
                class="pointer-events-auto absolute top-0 right-0 z-2 h-full w-[65%] bg-[#FEF8EA]">
                <Transition name="menu-content" mode="out-in">
                  <div v-if="hoveredMenu === 'pets'" class="p-10 md:pt-[100px]">
                    <h3 class="mb-6 text-2xl font-bold tracking-wider">Pet Categories</h3>
                    <div class="grid grid-cols-2 gap-4">
                      <router-link
                        :to="{ name: 'pet-adoption' }"
                        @click="closeMenu"
                        class="block rounded-lg bg-white p-4 text-lg font-semibold transition-all hover:shadow-md">
                        領養狗狗
                      </router-link>
                      <router-link
                        :to="{ name: 'pet-health-passport' }"
                        @click="closeMenu"
                        class="block rounded-lg bg-white p-4 text-lg font-semibold transition-all hover:shadow-md">
                        寵物健康護照
                      </router-link>
                      <router-link
                        :to="{ name: 'missing-report' }"
                        @click="closeMenu"
                        class="block rounded-lg bg-white p-4 text-lg font-semibold transition-all hover:shadow-md">
                        遺失協尋
                      </router-link>
                    </div>
                  </div>
                  <div v-else-if="hoveredMenu === 'games'" class="p-10 md:pt-[100px]">
                    <h3 class="mb-6 text-2xl font-bold tracking-wider">知識遊戲</h3>
                    <div class="space-y-3">
                      <router-link
                        :to="{ name: 'Client-gameview' }"
                        @click="closeMenu"
                        class="block rounded-lg bg-white p-4 text-lg font-semibold transition-all hover:shadow-md">
                        寵物知識問答
                      </router-link>
                    </div>
                  </div>
                  <div v-else-if="hoveredMenu === 'community'" class="p-10 md:pt-[100px]">
                    <h3 class="mb-6 text-2xl font-bold tracking-wider">Community</h3>
                    <div class="space-y-3">
                      <router-link
                        to="/"
                        @click="closeMenu"
                        class="block rounded-lg bg-white p-4 text-lg font-semibold transition-all hover:shadow-md">
                        Forums
                      </router-link>
                      <router-link
                        to="/"
                        @click="closeMenu"
                        class="block rounded-lg bg-white p-4 text-lg font-semibold transition-all hover:shadow-md">
                        Events
                      </router-link>
                      <router-link
                        to="/"
                        @click="closeMenu"
                        class="block rounded-lg bg-white p-4 text-lg font-semibold transition-all hover:shadow-md">
                        Pet Stories
                      </router-link>
                      <router-link
                        to="/"
                        @click="closeMenu"
                        class="block rounded-lg bg-white p-4 text-lg font-semibold transition-all hover:shadow-md">
                        Q&A
                      </router-link>
                    </div>
                  </div>
                  <div v-else-if="hoveredMenu === 'support'" class="p-10 md:pt-[100px]">
                    <h3 class="mb-6 text-2xl font-bold tracking-wider">Support</h3>
                    <div class="space-y-3">
                      <router-link
                        :to="{ name: 'Client-faq' }"
                        @click="toggleMenu"
                        class="block rounded-lg bg-white p-4 text-lg font-semibold transition-all hover:shadow-md">
                        F A Q
                      </router-link>
                      <router-link
                        :to="{ name: 'Client-qa' }"
                        @click="toggleMenu"
                        class="block rounded-lg bg-white p-4 text-lg font-semibold transition-all hover:shadow-md">
                        Contact Us
                      </router-link>
                      <router-link
                        :to="{ name: 'Client-enewsletter' }"
                        @click="toggleMenu"
                        class="block rounded-lg bg-white p-4 text-lg font-semibold transition-all hover:shadow-md">
                        E-Newsletter
                      </router-link>
                    </div>
                  </div>
                </Transition>
              </div>
            </Transition>
          </div>
        </div>
      </Transition>
    </div>
  </nav>
</template>

<style scoped>
@media screen and (min-width: 768px) {
  .logo-group {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
.logo {
  width: 60px;
  height: auto;
  display: inline-block;
  vertical-align: middle;

  /* 先強行轉為純黑，再精準過濾出 #445944 */
  filter: brightness(0) invert(33%) sepia(8%) saturate(1476%) hue-rotate(76deg) brightness(97%)
    contrast(85%);
}

/* 解決scroll時壓過nav問題 */
nav {
  z-index: 1000 !important;
}
.transition-all {
  transition: all 0.4s ease-in-out;
}

/* 隱藏滾動條 */
.hide-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.hide-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

/* 菜單項目樣式 */
.menu-item {
  z-index: 1;
}
.menu-item:hover {
  background: #fdf2d7;
  transition: all 0.4s ease-in-out;
}
.menu-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100vw;
  height: 100%;
  background-color: #fdf2d7;
  opacity: 0;
  transition: all 0.4s ease-in-out;
  z-index: -1;
}

.menu-item:hover::before {
  opacity: 1;
}

.menu-item:active::before {
  opacity: 1;
}

/* 菜單圖標切換動畫 */
.menu-icon-enter-active,
.menu-icon-leave-active {
  transition: all 0.3s ease;
}

.menu-icon-enter-from {
  opacity: 0;
  transform: rotate(-90deg) scale(0.8);
}

.menu-icon-leave-to {
  opacity: 0;
  transform: rotate(90deg) scale(0.8);
}

.menu-icon-enter-to,
.menu-icon-leave-from {
  opacity: 1;
  transform: rotate(0) scale(1);
}

/* 菜單面板滑入滑出動畫 */
.menu-panel-enter-active,
.menu-panel-leave-active {
  transition: all 0.4s ease-in-out;
}

.menu-panel-enter-from {
  opacity: 0;
}

.menu-panel-leave-to {
  opacity: 0;
}

.menu-panel-enter-to,
.menu-panel-leave-from {
  opacity: 1;
  transform: translateY(0);
}

/* 右側背景面板動畫 */
.sidebar-panel-enter-active,
.sidebar-panel-leave-active {
  transition: all 0.4s ease-in-out;
}

.sidebar-panel-enter-from {
  opacity: 0;
}

.sidebar-panel-leave-to {
  opacity: 0;
}

.sidebar-panel-enter-to,
.sidebar-panel-leave-from {
  opacity: 1;
}

/* 右側菜單內容過渡動畫 */
.menu-content-enter-active,
.menu-content-leave-active {
  transition: all 0.4s ease-in-out;
}

.menu-content-enter-from {
  opacity: 0;
}

.menu-content-leave-to {
  opacity: 0;
}

.menu-content-enter-to,
.menu-content-leave-from {
  opacity: 1;
}
</style>
