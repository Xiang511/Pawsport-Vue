<script setup>
import { Camera, Edit3, LogOut, Mail, Phone, BookOpen, MessageCircle, Clock } from 'lucide-vue-next'
import { useMemberUtils } from '@/composables/Client/member/useMemberUtils'

const props = defineProps({
  user: { type: Object, required: true },
  myPets: { type: Array, default: () => [] },
  gameStats: { type: Object, required: true },
  myPosts: { type: Array, default: () => [] },
  avatarInitials: { type: String, default: 'U' },
})

const emit = defineEmits(['edit', 'logout'])

const { formatDate } = useMemberUtils()
</script>

<template>
  <header class="profile-hero bg-[#FCF4E5] pt-10 pb-8">
    <div class="mx-auto w-[90%] max-w-7xl">
      <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <!-- 頭像 + 使用者資訊 -->
        <div class="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <!-- 頭像 -->
          <div class="avatar-wrapper relative shrink-0">
            <div
              class="avatar-ring flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border-4 border-black bg-[#445944] shadow-[4px_4px_0px_#000]">
              <img
                v-if="user.avatar"
                :src="user.avatar"
                alt="頭像"
                class="h-full w-full object-cover" />
              <span v-else class="text-4xl font-black text-[#FAE4AE]">
                <img :src="user.photo" alt="" />
              </span>
            </div>
            <button
              class="absolute -right-2 -bottom-2 flex h-8 w-8 items-center justify-center rounded-xl border-2 border-black bg-[#FAE4AE] shadow-[2px_2px_0px_#000] transition-all hover:bg-[#f2d44d] hover:shadow-[1px_1px_0px_#000]"
              title="更換頭像">
              <Camera :size="14" />
            </button>
          </div>

          <!-- 使用者詳細資訊 -->
          <div class="flex-1">
            <div class="mb-1 flex flex-wrap items-center gap-3">
              <h1 class="font-fredoka text-3xl font-black text-[#445944]">
                {{ user.name || '匿名使用者' }}
              </h1>
              <span class="rounded-full bg-[#7a6856] px-3 py-0.5 text-xs font-bold text-white">
                🐾 Petmily 一般會員
              </span>
            </div>
            <div class="flex flex-col gap-1 text-sm text-gray-600">
              <span class="flex items-center gap-2">
                <Mail :size="13" class="text-[#9C6D6D]" />
                {{ user.email || user.userEmail || 'user@petmily.com' }}
              </span>
              <span v-if="user.phone" class="flex items-center gap-2">
                <Phone :size="13" class="text-[#9C6D6D]" />
                {{ user.phone }}
              </span>
              <span v-if="user.job || user.city" class="flex items-center gap-2">
                <BookOpen :size="13" class="text-[#9C6D6D]" />
                {{ [user.job, user.city].filter(Boolean).join(' · ') }}
              </span>
              <span v-if="user.note" class="flex max-w-sm items-center gap-2">
                <MessageCircle :size="13" class="shrink-0 text-[#9C6D6D]" />
                <span class="line-clamp-1">{{ user.note }}</span>
              </span>
              <span class="flex items-center gap-2">
                <Clock :size="13" class="text-[#9C6D6D]" />
                加入時間：{{ user.createdAt ? formatDate(user.createdAt) : '2026 年' }}
              </span>
            </div>
          </div>
        </div>

        <!-- 操作按鈕 -->
        <div class="flex flex-wrap items-center gap-3">
          <button
            @click="emit('edit')"
            class="flex items-center gap-2 rounded-2xl border-2 border-[#445944] bg-white px-5 py-2.5 text-sm font-bold text-[#445944] shadow-[3px_3px_0px_#445944] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-[#FAE4AE] hover:shadow-[1px_1px_0px_#445944]">
            <Edit3 :size="16" />
            編輯資料
          </button>
          <button
            @click="emit('logout')"
            class="flex items-center gap-2 rounded-2xl border-2 border-[#7a6856] bg-white px-5 py-2.5 text-sm font-bold text-[#7a6856] shadow-[3px_3px_0px_#7a6856] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_#7a6856]">
            <LogOut :size="16" />
            登出
          </button>
        </div>
      </div>

      <!-- 統計列 -->
      <div
        class="mt-6 grid grid-cols-3 divide-x-2 divide-[#445944] rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] shadow-[4px_4px_0px_#445944] sm:grid-cols-3">
        <div class="flex flex-col items-center px-2 py-4">
          <span class="font-fredoka text-2xl font-black text-[#445944]">{{ myPets.length }}</span>
          <span class="mt-0.5 text-xs text-gray-500">我的毛孩</span>
        </div>
        <div class="flex flex-col items-center px-2 py-4">
          <span class="font-fredoka text-2xl font-black text-[#A07A3C]">
            {{ gameStats.points.toLocaleString() }}
          </span>
          <span class="mt-0.5 text-xs text-gray-500">毛幣點數</span>
        </div>
        <div class="flex flex-col items-center px-2 py-4">
          <span class="font-fredoka text-2xl font-black text-[#7a6856]">
            {{ myPosts.length }}
          </span>
          <span class="mt-0.5 text-xs text-gray-500">我的文章</span>
        </div>
      </div>
    </div>
  </header>
</template>
