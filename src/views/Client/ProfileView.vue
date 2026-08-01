<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useProfileEdit } from '@/composables/Client/member/useProfileEdit'
import { useGameStats } from '@/composables/Client/member/useGameStats'
import { useMemberPets } from '@/composables/Client/member/useMemberPets'
import { useMemberPosts } from '@/composables/Client/member/useMemberPosts'
import { useLogout } from '@/composables/Client/member/useLogout'

import ProfileHero from '@/components/Client/member/ProfileHero.vue'
import ProfileTabNav from '@/components/Client/member/ProfileTabNav.vue'
import ProfilePetTab from '@/components/Client/member/ProfilePetTab.vue'
import ProfileGameTab from '@/components/Client/member/ProfileGameTab.vue'
import ProfilePostsTab from '@/components/Client/member/ProfilePostsTab.vue'
import ProfileQuickLinks from '@/components/Client/member/ProfileQuickLinks.vue'
import ProfileCommunityStats from '@/components/Client/member/ProfileCommunityStats.vue'
import ProfileSupportLinks from '@/components/Client/member/ProfileSupportLinks.vue'
import ProfileAccountSettings from '@/components/Client/member/ProfileAccountSettings.vue'
import ProfileEditModal from '@/components/Client/member/ProfileEditModal.vue'

const authStore = useAuthStore()
const user = computed(() => authStore.userInfo || {})

const {
  editForm,
  isEditingProfile,
  isLoadingForm,
  isSaving,
  saveError,
  avatarInitials,
  startEdit,
  saveProfile,
} = useProfileEdit()

const { gameStats, fetchGameStats } = useGameStats()
const { myPets, petsLoading, fetchPets } = useMemberPets()
const { myPosts, postsLoading, fetchPosts } = useMemberPosts()
const { logout } = useLogout()

const activeTab = ref('pets')

onMounted(() => {
  fetchGameStats()
  fetchPets()
  fetchPosts()
})

/**
 * Modal 儲存時將本地副本回寫至 editForm，再呼叫 saveProfile
 * @param {Object} formData - 從 ProfileEditModal 回傳的表單資料
 */
const handleSaveForm = (formData) => {
  Object.assign(editForm.value, formData)
  saveProfile()
}
</script>

<template>
  <div class="profile-page min-h-screen bg-[#FCF4E5]">
    <ProfileHero
      :user="user"
      :myPets="myPets"
      :gameStats="gameStats"
      :myPosts="myPosts"
      :avatarInitials="avatarInitials"
      @edit="startEdit"
      @logout="logout"
    />

    <main class="mx-auto w-[90%] max-w-7xl py-10">
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <!-- 左側主欄 -->
        <div class="space-y-8 lg:col-span-2">
          <ProfileTabNav v-model:activeTab="activeTab" />

          <ProfilePetTab
            v-show="activeTab === 'pets'"
            :myPets="myPets"
            :petsLoading="petsLoading"
          />

          <ProfileGameTab
            v-show="activeTab === 'game'"
            :gameStats="gameStats"
          />

          <ProfilePostsTab
            v-show="activeTab === 'posts'"
            :myPosts="myPosts"
            :postsLoading="postsLoading"
          />
        </div>

        <!-- 右側欄 -->
        <div class="space-y-6 lg:col-span-1">
          <ProfileQuickLinks />
          <ProfileCommunityStats :myPosts="myPosts" />
          <ProfileSupportLinks />
          <ProfileAccountSettings @edit="startEdit" @logout="logout" />
        </div>
      </div>
    </main>

    <ProfileEditModal
      v-model="isEditingProfile"
      :editForm="editForm"
      :isSaving="isSaving"
      :isLoadingForm="isLoadingForm"
      :saveError="saveError"
      :avatarInitials="avatarInitials"
      @save="handleSaveForm"
    />
  </div>
</template>

<style>
/* 供子元件使用的字體定義 */
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&family=Quicksand:wght@300..700&display=swap');
.font-fredoka {
  font-family: 'Fredoka', 'GenJyuu', sans-serif;
}
</style>

<style scoped>
.profile-page {
  animation: page-in 0.4s ease-out;
}

@keyframes page-in {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
