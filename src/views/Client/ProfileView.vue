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

// Edit form
const editForm = ref({
  name: '',
  email: '',
  phone: '',
  bio: '',
})

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

// My Pets (mock data, replace with API)
const myPets = ref([
  {
    id: 1,
    name: '小白',
    breed: '柴犬',
    gender: 'male',
    age: 2,
    weight: 10.5,
    health: 'good',
    avatar: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=200',
    nextVaccine: '2026-07-15',
  },
  {
    id: 2,
    name: '咪咪',
    breed: '英國短毛貓',
    gender: 'female',
    age: 1,
    weight: 4.2,
    health: 'good',
    avatar: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=200',
    nextVaccine: '2026-06-01',
  },
])

// My posts (mock data)
const myPosts = ref([
  {
    id: 1,
    title: '分享我家小白的日常 🐕',
    summary: '今天帶小白去公園玩，牠超開心的！附上幾張可愛照片...',
    date: '2026-05-20',
    likes: 45,
    comments: 12,
    tag: '日常分享',
  },
  {
    id: 2,
    title: '貓咪夏日護膚小撇步',
    summary: '夏天到了，分享幾個幫助咪咪保持健康皮毛的小技巧！',
    date: '2026-05-10',
    likes: 88,
    comments: 23,
    tag: '寵物知識',
  },
])

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
    const res = await request.get(`https://localhost:7048/api/Users/${userId}/player-profile`)
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

onMounted(() => {
  fetchGameStats()
})

const startEdit = () => {
  editForm.value = {
    name: user.value.name || user.value.userName || '',
    email: user.value.email || user.value.userEmail || '',
    phone: user.value.phone || '',
    bio: user.value.bio || '',
  }
  isEditingProfile.value = true
}

const saveProfile = async () => {
  try {
    console.log('儲存資料:', editForm.value)
    isEditingProfile.value = false
  } catch (e) {
    console.error(e)
  }
}

const logout = () => {
  if (confirm('確定要登出嗎？')) {
    authStore.clearLoginInfo()
    router.push('/')
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
                class="avatar-ring h-24 w-24 rounded-3xl border-4 border-black bg-[#445944] shadow-[4px_4px_0px_#000] flex items-center justify-center overflow-hidden">
                <img
                  v-if="user.avatar"
                  :src="user.avatar"
                  alt="頭像"
                  class="h-full w-full object-cover" />
                <span v-else class="text-4xl font-black text-[#FAE4AE]">{{ avatarInitials }}</span>
              </div>
              <button
                class="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-xl border-2 border-black bg-[#FAE4AE] shadow-[2px_2px_0px_#000] transition-all hover:bg-[#f2d44d] hover:shadow-[1px_1px_0px_#000]"
                title="更換頭像">
                <Camera :size="14" />
              </button>
            </div>

            <!-- User details -->
            <div class="flex-1">
              <div class="mb-1 flex items-center gap-3 flex-wrap">
                <h1 class="font-fredoka text-3xl font-black text-[#445944]">
                  {{ user.name || user.userName || '毛孩的好朋友' }}
                </h1>
                <span
                  class="rounded-full bg-[#7a6856] px-3 py-0.5 text-xs font-bold text-white">
                  🐾 Petmily 會員
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
                <span class="flex items-center gap-2">
                  <Clock :size="13" class="text-[#9C6D6D]" />
                  加入時間：{{ user.createdAt ? formatDate(user.createdAt) : '2024 年' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Right: Action buttons -->
          <div class="flex flex-wrap items-center gap-3">
            <button
              @click="startEdit"
              class="flex items-center gap-2 rounded-2xl border-2 border-[#445944] bg-white px-5 py-2.5 text-sm font-bold text-[#445944] shadow-[3px_3px_0px_#445944] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_#445944] hover:bg-[#FAE4AE]">
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
        <div class="mt-6 grid grid-cols-3 divide-x-2 divide-[#445944] rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] shadow-[4px_4px_0px_#445944] sm:grid-cols-3">
          <div class="flex flex-col items-center py-4 px-2">
            <span class="font-fredoka text-2xl font-black text-[#445944]">{{ myPets.length }}</span>
            <span class="text-xs text-gray-500 mt-0.5">我的毛孩</span>
          </div>
          <div class="flex flex-col items-center py-4 px-2">
            <span class="font-fredoka text-2xl font-black text-[#A07A3C]">{{ gameStats.points.toLocaleString() }}</span>
            <span class="text-xs text-gray-500 mt-0.5">毛幣點數</span>
          </div>
          <div class="flex flex-col items-center py-4 px-2">
            <span class="font-fredoka text-2xl font-black text-[#7a6856]">{{ myPosts.length }}</span>
            <span class="text-xs text-gray-500 mt-0.5">我的文章</span>
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
          <div class="flex gap-2 rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] p-1.5 shadow-[3px_3px_0px_#445944]">
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
              <router-link
                to="/healthpassport/addpet"
                class="flex items-center gap-1.5 rounded-xl border-2 text-[#445944] border-[#445944] bg-[#FAE4AE] px-4 py-2 text-sm font-bold shadow-[2px_2px_0px_#445944] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#445944]">
                <Plus :size="15" />
                新增毛孩
              </router-link>
            </div>

            <!-- Pet cards -->
            <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div
                v-for="pet in myPets"
                :key="pet.id"
                class="pet-card group relative overflow-hidden rounded-3xl border-4 border-[#445944] bg-white shadow-[5px_5px_0px_#445944] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_#445944]">
                <!-- Pet image -->
                <div class="relative aspect-[16/9] overflow-hidden bg-gray-100">
                  <img :src="pet.avatar" :alt="pet.name" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <!-- Health badge -->
                  <span
                    class="absolute top-3 right-3 rounded-full border-2  border-[#445944] px-2.5 py-0.5 text-xs font-bold shadow-[2px_2px_0px_#445944]"
                    :style="{ background: getHealthBg(pet.health), color: getHealthColor(pet.health) }">
                    {{ getHealthLabel(pet.health) }}
                  </span>
                  <!-- Gender badge -->
                  <span class="absolute top-3 left-3 rounded-full border-2 text-[#445944] border-[#445944] bg-white px-2 py-0.5 text-xs font-bold shadow-[2px_2px_0px_#445944]">
                    {{ pet.gender === 'male' ? '♂ 男生' : '♀ 女生' }}
                  </span>
                </div>

                <div class="p-4">
                  <div class="mb-3 flex items-center justify-between">
                    <div>
                      <h3 class="font-fredoka text-xl font-black text-[#445944]">{{ pet.name }}</h3>
                      <p class="text-xs text-gray-500">{{ pet.breed }} · {{ pet.age }} 歲 · {{ pet.weight }} kg</p>
                    </div>
                    <router-link
                      :to="`/healthpassport`"
                      class="flex items-center gap-1 rounded-xl border-2 border-[#445944] bg-[#D4E6D0] px-2.5 py-1.5 text-xs font-bold text-[#445944] shadow-[2px_2px_0px_#445944] hover:shadow-[1px_1px_0px_#445944] hover:translate-x-[1px] hover:translate-y-[1px] transition-all">
                      <Activity :size="12" />
                      護照
                    </router-link>
                  </div>

                  <!-- Vaccine reminder -->
                  <div class="flex items-center gap-2 rounded-xl border-2 border-dashed border-[#A07A3C] bg-[#FAE4AE]/50 px-3 py-2 text-xs">
                    <Bell :size="13" class="text-[#A07A3C] shrink-0" />
                    <span class="text-[#7A5A20]">下次疫苗：{{ formatDate(pet.nextVaccine) }}</span>
                  </div>
                </div>
              </div>

              <!-- Add pet placeholder -->
              <router-link
                to="/healthpassport/addpet"
                class="group flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-3xl border-4 border-dashed border-[#445944] bg-[#FCF4E5] transition-all hover:border-[#445944] hover:bg-[#D4E6D0]/30">
                <div class="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[#445944] bg-[#FAE4AE] shadow-[3px_3px_0px_#445944] transition-all group-hover:scale-110">
                  <Plus :size="24" class="text-[#445944]" />
                </div>
                <p class="text-sm font-bold text-gray-500 group-hover:text-[#445944]">新增毛孩</p>
              </router-link>
            </div>

            <!-- Pet Health Summary -->
            <div class="rounded-3xl border-4 border-[#445944] p-5 shadow-[5px_5px_0px_#445944]">
              <h3 class="mb-4 flex items-center gap-2 font-fredoka text-lg font-black text-[#445944]">
                <Shield :size="20" />
                健康摘要
              </h3>
              <div class="grid grid-cols-3 divide-x-2 divide-[#445944]/30">
                <div class="flex flex-col items-center">
                  <span class="text-2xl font-black text-[#445944]">{{ myPets.length }}</span>
                  <span class="text-xs text-[#445944]/70">飼養數量</span>
                </div>
                <div class="flex flex-col items-center">
                  <span class="text-2xl font-black text-[#445944]">{{ myPets.filter(p => p.health === 'good').length }}</span>
                  <span class="text-xs text-[#445944]/70">健康良好</span>
                </div>
                <div class="flex flex-col items-center">
                  <span class="text-2xl font-black text-[#A07A3C]">{{ myPets.filter(p => p.nextVaccine).length }}</span>
                  <span class="text-xs text-[#445944]/70">疫苗提醒</span>
                </div>
              </div>
            </div>
          </div>

          <!-- ── GAME OVERVIEW TAB ────────────────────────────── -->
          <div v-show="activeTab === 'game'" class="space-y-5">
            <h2 class="font-fredoka text-2xl font-black text-[#445944]">遊戲概況</h2>

            <!-- Game stats grid -->
            <div class="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div class="game-stat-card rounded-3xl border-4 border-[#A07A3C] bg-[#FAE4AE] p-5 shadow-[5px_5px_0px_#A07A3C] text-center transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_#A07A3C]">
                <div class="mb-2 flex justify-center">
                  <div class="rounded-2xl border-2 border-[#A07A3C] bg-white p-2.5 shadow-[2px_2px_0px_#A07A3C">
                    <Zap :size="24" class="text-[#A07A3C]" />
                  </div>
                </div>
                <div class="font-fredoka text-3xl font-black text-[#A07A3C]">{{ gameStats.points.toLocaleString() }}</div>
                <div class="text-sm font-bold text-[#7A5A20]">毛幣點數</div>
              </div>

              <div class="game-stat-card rounded-3xl border-4 border-[#9C6D6D] bg-[#9C6D6D]/15 p-5 shadow-[5px_5px_0px_#9C6D6D] text-center transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_#9C6D6D]">
                <div class="mb-2 flex justify-center">
                  <div class="rounded-2xl border-2 border-[#9C6D6D] bg-white p-2.5 shadow-[2px_2px_0px_#9C6D6D]">
                    <Trophy :size="24" class="text-[#9C6D6D]" />
                  </div>
                </div>
                <div class="font-fredoka text-3xl font-black text-[#9C6D6D]">{{ gameStats.level || 0 }}</div>
                <div class="text-sm font-bold text-[#7A4A4A]">最高關卡</div>
              </div>

              <div class="game-stat-card rounded-3xl border-4 border-[#5B7FA0] bg-[#D0E2F3] p-5 shadow-[5px_5px_0px_#5B7FA0] text-center transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_#5B7FA0]">
                <div class="mb-2 flex justify-center">
                  <div class="rounded-2xl border-2 border-[#5B7FA0] bg-white p-2.5 shadow-[2px_2px_0px_#5B7FA0]">
                    <ShoppingBag :size="24" class="text-[#5B7FA0]" />
                  </div>
                </div>
                <div class="font-fredoka text-3xl font-black text-[#5B7FA0]">{{ gameStats.skins }}</div>
                <div class="text-sm font-bold text-[#3A5870]">擁有造型</div>
              </div>
            </div>

            <!-- Game progress card -->
            <div class="rounded-3xl border-4 border-[#445944] bg-[#FCF4E5] p-6 shadow-[5px_5px_0px_#445944]">
              <h3 class="mb-4 flex items-center gap-2 font-fredoka text-lg font-black text-[#445944]">
                <Award :size="20" />
                遊戲進度
              </h3>
              <div class="space-y-3">
                <div class="flex items-center justify-between rounded-2xl border-2 border-[#445944] bg-[#FDF9F3] px-4 py-3">
                  <span class="text-sm font-bold text-gray-600">目前進度</span>
                  <span class="rounded-xl border-2 border-[#445944] bg-[#FAE4AE] px-3 py-1 text-sm font-black text-[#7A5A20] shadow-[2px_2px_0px_#445944]">{{ gameStats.progress }}</span>
                </div>
                <div class="flex items-center justify-between rounded-2xl border-2 border-[#445944] bg-[#FDF9F3] px-4 py-3">
                  <span class="text-sm font-bold text-gray-600">最後遊玩</span>
                  <span class="text-sm font-bold text-[#445944]">{{ formatDate(gameStats.lastPlayed) }}</span>
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
                class="flex items-center gap-1.5 rounded-xl border-2 text-[#445944] border-[#445944] bg-[#FAE4AE] px-4 py-2 text-sm font-bold shadow-[2px_2px_0px_#445944] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#445944]">
                <Plus :size="15" />
                寫文章
              </router-link>
            </div>

            <div class="space-y-4">
              <div
                v-for="post in myPosts"
                :key="post.id"
                class="group rounded-3xl border-4 text-[#445944] border-[#445944] bg-white p-5 shadow-[4px_4px_0px_#445944] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#445944]">
                <div class="mb-2 flex items-start justify-between gap-3">
                  <div class="flex-1">
                    <span class="mb-2 inline-block rounded-full border-2 border-[#445944] bg-[#D4E6D0] px-2.5 py-0.5 text-xs font-bold text-[#445944]">
                      {{ post.tag }}
                    </span>
                    <h3 class="font-fredoka text-lg font-black text-gray-800 group-hover:text-[#445944]">{{ post.title }}</h3>
                  </div>
                </div>
                <p class="mb-3 text-sm text-gray-600 line-clamp-2">{{ post.summary }}</p>
                <div class="flex items-center justify-between text-xs text-gray-500">
                  <span class="flex items-center gap-1"><Clock :size="12" /> {{ post.date }}</span>
                  <div class="flex items-center gap-4">
                    <span class="flex items-center gap-1">❤️ {{ post.likes }}</span>
                    <span class="flex items-center gap-1">💬 {{ post.comments }}</span>
                  </div>
                </div>
              </div>

              <div v-if="myPosts.length === 0" class="rounded-3xl border-4 border-dashed border-black bg-[#FCF4E5] py-16 text-center">
                <p class="text-gray-400 font-bold">還沒有發表文章，來分享你的毛孩日常吧！</p>
              </div>
            </div>

            <router-link
              to="/community-home"
              class="flex items-center justify-center gap-2 rounded-2xl border-2 border-[#445944] bg-[#FAE4AE] py-3 text-sm font-bold text-[#445944] shadow-[3px_3px_0px_#445944] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_#445944]">
              <Users :size="18" />
              前往社群首頁
              <ChevronRight :size="16" />
            </router-link>
          </div>

        </div>

        <!-- ── RIGHT SIDEBAR ──────────────────────────────────── -->
        <div class="space-y-6 lg:col-span-1">

          <!-- Quick Navigation -->
          <div class="rounded-3xl border-4 border-[#445944] bg-[#FCF4E5] p-5 shadow-[5px_5px_0px_#445944]">
            <h3 class="mb-4 flex items-center gap-2 font-fredoka text-lg font-black text-[#445944]">
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
                <span class="text-[11px] font-bold leading-tight" :style="{ color: link.color }">{{ link.label }}</span>
              </router-link>
            </div>
          </div>

          <!-- Community Stats -->
          <div class="rounded-3xl border-4 border-[#7a6856] bg-[#FCF4E5] p-5 shadow-[5px_5px_0px_#7a6856]">
            <h3 class="mb-4 flex items-center gap-2 font-fredoka text-lg font-black text-[#7a6856]">
              <Users :size="18" />
              社群概況
            </h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between rounded-xl border-2 border-[#7a6856] bg-[#FCF4E5] px-4 py-3">
                <span class="flex items-center gap-2 text-sm font-bold text-[#7a6856]">
                  <FileText :size="15" class="text-[#7a6856]" />
                  發表文章
                </span>
                <span class="font-fredoka text-xl font-black text-[#7a6856]">{{ myPosts.length }}</span>
              </div>
              <div class="flex items-center justify-between rounded-xl border-2 border-[#7a6856] bg-[#FCF4E5] px-4 py-3">
                <span class="flex items-center gap-2 text-sm font-bold text-[#7a6856]">
                  <Heart :size="15" class="text-[#7a6856]" />
                  累計按讚
                </span>
                <span class="font-fredoka text-xl font-black text-[#7a6856]">
                  {{ myPosts.reduce((acc, p) => acc + p.likes, 0) }}
                </span>
              </div>
              <div class="flex items-center justify-between rounded-xl border-2 border-[#7a6856] bg-[#FCF4E5] px-4 py-3">
                <span class="flex items-center gap-2 text-sm font-bold text-[#7a6856]">
                  <MessageCircle :size="15" class="text-[#7a6856]" />
                  累計留言
                </span>
                <span class="font-fredoka text-xl font-black text-[#7a6856]">
                  {{ myPosts.reduce((acc, p) => acc + p.comments, 0) }}
                </span>
              </div>
            </div>
            <router-link
              to="/community-home"
              class="mt-4 flex items-center justify-center gap-1 text-sm font-bold text-[#7a6856] hover:underline">
              前往社群 <ChevronRight :size="14" />
            </router-link>
          </div>

          <!-- Support & Contact -->
          <div class="rounded-3xl border-4 border-[#445944] bg-[#FCF4E5] p-5 shadow-[5px_5px_0px_#445944]">
            <h3 class="mb-4 flex items-center gap-2 font-fredoka text-lg font-black text-[#445944]">
              <HeadphonesIcon :size="18" />
              客服 &amp; 支援
            </h3>
            <div class="space-y-3">
              <router-link
                v-for="link in supportLinks"
                :key="link.label"
                :to="link.route"
                class="group flex items-center gap-3 rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] px-4 py-3 transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-[#445944]/30 hover:shadow-[2px_2px_0px_#445944]">
                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-[#445944] bg-[#FCF4E5] shadow-[2px_2px_0px_#445944] transition-all group-hover:shadow-none">
                  <component :is="link.icon" :size="16" class="text-[#445944]" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-bold text-[#445944]">{{ link.label }}</div>
                  <div class="truncate text-xs text-[#445944]">{{ link.desc }}</div>
                </div>
                <ChevronRight :size="14" class="shrink-0 text-gray-400 transition-transform group-hover:translate-x-1" />
              </router-link>
            </div>
          </div>

          <!-- Account Settings -->
          <div class="rounded-3xl border-4 border-[#7a6856] bg-[#FCF4E5] p-5 shadow-[4px_4px_0px_#7a6856]">
            <h3 class="mb-4 flex items-center gap-2 font-fredoka text-lg font-black text-[#7a6856]">
              <Settings :size="18" />
              帳號設定
            </h3>
            <div class="space-y-2">
              <button
                @click="startEdit"
                class="group flex w-full items-center gap-3 rounded-2xl border-2 border-[#7a6856] bg-[#FCF4E5] px-4 py-3 text-left transition-all hover:bg-[#7a6856]/30">
                <Edit3 :size="15" class="text-[#7a6856]" />
                <span class="text-sm font-bold text-[#7a6856]">編輯個人資料</span>
                <ChevronRight :size="14" class="ml-auto text-[#7a6856] transition-transform group-hover:translate-x-1" />
              </button>
              <button
                class="group flex w-full items-center gap-3 rounded-2xl border-2 border-[#7a6856] bg-[#FCF4E5] px-4 py-3 text-left transition-all hover:bg-[#7a6856]/30">
                <Bell :size="15" class="text-[#7a6856]" />
                <span class="text-sm font-bold text-[#7a6856]">通知設定</span>
                <ChevronRight :size="14" class="ml-auto text-[#7a6856] transition-transform group-hover:translate-x-1" />
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
    <Transition name="modal">
      <div
        v-if="isEditingProfile"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        @click.self="isEditingProfile = false">
        <div class="w-full max-w-lg rounded-3xl border-4 border-[#445944] bg-[#FCF4E5] p-8 shadow-[8px_8px_0px_#445944]">
          <div class="mb-6 flex items-center justify-between">
            <h2 class="font-fredoka text-2xl font-black text-[#445944]">編輯個人資料</h2>
            <button
              @click="isEditingProfile = false"
              class="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-[#445944] bg-white shadow-[2px_2px_0px_#445944] hover:bg-red-50">
              ✕
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <label class="mb-1.5 block text-sm font-bold text-gray-700">姓名 / 暱稱</label>
              <input
                v-model="editForm.name"
                type="text"
                placeholder="請輸入姓名"
                class="w-full rounded-2xl border-2 border-gray-700 bg-white px-4 py-3 text-sm font-bold focus:border-[#445944] focus:outline-none focus:ring-2 focus:ring-[#445944]/20" />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-bold text-gray-700">電子郵件</label>
              <input
                v-model="editForm.email"
                type="email"
                placeholder="請輸入電子郵件"
                class="w-full rounded-2xl border-2 border-gray-700 bg-white px-4 py-3 text-sm font-bold focus:border-[#445944] focus:outline-none focus:ring-2 focus:ring-[#445944]/20" />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-bold text-gray-700">電話</label>
              <input
                v-model="editForm.phone"
                type="tel"
                placeholder="請輸入電話號碼"
                class="w-full rounded-2xl border-2 border-gray-700 bg-white px-4 py-3 text-sm font-bold focus:border-[#445944] focus:outline-none focus:ring-2 focus:ring-[#445944]/20" />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-bold text-gray-700">個人簡介</label>
              <textarea
                v-model="editForm.bio"
                rows="3"
                placeholder="介紹一下自己和你的毛孩..."
                class="w-full rounded-2xl border-2 border-gray-700 bg-white px-4 py-3 text-sm font-bold focus:border-[#445944] focus:outline-none focus:ring-2 focus:ring-[#445944]/20 resize-none" />
            </div>

            <div class="flex gap-3 pt-2">
              <button
                @click="saveProfile"
                class="flex-1 rounded-2xl border-2 border-[#445944] bg-[#445944] py-3 text-sm font-bold text-white transition-all hover:translate-x-[2px] hover:translate-y-[2px]">
                <CheckCircle class="inline mr-1.5" :size="16" />
                儲存變更
              </button>
              <button
                @click="isEditingProfile = false"
                class="flex-1 rounded-2xl border-2 border-[#445944] bg-white py-3 text-sm font-bold text-[#445944] transition-all hover:translate-x-[2px] hover:translate-y-[2px]">
                取消
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

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
