<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Dog,
  Heart,
  Star,
  MessageCircle,
  Settings,
  LogOut,
  Edit3,
  Camera,
  Gamepad2,
  Trophy,
  Zap,
  Award,
  Users,
  HeadphonesIcon,
  FileText,
  Bell,
  ChevronRight,
  Activity,
  Shield,
  PawPrint,
  BookOpen,
  Phone,
  Mail,
  HelpCircle,
  Newspaper,
  ShoppingBag,
  Plus,
  CheckCircle,
  Clock,
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import request from '@/api/axios'

const authStore = useAuthStore()
const router = useRouter()

const user = computed(() => authStore.userInfo || {})
const isEditingProfile = ref(false)
const activeTab = ref('pets')

// Edit form — mirrors MemberUserDTO
const editForm = ref({
  // 可編輯
  photo: '',
  name: '',
  phone: '',
  job: '',
  birthday: '',
  city: '',
  note: '',
  hasPriorExp: null,
  isSubscribe: null,
  // 唯讀（帶入 payload 但不讓使用者改）
  userId: null,
  email: '',
  point: null,
  status: true,
  isVerify: null,
  createdAt: null,
  updatedAt: null,
})
const isSaving = ref(false)
const isLoadingForm = ref(false)
const saveError = ref('')

// Stats data
const petStats = ref({
  total: 2,
  healthy: 2,
  vaccinesDue: 1,
})

const gameStats = ref({
  points: 0,
  level: 0,
  skins: 0,
  progress: '尚未開始',
  lastPlayed: null,
})

const communityStats = ref({
  posts: 0,
  likes: 0,
  followers: 0,
})

const myPets = ref([])
const petsLoading = ref(false)
const showHealthSummary = ref(false)

const myPosts = ref([])
const postsLoading = ref(false)

// Quick Links
const quickLinks = [
  { label: '健康護照', icon: Shield, route: '/healthpassport', color: '#445944', bg: '#D4E6D0' },
  { label: '遺失協尋', icon: Bell, route: '/missingreport', color: '#9C6D6D', bg: '#F0D9D9' },
  { label: '領養資訊', icon: Dog, route: '/adopt', color: '#5B7FA0', bg: '#D0E2F3' },
  { label: '遊戲中心', icon: Gamepad2, route: '/game', color: '#A07A3C', bg: '#FAE4AE' },
  { label: '社群首頁', icon: Users, route: '/community-home', color: '#6E5F78', bg: '#D5BFE3' },
  { label: '常見問題', icon: HelpCircle, route: '/faq', color: '#6B6B6B', bg: '#EBEBEB' },
]

// Support links
const supportLinks = [
  { label: '聯絡我們', icon: Mail, route: '/qa', desc: '寄信給我們的客服團隊' },
  { label: '常見問題', icon: HelpCircle, route: '/faq', desc: '查閱 FAQ 快速自助' },
  { label: '電子報訂閱', icon: Newspaper, route: '/enewsletter', desc: '取得最新寵物資訊' },
]

// Fetch game stats from API
const fetchGameStats = async () => {
  try {
    const userId = user.value?.userId || user.value?.id || localStorage.getItem('userId')
    if (!userId) return
    const res = await request.get(`/Users/${userId}/player-profile`)
    if (res.data?.success && res.data?.data) {
      const d = res.data.data
      const ownedSkins = d.ownedSkins || d.OwnedSkins || []
      const filteredSkins = ownedSkins.filter((s) => (s.skinId ?? s.SkinId) !== 1)
      gameStats.value = {
        points: d.currentPoint ?? d.CurrentPoint ?? 0,
        level: d.maxGameId ?? 0,
        skins: filteredSkins.length,
        progress: getProgressText(d.maxGameId ?? 0),
        lastPlayed: d.lastPlayedDate ?? d.LastPlayedDate ?? null,
      }
    }
  } catch (e) {
    // silently fail - game server may be offline
    console.log('錯誤', e);
  }
}

const getProgressText = (maxGameId) => {
  if (!maxGameId) return '尚未開始'
  const levelCategoryMap = {
    1: '認養須知',
    2: '狗狗百科',
    3: '貓貓百科',
    4: '鳥類百科',
    5: '小動物百科',
    6: '水族與爬蟲',
  }
  const areaId = Math.floor((maxGameId - 1) / 10) + 1
  return `${levelCategoryMap[areaId] || `第 ${areaId} 章`} (第 ${maxGameId} 關)`
}

const formatDate = (dateStr) => {
  if (!dateStr) return '尚未遊玩'
  const d = new Date(dateStr)
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`
}

const fetchPets = async () => {
  const userId = parseInt(user.value?.userId ?? user.value?.id)
  if (!userId || isNaN(userId)) return

  petsLoading.value = true
  try {
    const res = await request.get(`/users/pet/passports?userId=${userId}`)
    if (res.data?.success && Array.isArray(res.data?.data)) {
      const today = new Date()

      myPets.value = res.data.data.map((p) => {
        // 從疫苗 forecast 推算健康狀態與下次疫苗日
        const upcomingDates = []
        let hasOverdue = false

        ;(p.vaccinations || []).forEach((v) => {
          if (!v.forecast) return
          const d = new Date(v.forecast)
          if (d < today) {
            hasOverdue = true
          } else {
            upcomingDates.push(d)
          }
        })

        upcomingDates.sort((a, b) => a - b)
        const daysToNext =
          upcomingDates.length > 0
            ? (upcomingDates[0] - today) / (1000 * 60 * 60 * 24)
            : Infinity

        const health = hasOverdue ? 'bad' : daysToNext <= 30 ? 'warning' : 'good'
        const nextVaccine =
          upcomingDates.length > 0 ? upcomingDates[0].toISOString().split('T')[0] : null

        return {
          id: p.id,
          name: p.name,
          avatar: p.photo,
          gender: p.gender === 1 ? 'male' : p.gender === 2 ? 'female' : null,
          health,
          age: p.age,
          weight: p.weight,
          nextVaccine,
          isDesex: p.isDesex,
        }
      })
    }
  } catch (e) {
    console.error('[fetchPets]', e)
  } finally {
    petsLoading.value = false
  }
}

const fetchPosts = async () => {
  const userId = parseInt(user.value?.userId ?? user.value?.id)
  if (!userId || isNaN(userId)) return

  postsLoading.value = true
  try {
    const res = await request.get(`/users/articles`, {
      params: { UserId: userId, IsActive: true },
    })
    if (res.data?.success && Array.isArray(res.data?.data)) {
      myPosts.value = res.data.data.map((a) => ({
        id: a.articleId,
        title: a.title,
        summary: a.summary,
        tag: a.categoryName || '未分類',
        tags: a.tagNames || [],
        date: a.createAt,
        viewCount: a.viewCount ?? 0,
        status: a.status,          // 0=草稿 1=公開
        mainImage: a.mainImageUrl || null,
      }))
    }
  } catch (e) {
    console.error('[fetchPosts]', e)
  } finally {
    postsLoading.value = false
  }
}

const postStatusLabel = (status) => (status === 1 ? '公開' : '草稿')
const postStatusClass = (status) =>
  status === 1
    ? 'border-[#445944] bg-[#D4E6D0] text-[#445944]'
    : 'border-gray-300 bg-gray-100 text-gray-500'

onMounted(() => {
  fetchGameStats()
  fetchPets()
  fetchPosts()
})

const startEdit = async () => {
  saveError.value = ''
  isEditingProfile.value = true
  isLoadingForm.value = true

  const userId = parseInt(user.value?.userId ?? user.value?.id)

  try {
    // 從 API 取得完整最新資料，避免 authStore 只有登入時的部分欄位
    const res = await request.get(`/Users/${userId}`)
    const u = (res.data?.success && res.data?.data) ? res.data.data : user.value

    editForm.value = {
      photo: u.photo || '',
      name: u.name || u.userName || '',
      phone: u.phone || '',
      job: u.job || '',
      birthday: u.birthday || '',
      city: u.city || '',
      note: u.note || '',
      hasPriorExp: u.hasPriorExp ?? null,
      isSubscribe: u.isSubscribe ?? null,
      userId: u.userId || u.id || null,
      email: u.email || u.userEmail || user.value.email || user.value.userEmail || '',
      point: u.point ?? null,
      status: u.status ?? true,
      isVerify: u.isVerify ?? null,
      createdAt: u.createdAt || null,
      updatedAt: u.updatedAt || null,
    }
  } catch (e) {
    // API 失敗時退回 authStore 的快取資料
    const u = user.value
    editForm.value = {
      photo: u.photo || '',
      name: u.name || u.userName || '',
      phone: u.phone || '',
      job: u.job || '',
      birthday: u.birthday || '',
      city: u.city || '',
      note: u.note || '',
      hasPriorExp: u.hasPriorExp ?? null,
      isSubscribe: u.isSubscribe ?? null,
      userId: u.userId || u.id || null,
      email: u.email || u.userEmail || '',
      point: u.point ?? null,
      status: u.status ?? true,
      isVerify: u.isVerify ?? null,
      createdAt: u.createdAt || null,
      updatedAt: u.updatedAt || null,
    }
    console.warn('[startEdit] 無法取得最新資料，使用快取', e)
  } finally {
    isLoadingForm.value = false
  }
}

const saveProfile = async () => {
  // 統一解析為整數，同時用於 URL 和 payload，避免型別或值不同步
  const userId = parseInt(user.value?.userId ?? user.value?.id)
  if (!userId || isNaN(userId)) {
    saveError.value = '無法取得使用者 ID，請重新登入'
    return
  }

  isSaving.value = true
  saveError.value = ''

  try {
    const f = editForm.value
    const payload = {
      userId,                          // 與 URL 路由參數完全相同
      name: f.name,
      photo: f.photo || null,
      job: f.job || null,
      phone: f.phone || null,
      birthday: f.birthday || null,
      city: f.city || null,
      point: f.point ?? null,
      note: f.note || null,
      hasPriorExp: f.hasPriorExp,
      status: f.status ?? true,
      isSubscribe: f.isSubscribe,
      isVerify: f.isVerify,
      createdAt: f.createdAt,
      updatedAt: null,
      email: f.email || null,
    }

    const res = await request.put(`/Users/${userId}`, payload)

    if (res.data?.success && res.data?.data) {
      authStore.setLoginInfo({
        ...authStore.userInfo,
        photo: f.photo || null,
        name: f.name,
        phone: f.phone || null,
        job: f.job || null,
        birthday: f.birthday || null,
        city: f.city || null,
        note: f.note || null,
        hasPriorExp: f.hasPriorExp,
        isSubscribe: f.isSubscribe,
        updatedAt: res.data.data.updatedAt || null,
      })
    }

    isEditingProfile.value = false
  } catch (e) {
    const errBody = e?.response?.data
    saveError.value = errBody?.message || errBody?.title || '儲存失敗，請稍後再試'
    console.error('[saveProfile] status:', e?.response?.status, 'body:', errBody)
  } finally {
    isSaving.value = false
  }
}

const logout = async () => {
  if (confirm('確定要登出嗎？')) {
    try {
      await request.post('/Auth/logout')
    } catch (error) {
      console.error('登出請求失敗:', error)
    }
    authStore.clearLoginInfo()
    router.replace('/').then(() => {
      window.location.reload()
    })
  }
}

const getHealthColor = (health) => {
  return health === 'good' ? '#445944' : health === 'warning' ? '#A07A3C' : '#9C6D6D'
}

const getHealthLabel = (health) => {
  return health === 'good' ? '健康良好' : health === 'warning' ? '需注意' : '需就醫'
}

const getHealthBg = (health) => {
  return health === 'good' ? '#D4E6D0' : health === 'warning' ? '#FAE4AE' : '#F0D9D9'
}

const avatarInitials = computed(() => {
  const name = user.value?.name || user.value?.userName || 'U'
  return name.charAt(0).toUpperCase()
})
</script>

<template>
  <div class="profile-page min-h-screen bg-[#FCF4E5]">
    <!-- ── HERO HEADER ─────────────────────────────────────────── -->
    <header class="profile-hero bg-[#FCF4E5] pt-10 pb-8">
      <div class="mx-auto w-[90%] max-w-7xl">
        <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <!-- Left: Avatar + User info -->
          <div class="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <!-- Avatar -->
            <div class="avatar-wrapper relative shrink-0">
              <div
                class="avatar-ring flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border-4 border-black bg-[#445944] shadow-[4px_4px_0px_#000]">
                <img
                  v-if="user.avatar"
                  :src="user.avatar"
                  alt="頭像"
                  class="h-full w-full object-cover" />
                <span v-else class="text-4xl font-black text-[#FAE4AE]"><img :src="user.photo" alt=""></span>
              </div>
              <button
                class="absolute -right-2 -bottom-2 flex h-8 w-8 items-center justify-center rounded-xl border-2 border-black bg-[#FAE4AE] shadow-[2px_2px_0px_#000] transition-all hover:bg-[#f2d44d] hover:shadow-[1px_1px_0px_#000]"
                title="更換頭像">
                <Camera :size="14" />
              </button>
            </div>

            <!-- User details -->
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
                <span v-if="user.note" class="flex items-center gap-2 max-w-sm">
                  <MessageCircle :size="13" class="text-[#9C6D6D] shrink-0" />
                  <span class="line-clamp-1">{{ user.note }}</span>
                </span>
                <span class="flex items-center gap-2">
                  <Clock :size="13" class="text-[#9C6D6D]" />
                  加入時間：{{ user.createdAt ? formatDate(user.createdAt) : '2026 年' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Right: Action buttons -->
          <div class="flex flex-wrap items-center gap-3">
            <button
              @click="startEdit"
              class="flex items-center gap-2 rounded-2xl border-2 border-[#445944] bg-white px-5 py-2.5 text-sm font-bold text-[#445944] shadow-[3px_3px_0px_#445944] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-[#FAE4AE] hover:shadow-[1px_1px_0px_#445944]">
              <Edit3 :size="16" />
              編輯資料
            </button>
            <button
              @click="logout"
              class="flex items-center gap-2 rounded-2xl border-2 border-[#7a6856] bg-white px-5 py-2.5 text-sm font-bold text-[#7a6856] shadow-[3px_3px_0px_#7a6856] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_#7a6856]">
              <LogOut :size="16" />
              登出
            </button>
          </div>
        </div>

        <!-- Stats bar -->
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

    <!-- ── MAIN CONTENT GRID ──────────────────────────────────── -->
    <main class="mx-auto w-[90%] max-w-7xl py-10">
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <!-- ── LEFT COLUMN (2/3) ──────────────────────────────── -->
        <div class="space-y-8 lg:col-span-2">
          <!-- TAB NAV -->
          <div
            class="flex gap-2 rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] p-1.5 shadow-[3px_3px_0px_#445944]">
            <button
              v-for="tab in [
                { id: 'pets', label: '🐾 寵物概況', icon: PawPrint },
                { id: 'game', label: '🎮 遊戲概況', icon: Gamepad2 },
                { id: 'posts', label: '📝 我的文章', icon: FileText },
              ]"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'flex-1 rounded-xl py-2.5 text-sm font-bold transition-all',
                activeTab === tab.id
                  ? 'border-2 border-[#445944] bg-[#445944] text-white shadow-[2px_2px_0px_#445944]'
                  : 'text-gray-600',
              ]">
              {{ tab.label }}
            </button>
          </div>

          <!-- ── PET OVERVIEW TAB ─────────────────────────────── -->
          <div v-show="activeTab === 'pets'" class="space-y-5">
            <!-- Header -->
            <div class="flex items-center justify-between">
              <h2 class="font-fredoka text-2xl font-black text-[#445944]">我的毛孩</h2>
              <div class="flex items-center gap-2">
                <button
                  @click="showHealthSummary = !showHealthSummary"
                  class="flex items-center gap-1.5 rounded-xl border-2 border-[#445944] bg-white px-4 py-2 text-sm font-bold text-[#445944] shadow-[2px_2px_0px_#445944] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-[#D4E6D0] hover:shadow-[1px_1px_0px_#445944]">
                  <Shield :size="15" />
                  {{ showHealthSummary ? '隱藏摘要' : '健康摘要' }}
                </button>
                <router-link
                  to="/healthpassport/addpet"
                  class="flex items-center gap-1.5 rounded-xl border-2 border-[#445944] bg-[#FAE4AE] px-4 py-2 text-sm font-bold text-[#445944] shadow-[2px_2px_0px_#445944] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#445944]">
                  <Plus :size="15" />
                  新增毛孩
                </router-link>
              </div>
            </div>

            <!-- Loading -->
            <div v-if="petsLoading" class="flex items-center justify-center py-16 text-[#445944]">
              <span class="text-sm font-bold animate-pulse">毛孩資料載入中...</span>
            </div>

            <template v-else>
              <!-- Pet Health Summary -->
              <div v-show="showHealthSummary" class="rounded-3xl border-4 border-[#445944] p-5 shadow-[5px_5px_0px_#445944]">
                <h3 class="font-fredoka mb-4 flex items-center gap-2 text-lg font-black text-[#445944]">
                  <Shield :size="20" />
                  健康摘要
                </h3>
                <div class="grid grid-cols-3 divide-x-2 divide-[#445944]/30">
                  <div class="flex flex-col items-center">
                    <span class="text-2xl font-black text-[#445944]">{{ myPets.length }}</span>
                    <span class="text-xs text-[#445944]/70">飼養數量</span>
                  </div>
                  <div class="flex flex-col items-center">
                    <span class="text-2xl font-black text-[#445944]">
                      {{ myPets.filter((p) => p.health === 'good').length }}
                    </span>
                    <span class="text-xs text-[#445944]/70">健康良好</span>
                  </div>
                  <div class="flex flex-col items-center">
                    <span class="text-2xl font-black text-[#A07A3C]">
                      {{ myPets.filter((p) => p.health === 'warning' || p.health === 'bad').length }}
                    </span>
                    <span class="text-xs text-[#445944]/70">疫苗提醒</span>
                  </div>
                </div>
                
              </div>
              <!-- Pet cards -->
              <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div
                  v-for="pet in myPets"
                  :key="pet.id"
                  class="pet-card group relative overflow-hidden rounded-3xl border-4 border-[#445944] bg-white shadow-[5px_5px_0px_#445944] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_#445944]">
                  <!-- Pet image -->
                  <div class="relative aspect-[16/9] overflow-hidden bg-[#D4E6D0]">
                    <img
                      v-if="pet.avatar"
                      :src="pet.avatar"
                      :alt="pet.name"
                      class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      @error="(e) => (e.target.style.display = 'none')" />
                    <div v-else class="flex h-full w-full items-center justify-center">
                      <PawPrint :size="48" class="text-[#445944]/30" />
                    </div>
                    <!-- Health badge -->
                    <span
                      class="absolute top-3 right-3 rounded-full border-2 border-[#445944] px-2.5 py-0.5 text-xs font-bold shadow-[2px_2px_0px_#445944]"
                      :style="{ background: getHealthBg(pet.health), color: getHealthColor(pet.health) }">
                      {{ getHealthLabel(pet.health) }}
                    </span>
                    <!-- Gender badge -->
                    <span
                      v-if="pet.gender"
                      class="absolute top-3 left-3 rounded-full border-2 border-[#445944] bg-white px-2 py-0.5 text-xs font-bold text-[#445944] shadow-[2px_2px_0px_#445944]">
                      {{ pet.gender === 'male' ? '♂ 公' : '♀ 母' }}
                    </span>
                  </div>

                  <div class="p-4">
                    <div class="mb-3 flex items-center justify-between">
                      <div>
                        <h3 class="font-fredoka text-xl font-black text-[#445944]">{{ pet.name }}</h3>
                        <p class="text-xs text-gray-500">
                          {{ pet.age }}
                          <span v-if="pet.weight"> · {{ pet.weight }} kg</span>
                          <span v-if="pet.isDesex !== null"> · {{ pet.isDesex ? '已絕育' : '未絕育' }}</span>
                        </p>
                      </div>
                      <router-link
                        to="/healthpassport"
                        class="flex items-center gap-1 rounded-xl border-2 border-[#445944] bg-[#D4E6D0] px-2.5 py-1.5 text-xs font-bold text-[#445944] shadow-[2px_2px_0px_#445944] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#445944]">
                        <Activity :size="12" />
                        護照
                      </router-link>
                    </div>

                    <!-- Vaccine reminder -->
                    <div
                      class="flex items-center gap-2 rounded-xl border-2 border-dashed px-3 py-2 text-xs"
                      :class="pet.nextVaccine ? 'border-[#A07A3C] bg-[#FAE4AE]/50' : 'border-gray-200 bg-gray-50'">
                      <Bell :size="13" class="shrink-0" :class="pet.nextVaccine ? 'text-[#A07A3C]' : 'text-gray-300'" />
                      <span :class="pet.nextVaccine ? 'text-[#7A5A20]' : 'text-gray-400'">
                        {{ pet.nextVaccine ? `下次疫苗：${formatDate(pet.nextVaccine)}` : '無疫苗提醒' }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Add pet placeholder -->
                <router-link
                  to="/healthpassport/addpet"
                  class="group flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-3xl border-4 border-dashed border-[#445944] bg-[#FCF4E5] transition-all hover:bg-[#D4E6D0]/30">
                  <div
                    class="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[#445944] bg-[#FAE4AE] shadow-[3px_3px_0px_#445944] transition-all group-hover:scale-110">
                    <Plus :size="24" class="text-[#445944]" />
                  </div>
                  <p class="text-sm font-bold text-gray-500 group-hover:text-[#445944]">新增毛孩</p>
                </router-link>
              </div>

              
            </template>
          </div>

          <!-- ── GAME OVERVIEW TAB ────────────────────────────── -->
          <div v-show="activeTab === 'game'" class="space-y-5">
            <h2 class="font-fredoka text-2xl font-black text-[#445944]">遊戲概況</h2>

            <!-- Game stats grid -->
            <div class="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div
                class="game-stat-card rounded-3xl border-4 border-[#A07A3C] bg-[#FAE4AE] p-5 text-center shadow-[5px_5px_0px_#A07A3C] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_#A07A3C]">
                <div class="mb-2 flex justify-center">
                  <div
                    class="shadow-[2px_2px_0px_#A07A3C rounded-2xl border-2 border-[#A07A3C] bg-white p-2.5">
                    <Zap :size="24" class="text-[#A07A3C]" />
                  </div>
                </div>
                <div class="font-fredoka text-3xl font-black text-[#A07A3C]">
                  {{ gameStats.points.toLocaleString() }}
                </div>
                <div class="text-sm font-bold text-[#7A5A20]">毛幣點數</div>
              </div>

              <div
                class="game-stat-card rounded-3xl border-4 border-[#9C6D6D] bg-[#9C6D6D]/15 p-5 text-center shadow-[5px_5px_0px_#9C6D6D] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_#9C6D6D]">
                <div class="mb-2 flex justify-center">
                  <div
                    class="rounded-2xl border-2 border-[#9C6D6D] bg-white p-2.5 shadow-[2px_2px_0px_#9C6D6D]">
                    <Trophy :size="24" class="text-[#9C6D6D]" />
                  </div>
                </div>
                <div class="font-fredoka text-3xl font-black text-[#9C6D6D]">
                  {{ gameStats.level || 0 }}
                </div>
                <div class="text-sm font-bold text-[#7A4A4A]">最高關卡</div>
              </div>

              <div
                class="game-stat-card rounded-3xl border-4 border-[#5B7FA0] bg-[#D0E2F3] p-5 text-center shadow-[5px_5px_0px_#5B7FA0] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_#5B7FA0]">
                <div class="mb-2 flex justify-center">
                  <div
                    class="rounded-2xl border-2 border-[#5B7FA0] bg-white p-2.5 shadow-[2px_2px_0px_#5B7FA0]">
                    <ShoppingBag :size="24" class="text-[#5B7FA0]" />
                  </div>
                </div>
                <div class="font-fredoka text-3xl font-black text-[#5B7FA0]">
                  {{ gameStats.skins }}
                </div>
                <div class="text-sm font-bold text-[#3A5870]">擁有造型</div>
              </div>
            </div>

            <!-- Game progress card -->
            <div
              class="rounded-3xl border-4 border-[#445944] bg-[#FCF4E5] p-6 shadow-[5px_5px_0px_#445944]">
              <h3
                class="font-fredoka mb-4 flex items-center gap-2 text-lg font-black text-[#445944]">
                <Award :size="20" />
                遊戲進度
              </h3>
              <div class="space-y-3">
                <div
                  class="flex items-center justify-between rounded-2xl border-2 border-[#445944] bg-[#FDF9F3] px-4 py-3">
                  <span class="text-sm font-bold text-gray-600">目前進度</span>
                  <span
                    class="rounded-xl border-2 border-[#445944] bg-[#FAE4AE] px-3 py-1 text-sm font-black text-[#7A5A20] shadow-[2px_2px_0px_#445944]">
                    {{ gameStats.progress }}
                  </span>
                </div>
                <div
                  class="flex items-center justify-between rounded-2xl border-2 border-[#445944] bg-[#FDF9F3] px-4 py-3">
                  <span class="text-sm font-bold text-gray-600">最後遊玩</span>
                  <span class="text-sm font-bold text-[#445944]">
                    {{ formatDate(gameStats.lastPlayed) }}
                  </span>
                </div>
              </div>
              <router-link
                to="/game"
                class="mt-5 flex items-center justify-center gap-2 rounded-2xl border-2 border-[#445944] bg-[#445944] py-3 text-sm font-bold text-white shadow-[3px_3px_0px_#445944] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_#445944]">
                <Gamepad2 :size="18" />
                前往遊戲中心
                <ChevronRight :size="16" />
              </router-link>
            </div>
          </div>

          <!-- ── MY POSTS TAB ─────────────────────────────────── -->
          <div v-show="activeTab === 'posts'" class="space-y-5">
            <div class="flex items-center justify-between">
              <h2 class="font-fredoka text-2xl font-black text-[#445944]">我的文章</h2>
              <router-link
                to="/create-article"
                class="flex items-center gap-1.5 rounded-xl border-2 border-[#445944] bg-[#FAE4AE] px-4 py-2 text-sm font-bold text-[#445944] shadow-[2px_2px_0px_#445944] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#445944]">
                <Plus :size="15" />
                寫文章
              </router-link>
            </div>

            <!-- Loading -->
            <div v-if="postsLoading" class="flex items-center justify-center py-16 text-[#445944]">
              <span class="text-sm font-bold animate-pulse">文章載入中...</span>
            </div>

            <template v-else>
              <div class="space-y-4">
                <router-link
                  v-for="post in myPosts"
                  :key="post.id"
                  :to="{ name: 'article-detail', params: { id: post.id } }"
                  class="group block rounded-3xl border-4 border-[#445944] bg-white shadow-[4px_4px_0px_#445944] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#445944] overflow-hidden">

                  <!-- 封面圖（若有） -->
                  <div v-if="post.mainImage" class="aspect-[3/1] overflow-hidden bg-gray-100">
                    <img :src="post.mainImage" :alt="post.title"
                      class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      @error="(e) => e.target.parentElement.style.display = 'none'" />
                  </div>

                  <div class="p-5">
                    <!-- Badges -->
                    <div class="mb-2 flex flex-wrap items-center gap-2">
                      <!-- 狀態 badge -->
                      <span
                        class="rounded-full border-2 px-2.5 py-0.5 text-xs font-bold"
                        :class="postStatusClass(post.status)">
                        {{ postStatusLabel(post.status) }}
                      </span>
                      <!-- 分類 badge -->
                      <span
                        class="rounded-full border-2 border-[#445944] bg-[#D4E6D0] px-2.5 py-0.5 text-xs font-bold text-[#445944]">
                        {{ post.tag }}
                      </span>
                      <!-- 標籤 -->
                      <span
                        v-for="t in post.tags.slice(0, 2)"
                        :key="t"
                        class="rounded-full border border-gray-300 bg-gray-50 px-2 py-0.5 text-xs text-gray-500">
                        # {{ t }}
                      </span>
                    </div>

                    <!-- 標題 -->
                    <h3 class="font-fredoka mb-1 text-lg font-black text-gray-800 group-hover:text-[#445944] line-clamp-2">
                      {{ post.title }}
                    </h3>

                    <!-- 摘要 -->
                    <p class="mb-3 line-clamp-2 text-sm text-gray-500">{{ post.summary }}</p>

                    <!-- 底部資訊 -->
                    <div class="flex items-center justify-between text-xs text-gray-400">
                      <span class="flex items-center gap-1">
                        <Clock :size="12" />
                        {{ formatDate(post.date) }}
                      </span>
                      <span class="flex items-center gap-1">
                        👁 {{ post.viewCount.toLocaleString() }} 次瀏覽
                      </span>
                    </div>
                  </div>
                </router-link>

                <!-- 空狀態 -->
                <div
                  v-if="myPosts.length === 0"
                  class="rounded-3xl border-4 border-dashed border-[#445944] bg-[#FCF4E5] py-16 text-center">
                  <FileText :size="40" class="mx-auto mb-3 text-[#445944]/30" />
                  <p class="font-bold text-gray-400">還沒有發表文章，來分享你的毛孩日常吧！</p>
                  <router-link
                    to="/create-article"
                    class="mt-4 inline-flex items-center gap-1.5 rounded-xl border-2 border-[#445944] bg-[#FAE4AE] px-4 py-2 text-sm font-bold text-[#445944]">
                    <Plus :size="14" />
                    寫第一篇文章
                  </router-link>
                </div>
              </div>

              <router-link
                to="/community-home"
                class="flex items-center justify-center gap-2 rounded-2xl border-2 border-[#445944] bg-[#FAE4AE] py-3 text-sm font-bold text-[#445944] shadow-[3px_3px_0px_#445944] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_#445944]">
                <Users :size="18" />
                前往社群首頁
                <ChevronRight :size="16" />
              </router-link>
            </template>
          </div>
        </div>

        <!-- ── RIGHT SIDEBAR ──────────────────────────────────── -->
        <div class="space-y-6 lg:col-span-1">
          <!-- Quick Navigation -->
          <div
            class="rounded-3xl border-4 border-[#445944] bg-[#FCF4E5] p-5 shadow-[5px_5px_0px_#445944]">
            <h3 class="font-fredoka mb-4 flex items-center gap-2 text-lg font-black text-[#445944]">
              <Zap :size="18" />
              快速導覽
            </h3>
            <div class="grid grid-cols-3 gap-2">
              <router-link
                v-for="link in quickLinks"
                :key="link.label"
                :to="link.route"
                class="quick-link flex flex-col items-center gap-1.5 rounded-2xl border-2 border-[#445944] p-3 text-center transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#445944]"
                :style="{ background: link.bg }">
                <component :is="link.icon" :size="20" :style="{ color: link.color }" />
                <span class="text-[11px] leading-tight font-bold" :style="{ color: link.color }">
                  {{ link.label }}
                </span>
              </router-link>
            </div>
          </div>

          <!-- Community Stats -->
          <div
            class="rounded-3xl border-4 border-[#7a6856] bg-[#FCF4E5] p-5 shadow-[5px_5px_0px_#7a6856]">
            <h3 class="font-fredoka mb-4 flex items-center gap-2 text-lg font-black text-[#7a6856]">
              <Users :size="18" />
              社群概況
            </h3>
            <div class="space-y-3">
              <div
                class="flex items-center justify-between rounded-xl border-2 border-[#7a6856] bg-[#FCF4E5] px-4 py-3">
                <span class="flex items-center gap-2 text-sm font-bold text-[#7a6856]">
                  <FileText :size="15" class="text-[#7a6856]" />
                  發表文章
                </span>
                <span class="font-fredoka text-xl font-black text-[#7a6856]">
                  {{ myPosts.length }}
                </span>
              </div>
              <div
                class="flex items-center justify-between rounded-xl border-2 border-[#7a6856] bg-[#FCF4E5] px-4 py-3">
                <span class="flex items-center gap-2 text-sm font-bold text-[#7a6856]">
                  <BookOpen :size="15" class="text-[#7a6856]" />
                  已發表文章
                </span>
                <span class="font-fredoka text-xl font-black text-[#7a6856]">
                  {{ myPosts.filter((p) => p.status === 1).length }}
                </span>
              </div>
              <div
                class="flex items-center justify-between rounded-xl border-2 border-[#7a6856] bg-[#FCF4E5] px-4 py-3">
                <span class="flex items-center gap-2 text-sm font-bold text-[#7a6856]">
                  <Activity :size="15" class="text-[#7a6856]" />
                  累計瀏覽
                </span>
                <span class="font-fredoka text-xl font-black text-[#7a6856]">
                  {{ myPosts.reduce((acc, p) => acc + p.viewCount, 0).toLocaleString() }}
                </span>
              </div>
            </div>
            <router-link
              to="/community-home"
              class="mt-4 flex items-center justify-center gap-1 text-sm font-bold text-[#7a6856] hover:underline">
              前往社群
              <ChevronRight :size="14" />
            </router-link>
          </div>

          <!-- Support & Contact -->
          <div
            class="rounded-3xl border-4 border-[#445944] bg-[#FCF4E5] p-5 shadow-[5px_5px_0px_#445944]">
            <h3 class="font-fredoka mb-4 flex items-center gap-2 text-lg font-black text-[#445944]">
              <HeadphonesIcon :size="18" />
              客服 &amp; 支援
            </h3>
            <div class="space-y-3">
              <router-link
                v-for="link in supportLinks"
                :key="link.label"
                :to="link.route"
                class="group flex items-center gap-3 rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] px-4 py-3 transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-[#445944]/30 hover:shadow-[2px_2px_0px_#445944]">
                <div
                  class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-[#445944] bg-[#FCF4E5] shadow-[2px_2px_0px_#445944] transition-all group-hover:shadow-none">
                  <component :is="link.icon" :size="16" class="text-[#445944]" />
                </div>
                <div class="min-w-0 flex-1">
                  <div class="text-sm font-bold text-[#445944]">{{ link.label }}</div>
                  <div class="truncate text-xs text-[#445944]">{{ link.desc }}</div>
                </div>
                <ChevronRight
                  :size="14"
                  class="shrink-0 text-gray-400 transition-transform group-hover:translate-x-1" />
              </router-link>
            </div>
          </div>

          <!-- Account Settings -->
          <div
            class="rounded-3xl border-4 border-[#7a6856] bg-[#FCF4E5] p-5 shadow-[4px_4px_0px_#7a6856]">
            <h3 class="font-fredoka mb-4 flex items-center gap-2 text-lg font-black text-[#7a6856]">
              <Settings :size="18" />
              帳號設定
            </h3>
            <div class="space-y-2">
              <button
                @click="startEdit"
                class="group flex w-full items-center gap-3 rounded-2xl border-2 border-[#7a6856] bg-[#FCF4E5] px-4 py-3 text-left transition-all hover:bg-[#7a6856]/30">
                <Edit3 :size="15" class="text-[#7a6856]" />
                <span class="text-sm font-bold text-[#7a6856]">編輯個人資料</span>
                <ChevronRight
                  :size="14"
                  class="ml-auto text-[#7a6856] transition-transform group-hover:translate-x-1" />
              </button>
              <button
                class="group flex w-full items-center gap-3 rounded-2xl border-2 border-[#7a6856] bg-[#FCF4E5] px-4 py-3 text-left transition-all hover:bg-[#7a6856]/30">
                <Bell :size="15" class="text-[#7a6856]" />
                <span class="text-sm font-bold text-[#7a6856]">通知設定</span>
                <ChevronRight
                  :size="14"
                  class="ml-auto text-[#7a6856] transition-transform group-hover:translate-x-1" />
              </button>
              <button
                @click="logout"
                class="group flex w-full items-center gap-3 rounded-2xl border-2 border-[#7a6856] bg-[#FCF4E5] px-4 py-3 text-left transition-all hover:bg-[#7a6856]/30">
                <LogOut :size="15" class="text-[#7a6856]" />
                <span class="text-sm font-bold text-[#7a6856]">登出帳號</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- ── EDIT PROFILE MODAL ─────────────────────────────────── -->
    <div
      v-if="isEditingProfile"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="isEditingProfile = false">
      <Transition name="modal">
        <div v-if="isEditingProfile" class="flex justify-center mt-40 h-[70%] w-full max-w-lg">
          <div
            class="w-full rounded-3xl border-4 border-[#445944] bg-[#FCF4E5] p-8 shadow-[8px_8px_0px_#445944]">
            <div class="mb-6 flex items-center justify-between">
              <h2 class="font-fredoka text-2xl font-black text-[#445944]">編輯個人資料</h2>
              <button
                @click="isEditingProfile = false"
                class="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-[#445944] bg-white shadow-[2px_2px_0px_#445944] hover:bg-red-50">
                ✕
              </button>
            </div>
            <!-- 載入中 -->
            <div v-if="isLoadingForm" class="flex items-center justify-center py-16">
              <span class="text-sm font-bold text-[#445944] animate-pulse">資料載入中...</span>
            </div>
            <div v-else class="max-h-[50vh] overflow-y-auto pr-1 space-y-5">
              <!-- ── 帳號資訊（唯讀） ── -->
              <!-- <div class="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-4 space-y-2">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">帳號資訊（唯讀）</p>
                <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="font-bold text-gray-500">會員 ID</span>
                    <span class="font-bold text-gray-700">{{ editForm.userId ?? '—' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="font-bold text-gray-500">毛幣點數</span>
                    <span class="font-bold text-[#A07A3C]">{{ editForm.point ?? 0 }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="font-bold text-gray-500">帳號狀態</span>
                    <span
                      class="rounded-full px-2 py-0.5 text-xs font-bold"
                      :class="editForm.status ? 'bg-[#D4E6D0] text-[#445944]' : 'bg-red-100 text-red-600'">
                      {{ editForm.status ? '正常' : '停用' }}
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span class="font-bold text-gray-500">信箱驗證</span>
                    <span
                      class="rounded-full px-2 py-0.5 text-xs font-bold"
                      :class="editForm.isVerify ? 'bg-[#D4E6D0] text-[#445944]' : 'bg-[#FAE4AE] text-[#7A5A20]'">
                      {{ editForm.isVerify ? '已驗證' : '未驗證' }}
                    </span>
                  </div>
                  <div class="flex justify-between col-span-2">
                    <span class="font-bold text-gray-500">加入時間</span>
                    <span class="font-bold text-gray-700">{{ editForm.createdAt ? formatDate(editForm.createdAt) : '—' }}</span>
                  </div>
                  <div class="flex justify-between col-span-2">
                    <span class="font-bold text-gray-500">最後更新</span>
                    <span class="font-bold text-gray-700">{{ editForm.updatedAt ? formatDate(editForm.updatedAt) : '—' }}</span>
                  </div>
                </div>
              </div> -->
              <!-- ── 可編輯欄位 ── -->
              <div class="space-y-4 ">
                <!-- 電子郵件（唯讀） -->
                <div>
                  <label class="mb-1.5 block text-sm font-bold text-gray-700">
                    電子郵件
                    <span class="ml-1 text-xs font-normal text-gray-400">（不可修改）</span>
                  </label>
                  <input
                    :value="editForm.email"
                    type="email"
                    disabled
                    class="w-full rounded-2xl border-2 border-gray-200 bg-gray-100 px-4 py-3 text-sm font-bold text-gray-400 cursor-not-allowed" />
                </div>
                <!-- 頭像網址 -->
                <div>
                  <label class="mb-1.5 block text-sm font-bold text-gray-700">頭像網址</label>
                  <div class="flex items-center gap-3">
                    <div class="h-12 w-12 shrink-0 overflow-hidden rounded-2xl border-2 border-[#445944] bg-[#445944] flex items-center justify-center">
                      <img v-if="editForm.photo" :src="editForm.photo" class="h-full w-full object-cover" alt="頭像預覽"
                        @error="editForm.photo = ''" />
                      <span v-else class="text-lg font-black text-[#FAE4AE]">{{ avatarInitials }}</span>
                    </div>
                    <input
                      v-model="editForm.photo"
                      type="text"
                      placeholder="貼上圖片網址"
                      class="flex-1 rounded-2xl border-2 border-gray-300 bg-white px-4 py-3 text-sm font-bold focus:border-[#445944] focus:ring-2 focus:ring-[#445944]/20 focus:outline-none" />
                  </div>
                </div>
                <!-- 姓名 -->
                <div>
                  <label class="mb-1.5 block text-sm font-bold text-gray-700">姓名 / 暱稱</label>
                  <input
                    v-model="editForm.name"
                    type="text"
                    placeholder="請輸入姓名"
                    class="w-full rounded-2xl border-2 border-gray-300 bg-white px-4 py-3 text-sm font-bold focus:border-[#445944] focus:ring-2 focus:ring-[#445944]/20 focus:outline-none" />
                </div>
                <!-- 電話 -->
                <div>
                  <label class="mb-1.5 block text-sm font-bold text-gray-700">電話</label>
                  <input
                    v-model="editForm.phone"
                    type="tel"
                    placeholder="請輸入電話號碼"
                    class="w-full rounded-2xl border-2 border-gray-300 bg-white px-4 py-3 text-sm font-bold focus:border-[#445944] focus:ring-2 focus:ring-[#445944]/20 focus:outline-none" />
                </div>
                <!-- 職業 + 城市 -->
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="mb-1.5 block text-sm font-bold text-gray-700">職業</label>
                    <input
                      v-model="editForm.job"
                      type="text"
                      placeholder="例：學生、上班族"
                      class="w-full rounded-2xl border-2 border-gray-300 bg-white px-4 py-3 text-sm font-bold focus:border-[#445944] focus:ring-2 focus:ring-[#445944]/20 focus:outline-none" />
                  </div>
                  <div>
                    <label class="mb-1.5 block text-sm font-bold text-gray-700">居住城市</label>
                    <input
                      v-model="editForm.city"
                      type="text"
                      placeholder="例：台北市"
                      class="w-full rounded-2xl border-2 border-gray-300 bg-white px-4 py-3 text-sm font-bold focus:border-[#445944] focus:ring-2 focus:ring-[#445944]/20 focus:outline-none" />
                  </div>
                </div>
                <!-- 生日 -->
                <div>
                  <label class="mb-1.5 block text-sm font-bold text-gray-700">生日</label>
                  <input
                    v-model="editForm.birthday"
                    type="date"
                    class="w-full rounded-2xl border-2 border-gray-300 bg-white px-4 py-3 text-sm font-bold focus:border-[#445944] focus:ring-2 focus:ring-[#445944]/20 focus:outline-none" />
                </div>
                <!-- 個人簡介 -->
                <div>
                  <label class="mb-1.5 block text-sm font-bold text-gray-700">個人簡介</label>
                  <textarea
                    v-model="editForm.note"
                    rows="3"
                    placeholder="介紹一下自己和你的毛孩..."
                    class="w-full resize-none rounded-2xl border-2 border-gray-300 bg-white px-4 py-3 text-sm font-bold focus:border-[#445944] focus:ring-2 focus:ring-[#445944]/20 focus:outline-none" />
                </div>
                <!-- 飼養經驗 + 訂閱電子報 -->
                <div class="grid grid-cols-2 gap-3">
                  <label
                    class="flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-gray-300 bg-white px-4 py-3 transition-colors"
                    :class="editForm.hasPriorExp ? 'border-[#445944] bg-[#D4E6D0]' : ''">
                    <input v-model="editForm.hasPriorExp" type="checkbox" class="accent-[#445944] h-4 w-4" />
                    <span class="text-sm font-bold text-gray-700">有飼養經驗</span>
                  </label>
                  <label
                    class="flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-gray-300 bg-white px-4 py-3 transition-colors"
                    :class="editForm.isSubscribe ? 'border-[#445944] bg-[#D4E6D0]' : ''">
                    <input v-model="editForm.isSubscribe" type="checkbox" class="accent-[#445944] h-4 w-4" />
                    <span class="text-sm font-bold text-gray-700">訂閱電子報</span>
                  </label>
                </div>
                <!-- 錯誤訊息 -->
                <p v-if="saveError" class="rounded-xl border-2 border-red-300 bg-red-50 px-4 py-2 text-sm font-bold text-red-600">
                  {{ saveError }}
                </p>
                <div class="flex gap-3 pt-2">
                  <button
                    @click="saveProfile"
                    :disabled="isSaving"
                    class="flex-1 rounded-2xl border-2 border-[#445944] bg-[#445944] py-3 text-sm font-bold text-white transition-all hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0">
                    <CheckCircle class="mr-1.5 inline" :size="16" />
                    {{ isSaving ? '儲存中...' : '儲存變更' }}
                  </button>
                  <button
                    @click="isEditingProfile = false"
                    :disabled="isSaving"
                    class="flex-1 rounded-2xl border-2 border-[#445944] bg-white py-3 text-sm font-bold text-[#445944] transition-all hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-60">
                    取消
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&family=Quicksand:wght@300..700&display=swap');

.font-fredoka {
  font-family: 'Fredoka', 'GenJyuu', sans-serif;
}

/* Page entry animation */
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

/* Pet card hover */
.pet-card {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

/* Quick link hover */
.quick-link {
  transition: all 0.2s ease;
}

/* Game stat cards */
.game-stat-card {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

/* Modal transition */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-thumb {
  background: #445944;
  border-radius: 9999px;
}
</style>
