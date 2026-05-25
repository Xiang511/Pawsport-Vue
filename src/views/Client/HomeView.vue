<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Dog,
  Heart,
  Award,
  ArrowRight,
  CheckCircle,
  Plus,
  Star,
  Sparkles,
  MessageCircle,
  AlertTriangle,
  ChevronRight,
  Activity,
  Calendar,
  ShieldCheck,
  MapPin,
  Clock,
  Eye,
  ThumbsUp,
  UserCheck,
} from 'lucide-vue-next'
import axios from 'axios'

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/effect-fade'

const router = useRouter()

// 1. Loading & State Management
const isAdoptionLoading = ref(false)
const adoptionPets = ref([])
const missingPets = ref([])

// 2. Banner Images (from local /public/images/carousel/)
const carouselImages = ref([
  {
    url: '/images/carousel/carousel-01.png',
    title: '開啟幸福的 Pawsport 護照',
    sub: '守護每一隻毛孩的健康成長與快樂時光',
  },
  {
    url: '/images/carousel/carousel-02.png',
    title: '給牠一個溫暖的避風港',
    sub: '我們幫你一起養！領養狗狗享有專屬津貼',
  },
  {
    url: '/images/carousel/carousel-03.png',
    title: '不離不棄，尋回失落的家人',
    sub: '遺失協尋互助網，第一時間提供定位與特徵通知',
  },
  {
    url: '/images/carousel/carousel-04.png',
    title: '趣味問答挑戰，邊玩邊學',
    sub: '累積毛幣為愛寵換取超萌專屬造型與紀念品',
  },
])

// 3. Fallback Data (Adoption, Missing, Success, Articles)
const mockAdoptionPets = [
  {
    id: 1,
    name: '比魯 (Beelu)',
    breed: '米克斯',
    gender: 'male',
    age: 2,
    weight: 12.5,
    nickname: '暖男代表',
    imageUrl:
      'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 2,
    name: '拿鐵 (Latte)',
    breed: '黃金獵犬',
    gender: 'female',
    age: 1,
    weight: 22.0,
    nickname: '超親人天使',
    imageUrl:
      'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 3,
    name: '波比 (Bobby)',
    breed: '柯基',
    gender: 'male',
    age: 3,
    weight: 11.2,
    nickname: '短腿小萌神',
    imageUrl:
      'https://images.unsplash.com/photo-1612536057832-2ff7ead58194?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 4,
    name: '雪莉 (Sherry)',
    breed: '薩摩耶',
    gender: 'female',
    age: 2,
    weight: 24.5,
    nickname: '微笑天使',
    imageUrl:
      'https://images.unsplash.com/photo-1529429617124-95b109e86bb8?auto=format&fit=crop&q=80&w=400',
  },
]

const mockMissingPets = [
  {
    id: 1,
    breed: '柴犬 (多比)',
    gender: '公',
    city: '嘉義市',
    district: '東區',
    lostTime: '2026-05-20',
    lostPlace: '嘉義市東區中山路靠近圓環',
    feature: '身上穿著藍色胸背帶，對陌生人有點害羞，尾巴末端有一點勾勾。',
    photo:
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: 2,
    breed: '米克斯三花貓 (咪咪)',
    gender: '母',
    city: '台北市',
    district: '大安區',
    lostTime: '2026-05-24',
    lostPlace: '台北市大安區敦化南路二段',
    feature: '左耳已剪耳，親人可抱，叫名字會有反應，肚子微垂。',
    photo:
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=300',
  },
]

const mockSuccessStories = [
  {
    id: 1,
    familyPhoto: '/images/cards/card-01.jpg',
    petPhoto:
      'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&q=80&w=300',
    title: '尋回失落的陽光',
    petName: 'Cookie',
    ownerName: '陳先生一家',
    quote:
      '「自從在 Petmily 領養了 Cookie，原本安靜的屋子裡每天都充滿了笑聲。牠不僅融入了我們的家庭，更治癒了我們每個人的心靈。」',
  },
  {
    id: 2,
    familyPhoto: '/images/cards/card-02.jpg',
    petPhoto:
      'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=300',
    title: '健康護照讓我們不再手忙腳亂',
    petName: 'MiuMiu',
    ownerName: '林小姐',
    quote:
      '「過去我總是忘記帶貓咪打疫苗的日期，現在透過 Pawsport 的追蹤功能與提醒，MiuMiu 的體重和醫療紀錄一目了然，真的太省心了！」',
  },
  {
    id: 3,
    familyPhoto: '/images/cards/card-03.jpg',
    petPhoto:
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=300',
    title: '一小時內尋回摯愛',
    petName: '比爾 (Bill)',
    ownerName: '張小姐',
    quote:
      '「比爾不小心溜出門時，我差點崩潰。幸好立刻在 Petmily 發布遺失啟事，附近的鄰居收到推播提醒，不到一小時就幫我找到了牠！」',
  },
]

const mockArticles = [
  {
    id: 2,
    categoryname: '寵物知識',
    title: '柴犬個性分析—其實原本是狼!?',
    summary:
      '很多人說柴犬很固執、愛唱反調，其實牠們保留了非常多遠古狼隻的基因特質，究竟要如何跟這位「固執的小狼」和平共處呢？',
    author: '柴大師',
    date: '2026-05-10',
    views: 1840,
    likes: 428,
    image:
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: 3,
    categoryname: '專業科普',
    title: '犬貓鮮食調配黃金比例大公開！',
    summary:
      '市面上鮮食包種類如此多，究竟該如何自製？本文特別訪問寵物營養師，揭露肉類、蔬菜、油脂與微量元素的黃金比例。',
    author: '鮮味小姐',
    date: '2026-04-22',
    views: 3120,
    likes: 912,
    image:
      'https://images.unsplash.com/photo-1608408891486-f5cade977d19?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: 4,
    categoryname: '寵物星座',
    title: '十二星座毛孩相處指南與指南圖鑑',
    summary:
      '不只是人類，其實動物們也受到星盤的神秘影響！金牛座毛孩究竟有多愛吃？雙子座貓咪有多調皮？一次帶您深入了解！',
    author: '寵物占星師',
    date: '2026-05-18',
    views: 1250,
    likes: 318,
    image:
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=300',
  },
]

// 4. Vaccine Toggle Logic
const vaccines = ref([
  { id: 1, name: '狂犬病疫苗', status: true },
  { id: 2, name: '貓狗核心疫苗 (DHPP/五合一)', status: true },
  { id: 3, name: '心絲蟲預防藥投藥', status: false },
  { id: 4, name: '體外寄生蟲驅蟲', status: false },
])

const toggleVaccine = (index) => {
  vaccines.value[index].status = !vaccines.value[index].status
}

// 5. Trivia Quiz State
const quizScore = ref(0)
const quizState = ref('pending') // pending, answered
const selectedOption = ref(null)
const quizQuestion = {
  question: '巧克力與葡萄乾對貓狗有致命危險，這是因為什麼？',
  options: [
    { text: '巧克力含可可鹼易致中毒，葡萄乾會引發急性腎衰竭', isCorrect: true },
    { text: '主要是太甜導致牙齒蛀牙，以及糖分過高變胖', isCorrect: false },
    { text: '因為可可粉會黏住喉嚨，葡萄乾會卡在氣管堵塞', isCorrect: false },
  ],
  explanation:
    '可可鹼在貓狗體內代謝極慢，會損害中樞神經系統與心肌；而葡萄與葡萄乾即使是極小計量也可能引發嚴重的急性腎衰竭，絕對不可餵食！',
}

const handleAnswer = (index) => {
  if (quizState.value !== 'pending') return
  selectedOption.value = index
  quizState.value = 'answered'
  if (quizQuestion.options[index].isCorrect) {
    quizScore.value += 10
  }
}

const resetQuiz = () => {
  quizState.value = 'pending'
  selectedOption.value = null
}

// 6. API Integrations with fallback
const getAdoptionPets = async () => {
  try {
    isAdoptionLoading.value = true
    const response = await axios.get('https://localhost:7048/api/users/pet/adoption')
    const { success, data } = response.data
    if (success && data && data.length > 0) {
      adoptionPets.value = data.slice(0, 4).map((pet) => {
        let age = pet.age || 0
        if (pet.birthDate) {
          const birth = new Date(pet.birthDate)
          const today = new Date()
          age = today.getFullYear() - birth.getFullYear()
        }
        let weight = pet.size === 1 ? 5 : pet.size === 2 ? 15 : 30
        return {
          id: pet.petId,
          name: pet.name,
          imageUrl: pet.photo || 'https://placehold.co/400x400?text=Petmily',
          nickname: pet.note || '精選毛孩',
          gender: pet.gender === 1 ? 'male' : 'female',
          age,
          breed: pet.coatColor || '米克斯',
          weight,
        }
      })
    } else {
      adoptionPets.value = mockAdoptionPets
    }
  } catch (error) {
    console.warn('API連線失敗，自動載入 Mock 領養數據:', error)
    adoptionPets.value = mockAdoptionPets
  } finally {
    isAdoptionLoading.value = false
  }
}

onMounted(() => {
  getAdoptionPets()
  // Mock missing reports
  missingPets.value = mockMissingPets
})
</script>

<template>
  <div class="page-container min-h-screen bg-[#FDF9F3] text-gray-800 antialiased">
    <!-- HERO SECTION -->
    <header
      class="hero-container relative overflow-hidden bg-[#FCF4E5] pt-8 pb-16 lg:py-24">
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
              <!-- <ArrowRight :size="18" class="transition-transform group-hover:translate-x-1" /> -->
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
            <!-- Decorative badge -->
            <!-- <div class="absolute -top-6 -right-6 bg-[#f2d44d] border-2 border-black text-black font-black px-4 py-2 rounded-xl rotate-12 z-20 shadow-md flex items-center gap-1 font-fredoka text-sm">
              <Award :size="16" />
              PETMILY APP
            </div> -->

            <!-- Swiper Slider -->
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

            <!-- Custom Pagination -->
            <div class="custom-hero-pagination mt-4 flex justify-center gap-2"></div>
          </div>
        </div>
      </div>
    </header>

    <!-- CORE FEATURES SECTION -->
    <section class=" bg-[#FCF4E5] py-20">
      <div class="mx-auto w-[90%] max-w-7xl">
        <div class="mx-auto mb-16 max-w-2xl text-center">
          <h2 class="mb-4 text-3xl font-black text-[#445944] md:text-4xl">
            全方位守護毛孩的每一階段
          </h2>
          <p class="text-gray-600">
            不論是尋找新家人、記錄日常健康、急尋走失毛孩，或是獲取養寵物小知識，我們全天候都在。
          </p>
        </div>

        <div class="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <!-- CARD 1: 領養狗狗 -->
          <div
            class="card-feature group rounded-3xl border-4 border-[#445944] bg-white p-6 shadow-[6px_6px_0px_#445944] transition-all hover:-translate-y-1 hover:shadow-[10px_10px_0px_#445944] md:p-8">
            <div class="mb-6 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] p-3 text-[#445944]">
                  <Dog :size="28" />
                </div>
                <div>
                  <h3 class="text-2xl font-extrabold text-[#445944]">領養狗狗</h3>
                  <p class="text-xs text-gray-500">尋找命定毛孩夥伴</p>
                </div>
              </div>
              <router-link
                to="/adopt"
                class="flex items-center gap-1 text-sm font-bold text-[#445944] hover:underline">
                查看全部
                <ChevronRight :size="16" />
              </router-link>
            </div>

            <!-- Mini pet list inside the card -->
            <div class="mb-6 grid grid-cols-2 gap-4">
              <div
                v-for="pet in adoptionPets.slice(0, 2)"
                :key="pet.id"
                class="sub-pet-card overflow-hidden rounded-2xl border-2 border-[#445944] bg-[#FDF9F3] transition-transform hover:scale-[1.02]">
                <div class="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  <img :src="pet.imageUrl" :alt="pet.name" class="h-full w-full object-cover" />
                  <span
                    class="absolute top-2 left-2 rounded-full bg-[#9C6D6D] px-2 py-0.5 text-[10px] font-bold text-white">
                    {{ pet.nickname }}
                  </span>
                </div>
                <div class="p-3 bg-[#FCF4E5]">
                  <div class="mb-1 flex items-center justify-between">
                    <h4 class="truncate text-base font-bold">{{ pet.name }}</h4>
                    <!-- Custom Inline SVG for Gender -->
                    <span
                      v-if="pet.gender === 'male'"
                      class="ml-1 inline-flex shrink-0 text-[#3b82f6]"
                      title="男生">
                      <svg
                        class="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2.5">
                        <circle cx="10" cy="14" r="5" />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M14 10l6-6M15 4h5v5" />
                      </svg>
                    </span>
                    <span v-else class="ml-1 inline-flex shrink-0 text-[#ec4899]" title="女生">
                      <svg
                        class="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2.5">
                        <circle cx="12" cy="9" r="5" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 14v7M9 18h6" />
                      </svg>
                    </span>
                  </div>
                  <p class="truncate text-xs text-gray-500">{{ pet.breed }} • {{ pet.age }} 歲</p>
                </div>
              </div>
            </div>

            <!-- CTA inside feature card -->
            <div class="flex gap-3">
              <router-link
                to="/adopt"
                class="flex-1 rounded-xl border-2 border-[#445944] bg-[#445944] py-3 text-center text-theme-lg font-bold text-white transition-all hover:translate-x-[1px] hover:translate-y-[1px]">
                🐾 給牠一個溫暖的家
              </router-link>
              <router-link
                to="/adopt/create"
                class="rounded-xl border-2 border-[#445944] bg-[#FCF4E5] px-4 py-3 text-center text-theme-lg font-bold text-[#445944] transition-all hover:translate-x-[1px] hover:translate-y-[1px]">
                刊登送養
              </router-link>
            </div>
          </div>

          <!-- CARD 2: 健康護照 (Pawsport) -->
          <div
            class="card-feature group rounded-3xl border-4 border-brand-success-950 bg-white p-6 shadow-[6px_6px_0px_#445944] transition-all hover:-translate-y-1 hover:shadow-[10px_10px_0px_#445944] md:p-8">
            <div class="mb-6 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div
                  class="text-brand-success-950 rounded-2xl border-2 border-brand-success-950 bg-[#FCF4E5] p-3">
                  <Activity :size="28" />
                </div>
                <div>
                  <h3 class="text-2xl font-extrabold text-[#445944]">健康護照</h3>
                  <p class="text-xs text-gray-500">科學化記錄愛寵健康成長</p>
                </div>
              </div>
              <router-link
                to="/healthpassport"
                class="flex items-center gap-1 text-sm font-bold text-[#445944] hover:underline">
                開啟護照
                <ChevronRight :size="16" />
              </router-link>
            </div>

            <!-- Inside Pawsport Card: Weight Tracker Chart Simulator & Vaccines -->
            <div class="mb-6 rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] p-4">
              <div class="mb-3 flex items-center justify-between">
                <span class="text-xs font-black text-gray-500">愛寵體重追蹤曲線 (kg)</span>
                <span
                  class="rounded-full bg-brand-success-500 px-2 py-0.5 text-[10px] font-bold text-white">
                  狀態良好
                </span>
              </div>
              <!-- Custom SVG weight sparkline -->
              <div
                class="relative flex h-24 w-full items-end overflow-hidden rounded-xl border border-gray-200 bg-white p-2">
                <svg viewBox="0 0 300 80" class="h-full w-full">
                  <defs>
                    <linearGradient id="gradientWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#83aeba" stop-opacity="0.4" />
                      <stop offset="100%" stop-color="#83aeba" stop-opacity="0.0" />
                    </linearGradient>
                  </defs>
                  <!-- Background grid -->
                  <line x1="0" y1="20" x2="300" y2="20" stroke="#f1f1f1" stroke-dasharray="3,3" />
                  <line x1="0" y1="40" x2="300" y2="40" stroke="#f1f1f1" stroke-dasharray="3,3" />
                  <line x1="0" y1="60" x2="300" y2="60" stroke="#f1f1f1" stroke-dasharray="3,3" />
                  <!-- Area -->
                  <path
                    d="M 10 70 L 10 50 Q 80 35 150 42 T 290 20 L 290 70 Z"
                    fill="url(#gradientWeight)" />
                  <!-- Line -->
                  <path
                    d="M 10 50 Q 80 35 150 42 T 290 20"
                    fill="none"
                    stroke="#83aeba"
                    stroke-width="3" />
                  <!-- Circles & labels -->
                  <circle cx="10" cy="50" r="4" fill="#4f6970" />
                  <circle cx="80" cy="41" r="4" fill="#4f6970" />
                  <circle cx="150" cy="42" r="4" fill="#4f6970" />
                  <circle cx="220" cy="27" r="4" fill="#4f6970" />
                  <circle cx="290" cy="20" r="5" fill="#9C6D6D" stroke="white" stroke-width="2" />
                  <!-- Text values -->
                  <text x="8" y="40" font-size="8" font-weight="bold">8.2</text>
                  <text x="145" y="32" font-size="8" font-weight="bold">8.9</text>
                  <text x="282" y="12" font-size="8" font-weight="bold" fill="#9C6D6D">9.5 kg</text>
                </svg>
              </div>

              <!-- Inline Vaccines checklist -->
              <div class="mt-4 grid grid-cols-2 gap-2">
                <div
                  v-for="(v, index) in vaccines"
                  :key="v.id"
                  @click="toggleVaccine(index)"
                  class="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white p-2 transition-colors select-none hover:bg-gray-50">
                  <div
                    class="flex h-5 w-5 items-center justify-center rounded-full border-2 border-black"
                    :class="v.status ? 'bg-[#83aeba] text-white' : 'bg-white'">
                    <CheckCircle v-if="v.status" :size="12" />
                  </div>
                  <span class="truncate text-[11px] font-bold text-gray-700">{{ v.name }}</span>
                </div>
              </div>
            </div>

            <router-link
              to="/healthpassport"
              class="block w-full rounded-xl border-2 border-[#445944] bg-[#445944] py-3 text-center text-theme-lg font-bold text-white transition-all hover:translate-x-[1px] hover:translate-y-[1px]">
              📊 開啟專屬健康檔案
            </router-link>
          </div>

          <!-- CARD 3: 遺失協尋 (Missing Report) -->
          <div
            class="card-feature group rounded-3xl border-4 border-brand-success-950 bg-white p-6 shadow-[6px_6px_0px_#445944] transition-all hover:-translate-y-1 hover:shadow-[10px_10px_0px_#445944] md:p-8">
            <div class="mb-6 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div
                  class="animate-pulse-slow rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] p-3 text-[#445944]">
                  <AlertTriangle :size="28" />
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h3 class="text-2xl font-extrabold text-[#445944]">遺失協尋</h3>
                    <span
                      class="inline-flex h-2.5 w-2.5 animate-ping rounded-full bg-red-600"></span>
                  </div>
                  <p class="text-xs text-gray-500">守護防線，帶迷路寶貝回家</p>
                </div>
              </div>
              <router-link
                to="/missingreport"
                class="flex items-center gap-1 text-sm font-bold text-[#445944] hover:underline">
                查看協尋
                <ChevronRight :size="16" />
              </router-link>
            </div>

            <!-- Rolling Missing Pets List -->
            <div class="mb-6 space-y-4">
              <div
                v-for="pet in missingPets"
                :key="pet.id"
                class="relative flex items-center gap-4 rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] p-3">
                <div class="h-22 w-22 shrink-0 overflow-hidden rounded-xl border-2 border-[#445944]">
                  <img :src="pet.photo" :alt="pet.breed" class="h-full w-full object-cover" />
                </div>
                <div class="min-w-0 flex-1">
                  <div class="flex items-center justify-between">
                    <span
                      class="rounded border border-red-300 bg-red-100 px-2 py-0.5 text-xs font-black text-red-600">
                      緊急協尋中
                    </span>
                    <span class="flex items-center gap-0.5 text-[10px] text-gray-400">
                      <Clock :size="10" />
                      {{ pet.lostTime }}
                    </span>
                  </div>
                  <h4 class="mt-1 truncate text-sm font-bold text-[#445944]">
                    {{ pet.breed }} ({{ pet.gender }})
                  </h4>
                  <p class="flex items-center gap-0.5 truncate text-[11px] text-gray-500">
                    <MapPin :size="10" />
                    {{ pet.lostPlace }}
                  </p>
                </div>
              </div>
            </div>

            <div class="flex gap-3">
              <router-link
                to="/missingreport"
                class="flex-1 rounded-xl bg-[#445944] py-3 text-center text-theme-lg font-bold text-white transition-all hover:translate-x-[1px] hover:translate-y-[1px]">
                🚨 我有協尋線索
              </router-link>
              <router-link
                to="/missingreport/create"
                class="rounded-xl border-2 border-[#445944] bg-[#FCF4E5] px-4 py-3 text-center text-theme-lg font-bold text-[#445944] transition-all hover:translate-x-[1px] hover:translate-y-[1px]">
                刊登協尋啟事
              </router-link>
            </div>
          </div>

          <!-- CARD 4: 知識問答挑戰 (Trivia Quiz) -->
          <div
            class="card-feature group rounded-3xl border-4 border-[#445944] bg-white p-6 shadow-[6px_6px_0px_#445944] transition-all hover:-translate-y-1 hover:shadow-[10px_10px_0px_#445944] md:p-8">
            <div class="mb-6 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div
                  class="text-[#445944] rounded-2xl border-2 border-[#445944] bg-[#f2d44d]/15 p-3">
                  <Award :size="28" />
                </div>
                <div>
                  <h3 class="text-2xl font-extrabold text-[#445944]">知識問答</h3>
                  <p class="text-xs text-gray-500">解鎖養寵知識與毛幣造型</p>
                </div>
              </div>
              <router-link
                to="/game"
                class="text-brand-success-900 flex items-center gap-1 text-sm font-bold hover:underline">
                進入遊戲
                <ChevronRight :size="16" />
              </router-link>
            </div>

            <!-- Quiz preview interactive box -->
            <div class="mb-6 rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] p-4">
              <div class="mb-3 flex items-center justify-between">
                <span
                  class="rounded-full bg-[#FAE4AE] px-2 py-0.5 text-xs font-bold text-amber-800">
                  每日知識一題
                </span>
                <span class="font-fredoka flex items-center gap-1 text-xs font-bold text-amber-700">
                  <Star :size="12" fill="currentColor" />
                  首頁積分: {{ quizScore }}
                </span>
              </div>
              <h4 class="mb-4 text-sm leading-relaxed font-extrabold text-gray-800">
                {{ quizQuestion.question }}
              </h4>

              <div class="space-y-2">
                <button
                  v-for="(opt, idx) in quizQuestion.options"
                  :key="idx"
                  @click="handleAnswer(idx)"
                  :disabled="quizState === 'answered'"
                  class="flex w-full items-center justify-between rounded-xl border-2 p-3 text-left text-xs font-semibold transition-all"
                  :class="[
                    quizState === 'pending'
                      ? 'border-gray-200 bg-white hover:border-black hover:bg-gray-50'
                      : opt.isCorrect
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                        : selectedOption === idx
                          ? 'border-red-500 bg-red-50 text-red-800'
                          : 'border-gray-200 bg-white opacity-60',
                  ]">
                  <span>{{ opt.text }}</span>
                  <component
                    v-if="quizState === 'answered' && opt.isCorrect"
                    :is="CheckCircle"
                    :size="14"
                    class="ml-2 shrink-0 text-emerald-600" />
                </button>
              </div>

              <!-- Answer Feedback & Explanation -->
              <div
                v-if="quizState === 'answered'"
                class="mt-4 rounded-xl border border-dashed border-gray-300 bg-white p-3">
                <div class="mb-1 flex items-center gap-1">
                  <Sparkles :size="14" class="animate-bounce text-amber-500" />
                  <span class="text-xs font-black text-gray-700">
                    {{
                      quizQuestion.options[selectedOption].isCorrect
                        ? '答對了！恭喜獲得 10 積分 🎉'
                        : '答錯了，再接再厲！'
                    }}
                  </span>
                </div>
                <p class="text-[11px] leading-relaxed text-gray-500">
                  {{ quizQuestion.explanation }}
                </p>
                <button
                  @click="resetQuiz"
                  class="mt-2 text-[10px] font-bold text-[#445944] underline hover:text-black">
                  再試一次
                </button>
              </div>
            </div>

            <router-link
              to="/game"
              class="block w-full rounded-xl bg-[#445944] py-3 text-center text-theme-lg font-bold text-white transition-all hover:translate-x-[1px] hover:translate-y-[1px]">
              🎮 開始寵物問答挑戰
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- SUCCESS STORIES SECTION -->
    <section class=" bg-[#FCF4E5] py-20">
      <div class="mx-auto w-[90%] max-w-7xl">
        <div class="mx-auto mb-16 max-w-2xl text-center">
          <span
            class="mb-3 inline-block rounded-full bg-[#7a6856] px-3 py-1 text-xs font-extrabold tracking-wider text-white">
            HAPPY ADOPTION STORIES
          </span>
          <h2 class="mb-4 text-3xl font-black text-[#445944] md:text-4xl">幸福見證，溫馨相遇</h2>
          <p class="text-gray-600">
            每一個毛孩都是不可多得的禮物，聽聽牠們找到新家後的幸福故事與感人分享。
          </p>
        </div>

        <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div
            v-for="story in mockSuccessStories"
            :key="story.id"
            class="story-card overflow-hidden rounded-3xl border-4 border-[#7a6856] bg-white shadow-[4px_4px_0px_#7a6856] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_#7a6856]">
            <!-- Hero Top Overlay Image -->
            <div class="relative h-48 overflow-hidden border-b-2 border-[#7a6856] bg-gray-50">
              <img :src="story.familyPhoto" :alt="story.title" class="h-full w-full object-cover" />
              <!-- Small pet inset avatar -->
              <div
                class="absolute right-3 bottom-3 h-16 w-16 overflow-hidden rounded-full border-2 border-[#7a6856] shadow-md">
                <img
                  :src="story.petPhoto"
                  :alt="story.petName"
                  class="h-full w-full object-cover" />
              </div>
            </div>

            <!-- Content -->
            <div class="p-6">
              <div class="mb-3 flex items-center gap-2">
                <span class="rounded bg-[#445944]/10 px-2 py-1 text-xs font-bold text-[#445944]">
                  領養家庭: {{ story.ownerName }}
                </span>
                <span class="rounded bg-[#9C6D6D]/10 px-2 py-1 text-xs font-bold text-[#9C6D6D]">
                  {{ story.petName }}
                </span>
              </div>
              <h3 class="mb-3 text-lg font-black text-[#7a6856]">{{ story.title }}</h3>
              <p class="text-xs leading-relaxed font-medium text-gray-600 italic md:text-sm">
                {{ story.quote }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- COMMUNITY SPOTLIGHTS SECTION -->
    <section class="bg-[#FCF4E5] py-20">
      <div class="mx-auto w-[90%] max-w-7xl">
        <div class="mb-12 flex flex-col justify-between md:flex-row md:items-end">
          <div>
            <span
              class="mb-3 inline-block rounded-full bg-[#7a6856] px-3 py-1 text-xs font-extrabold tracking-wider text-[#FCF4E5]">
              COMMUNITY TOPICS
            </span>
            <h2 class="text-3xl font-black text-[#445944] md:text-4xl">社群熱門話題 & 交流</h2>
          </div>
          <router-link
            to="/community-home"
            class="mt-4 flex items-center gap-1 text-sm font-bold text-[#7a6856] hover:underline md:mt-0">
            前往社群專區
            <ChevronRight :size="16" />
          </router-link>
        </div>

        <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div
            v-for="article in mockArticles"
            :key="article.id"
            @click="router.push({ name: 'article-detail' })"
            class="group cursor-pointer overflow-hidden rounded-2xl border-2 border-[#445944] bg-white shadow-[4px_4px_0px_#445944] transition-shadow hover:border-[#7a6856] hover:shadow-[#7a6856]">
            <div class="relative h-44 overflow-hidden bg-gray-100">
              <span
                class="absolute top-3 left-3 z-10 rounded-full border border-[#445944] bg-[#FCF4E5] px-2.5 py-1 text-[10px] font-bold text-[#445944]">
                {{ article.categoryname }}
              </span>
              <img
                :src="article.image"
                :alt="article.title"
                class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
            </div>
            <div class="p-5">
              <h3
                class="mb-2 line-clamp-1 text-base font-extrabold text-[#445944] transition-colors group-hover:text-[#7a6856] md:text-lg">
                {{ article.title }}
              </h3>
              <p class="mb-4 line-clamp-2 text-xs leading-relaxed text-gray-500">
                {{ article.summary }}
              </p>

              <!-- Footer values -->
              <div class="flex items-center justify-between border-t border-gray-100 pt-3">
                <div class="flex items-center gap-2">
                  <div
                    class="flex h-6 w-6 items-center justify-center rounded-full border border-[#445944] bg-[#FAE4AE] text-[10px] font-bold">
                    {{ article.author[0] }}
                  </div>
                  <span class="text-xs font-bold text-[#445944]">{{ article.author }}</span>
                </div>
                <div class="flex items-center gap-3 text-gray-400">
                  <span class="flex items-center gap-0.5 text-[10px]">
                    <Eye :size="11" />
                    {{ article.views }}
                  </span>
                  <span class="flex items-center gap-0.5 text-[10px]">
                    <ThumbsUp :size="11" />
                    {{ article.likes }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- NEWSLETTER / BOTTOM CTA SECTION -->
    <section class="relative overflow-hidden bg-[#445944] py-16 text-white">
      <!-- Background SVG footprints -->
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
  </div>
</template>

<style scoped>
/* Import playful fonts */
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&family=Quicksand:wght@300..700&display=swap');

.font-fredoka {
  font-family: 'Fredoka', 'GenJyuu', sans-serif;
}

.font-quicksand {
  font-family: 'Quicksand', 'GenJyuu', sans-serif;
}

/* Custom Swiper pagination styling overrides */
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
  /* border: 1px solid black; */
}

:deep(.custom-hero-pagination .swiper-pagination-bullet-active) {
  background-color: #445944;
  width: 24px;
}

/* Animations */
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

.animate-pulse-slow {
  animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse-slow {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.9;
    transform: scale(0.98);
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

/* Custom cards hover effects */
.card-feature,
.story-card {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.sub-pet-card {
  transition:
    transform 0.2s ease,
    border-color 0.2s ease;
}

.sub-pet-card:hover {
  border-color: #445944;
}
</style>
