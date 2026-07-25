<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import request from '@/api/axios'
import { Dog, Sparkles } from 'lucide-vue-next'

// 路由控制
const route = useRoute()
const router = useRouter()

// 狀態定義
const loading = ref(true)
const pet = ref(null)
const errorMsg = ref('')
const showContactModal = ref(false)

// 模擬送養人資訊 (可擴充)
const contactInfo = ref({
  name: '張秉淳 (會員)',
  phone: '0932789111',
  method: '可撥打電話及簡訊聯絡',
  lineId: 'petmily_love',
  county: '台北市',
  district: '大安區',
})

// 載入寵物詳細資料 (透過獲取列表篩選指定 ID)
const fetchPetDetail = async () => {
  try {
    loading.value = true
    const response = await request.get('https://localhost:7048/api/users/pet/adoption')
    const { success, data } = response.data

    if (success && data) {
      const petId = Number(route.params.id)
      const foundPet = data.find((p) => p.petId === petId)

      if (foundPet) {
        pet.value = foundPet
      } else {
        errorMsg.value = '找不到這隻寶貝的檔案，可能已經被溫暖的家庭領養囉！'
      }
    } else {
      errorMsg.value = '無法載入寵物檔案，請稍後再試。'
    }
  } catch (error) {
    console.error('無法取得寵物詳細資料:', error)
    errorMsg.value = '連線伺服器失敗，請確認登入狀態或伺服器是否正常運作。'
  } finally {
    loading.value = false
  }
}

// 屬性計算與對應對照
const petSpecies = computed(() => {
  if (!pet.value) return '未知'
  return pet.value.species === 1 ? '狗 🐶' : pet.value.species === 2 ? '貓 🐱' : '其他'
})

const petGenderText = computed(() => {
  if (!pet.value) return '未知'
  return pet.value.gender === 1 ? '男生' : '女生'
})

const petGenderClass = computed(() => {
  if (!pet.value) return ''
  return pet.value.gender === 1
    ? 'bg-blue-50 text-blue-600 border border-blue-100'
    : 'bg-pink-50 text-pink-600 border border-pink-100'
})

const petSizeText = computed(() => {
  if (!pet.value) return '未知'
  if (pet.value.size === 1) return '小型犬'
  if (pet.value.size === 2) return '中型犬'
  if (pet.value.size === 3) return '大型犬'
  return '未知'
})

const petWeightText = computed(() => {
  if (!pet.value) return '未知'
  if (pet.value.size === 1) return '5 kg 以下'
  if (pet.value.size === 2) return '5 - 15 kg'
  if (pet.value.size === 3) return '15 - 30 kg'
  return '未知'
})

const petAgeText = computed(() => {
  if (!pet.value || !pet.value.birthDate) return '未知'
  const birth = new Date(pet.value.birthDate)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age > 0 ? `${age} 歲` : '未滿 1 歲'
})

const petDesexText = computed(() => {
  if (!pet.value) return '未知'
  return pet.value.isDesex ? '已結紮' : '未結紮'
})

const petHighMaintenanceText = computed(() => {
  if (!pet.value) return '未知'
  return pet.value.isHighMaintenance
    ? '需要特別照護 (可能有些小固執或過往醫療史)'
    : '一般照護 (適合新手爸媽)'
})

const petBehavioralTraitsArray = computed(() => {
  if (!pet.value || !pet.value.behavioralTraits) return []
  return pet.value.behavioralTraits.split(',').map((trait) => {
    const t = trait.trim().toLowerCase()
    if (t === 'kids')
      return {
        raw: 'kids',
        zh: '適合與小孩相處 👶',
        color: 'bg-teal-50 text-teal-700 border border-teal-100',
      }
    if (t === 'dogs')
      return {
        raw: 'dogs',
        zh: '適合與狗狗相處 🐕',
        color: 'bg-indigo-50 text-indigo-700 border border-indigo-100',
      }
    if (t === 'cats')
      return {
        raw: 'cats',
        zh: '適合與貓咪相處 🐈',
        color: 'bg-purple-50 text-purple-700 border border-purple-100',
      }
    return { raw: t, zh: trait.trim(), color: 'bg-gray-50 text-gray-700 border border-gray-100' }
  })
})

const formattedPublishDate = computed(() => {
  if (!pet.value || !pet.value.createdAt) return ''
  const date = new Date(pet.value.createdAt)
  return `${date.getFullYear()} 年 ${date.getMonth() + 1} 月 ${date.getDate()} 日`
})

const DEFAULT_PET_IMAGE = 'https://placehold.co/600x600?text=Petmily'

const getImageUrl = (url) => {
  if (!url) return DEFAULT_PET_IMAGE
  return url
}

const handleImageError = (e) => {
  e.target.src = DEFAULT_PET_IMAGE
}

onMounted(() => {
  fetchPetDetail()
})
</script>

<template>
  <div
    class="page-container font-fredoka min-h-screen bg-[#FCF4E5] pb-24 text-gray-800 antialiased">
    <!-- 導覽返回欄 -->
    <div class="mx-auto w-[90%] max-w-7xl px-4 pt-8">
      <button
        @click="router.push({ name: 'pet-adoption' })"
        class="group inline-flex items-center gap-2.5 rounded-2xl border-2 border-[#445944] bg-white px-5 py-2.5 text-sm font-black text-[#445944] shadow-[3px_3px_0px_#445944] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#445944]">
        <span class="transition-transform duration-200 group-hover:-translate-x-1">⬅️</span>
        <span>返回領養列表</span>
      </button>
    </div>

    <!-- 載入中狀態 with Premium Neo-Brutalist Skeleton Detailed Loader -->
    <div
      v-if="loading"
      class="mx-auto flex w-[90%] max-w-7xl animate-pulse flex-col gap-8 px-4 pt-8 lg:flex-row">
      <!-- Left skeleton aspect-square card -->
      <div class="w-full lg:w-5/12">
        <div
          class="rounded-3xl border-4 border-[#445944]/30 bg-white p-5 shadow-[6px_6px_0px_rgba(68,89,68,0.1)]">
          <div
            class="flex aspect-square w-full items-center justify-center rounded-2xl border-4 border-[#445944]/20 bg-[#FCF4E5]">
            <span class="text-5xl opacity-20">🐾</span>
          </div>
          <div class="mt-6 h-12 w-full rounded-2xl bg-[#445944]/20"></div>
        </div>
      </div>
      <!-- Right skeleton content cards -->
      <div class="w-full space-y-6 lg:w-7/12">
        <div
          class="space-y-4 rounded-3xl border-4 border-[#445944]/30 bg-white p-8 shadow-[6px_6px_0px_rgba(68,89,68,0.1)]">
          <div class="h-8 w-1/3 rounded-xl bg-[#445944]/20"></div>
          <div class="h-6 w-full rounded-lg bg-[#445944]/15"></div>
        </div>
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div
            v-for="j in 4"
            :key="j"
            class="h-24 rounded-3xl border-4 border-[#445944]/30 bg-[#FCF4E5]/20 bg-white p-4 shadow-[4px_4px_0px_rgba(68,89,68,0.1)]"></div>
        </div>
      </div>
    </div>

    <!-- 錯誤狀態 -->
    <div
      v-else-if="errorMsg"
      class="mx-auto mt-12 max-w-md rounded-3xl border-4 border-dashed border-[#445944] bg-[#FCF4E5] p-8 px-4 py-24 text-center shadow-[6px_6px_0px_#445944]">
      <div class="mb-6 text-6xl">🐾</div>
      <h3 class="mb-6 text-xl leading-relaxed font-black text-[#445944]">{{ errorMsg }}</h3>
      <button
        @click="router.push({ name: 'pet-adoption' })"
        class="inline-flex items-center gap-2 rounded-2xl border-2 border-[#445944] bg-[#445944] px-6 py-3 font-bold text-white shadow-[4px_4px_0px_#445944] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#445944]">
        看看其他毛孩
      </button>
    </div>

    <!-- 寵物詳細頁面主體 -->
    <div v-else class="mx-auto w-[90%] max-w-7xl px-4 pt-8">
      <div class="flex flex-col gap-8 lg:flex-row">
        <!-- 左側：照片呈現 -->
        <div class="w-full lg:w-5/12">
          <div
            class="sticky top-8 overflow-hidden rounded-3xl border-4 border-[#445944] bg-white shadow-[6px_6px_0px_#445944]">
            <div
              class="relative aspect-square w-full overflow-hidden border-b-4 border-[#445944] bg-gray-100">
              <img
                :src="getImageUrl(pet.photo)"
                @error="handleImageError"
                :alt="pet.name"
                class="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />

              <!-- 狀態與照護標籤懸浮 overlay -->
              <div class="absolute top-6 left-6 flex flex-col gap-2">
                <span
                  v-if="pet.isHighMaintenance"
                  class="rounded-full bg-red-500 px-4 py-1.5 text-xs font-black text-white">
                  ⚠️ 特別關注
                </span>
                <span class="rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-black text-white">
                  🐾 開放領養中
                </span>
              </div>
            </div>

            <!-- 陪伴宣言小板塊 -->
            <div class="bg-[#FCF4E5] p-6 text-center">
              <p class="text-sm font-bold text-gray-600 italic">
                「領養不只是一個決定，更是承諾給毛孩一生守護的起點。」
              </p>
            </div>
          </div>
        </div>

        <!-- 右側：寵物資料看板 -->
        <div class="w-full lg:w-7/12">
          <div class="space-y-6">
            <!-- 檔頭：暱稱、性別與標籤 -->
            <div
              class="rounded-3xl border-4 border-[#445944] bg-white p-6 shadow-[6px_6px_0px_#445944] md:p-8">
              <div class="mb-4 flex flex-wrap items-center justify-between gap-4">
                <div class="flex items-center gap-4">
                  <h1 class="text-4xl font-black tracking-tight text-[#445944]">{{ pet.name }}</h1>
                  <span
                    :class="
                      pet.gender === 1
                        ? 'border-blue-400 bg-blue-100 text-blue-800'
                        : 'border-pink-400 bg-pink-100 text-pink-800'
                    "
                    class="flex h-9 items-center gap-1 rounded-full border-2 px-4 text-sm font-black shadow-sm">
                    {{ petGenderText }} {{ pet.gender === 1 ? '♂' : '♀' }}
                  </span>
                </div>

                <!-- 標註送養地 (簡化呈現) -->
                <div
                  class="flex items-center gap-1.5 rounded-full border-2 border-[#445944] bg-[#FCF4E5] px-3 py-1 text-sm font-black text-gray-600 shadow-[2px_2px_0px_#445944]">
                  <span>📍</span>
                  <span>{{ contactInfo.county }} • {{ contactInfo.district }}</span>
                </div>
              </div>

              <!-- 簡短副標誌 -->
              <p class="text-sm leading-relaxed font-bold text-gray-500 md:text-base">
                {{ pet.note ? pet.note.split('\n')[0] : '一個期待擁有溫暖港灣的毛寶貝。' }}
              </p>
            </div>

            <!-- 基本資料網格 -->
            <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <!-- 種類 -->
              <div
                class="rounded-3xl border-4 border-[#445944] bg-white p-4 text-center shadow-[4px_4px_0px_#445944]">
                <span class="mb-1.5 block text-xs font-black text-gray-400">種類</span>
                <span
                  class="rounded-lg border border-gray-300 bg-[#FCF4E5] px-2 py-0.5 text-base font-black text-[#445944]">
                  {{ petSpecies }}
                </span>
              </div>
              <!-- 年齡 -->
              <div
                class="rounded-3xl border-4 border-[#445944] bg-white p-4 text-center shadow-[4px_4px_0px_#445944]">
                <span class="mb-1.5 block text-xs font-black text-gray-400">年齡</span>
                <span
                  class="rounded-lg border border-gray-300 bg-[#FCF4E5] px-2 py-0.5 text-base font-black text-[#445944]">
                  {{ petAgeText }}
                </span>
              </div>
              <!-- 毛色 -->
              <div
                class="rounded-3xl border-4 border-[#445944] bg-white p-4 text-center shadow-[4px_4px_0px_#445944]">
                <span class="mb-1.5 block text-xs font-black text-gray-400">毛色</span>
                <span
                  class="rounded-lg border border-gray-300 bg-[#FCF4E5] px-2 py-0.5 text-base font-black text-[#445944]">
                  {{ pet.coatColor || '未註記' }}
                </span>
              </div>
              <!-- 體型 -->
              <div
                class="flex flex-col justify-between rounded-3xl border-4 border-[#445944] bg-white p-4 text-center shadow-[4px_4px_0px_#445944]">
                <span class="mb-1 block text-xs font-black text-gray-400">體型 / 預估體重</span>
                <span
                  class="mb-1 block rounded-lg border border-gray-300 bg-[#FCF4E5] py-0.5 text-sm font-black text-[#445944]">
                  {{ petSizeText }}
                </span>
                <span class="text-[10px] font-bold text-gray-500">({{ petWeightText }})</span>
              </div>
            </div>

            <!-- 健康與照護詳細資訊 -->
            <div
              class="rounded-3xl border-4 border-[#445944] bg-white p-6 shadow-[6px_6px_0px_#445944] md:p-8">
              <h3
                class="mb-6 flex items-center gap-2 border-b-2 border-[#445944] pb-4 text-xl font-black text-[#445944]">
                <span class="text-xl">🩺</span>
                健康與照護明細
              </h3>

              <div class="space-y-4 bg-white text-sm font-bold text-gray-700 md:text-base">
                <!-- 結紮狀況 -->
                <div
                  class="flex items-center justify-between border-b-2 border-dashed border-gray-200 pb-3">
                  <span class="font-black text-gray-400">結紮狀態</span>
                  <span class="flex items-center gap-1.5 font-black text-gray-800">
                    <span :class="pet.isDesex ? 'text-emerald-500' : 'text-amber-500'">●</span>
                    {{ petDesexText }}
                  </span>
                </div>

                <!-- 晶片號碼 -->
                <div
                  class="flex items-center justify-between border-b-2 border-dashed border-gray-200 pb-3">
                  <span class="font-black text-gray-400">晶片號碼</span>
                  <span
                    class="rounded-xl border-2 border-[#445944] bg-[#FCF4E5] px-3 py-1 font-mono text-xs font-black text-gray-700 md:text-sm">
                    {{ pet.microchip || '無 / 尚未植入' }}
                  </span>
                </div>

                <!-- 照護評估 -->
                <div
                  class="flex flex-col gap-2 border-b-2 border-dashed border-gray-200 pb-3 md:flex-row md:items-center md:justify-between">
                  <span class="font-black text-gray-400">特別照護需求</span>
                  <span class="text-right text-xs font-black text-gray-700 md:text-sm">
                    {{ petHighMaintenanceText }}
                  </span>
                </div>

                <!-- 出生日期 -->
                <div
                  class="flex items-center justify-between border-b-2 border-dashed border-gray-200 pb-3">
                  <span class="font-black text-gray-400">預估出生日期</span>
                  <span class="font-black text-gray-800">
                    {{ pet.birthDate || '無詳細記錄' }}
                  </span>
                </div>

                <!-- 刊登時間 -->
                <div class="flex items-center justify-between pb-1">
                  <span class="font-black text-gray-400">刊登公告時間</span>
                  <span class="text-sm font-black text-gray-600">
                    {{ formattedPublishDate }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 生活習慣與相處特性 -->
            <div
              class="rounded-3xl border-4 border-[#445944] bg-white p-6 shadow-[6px_6px_0px_#445944] md:p-8">
              <h3
                class="mb-6 flex items-center gap-2 border-b-2 border-[#445944] pb-4 text-xl font-black text-[#445944]">
                <span class="text-xl">🤝</span>
                生活習性與相處條件
              </h3>

              <div v-if="petBehavioralTraitsArray.length > 0" class="flex flex-wrap gap-3">
                <span
                  v-for="trait in petBehavioralTraitsArray"
                  :key="trait.raw"
                  :class="trait.color"
                  class="rounded-full border-2 border-[#445944] px-4 py-2 text-sm font-black shadow-[2px_2px_0px_#445944] transition-all duration-300 hover:scale-105">
                  {{ trait.zh }}
                </span>
              </div>
              <p v-else class="text-sm font-bold text-gray-400 italic">
                目前無特別載明的生活習慣條件，歡迎直接向送養窗口詢問哦！
              </p>
            </div>

            <!-- 我的小故事 -->
            <div
              class="relative overflow-hidden rounded-3xl border-4 border-[#445944] bg-[#FFFBF9] p-6 shadow-[6px_6px_0px_#445944] md:p-8">
              <!-- 裝飾用雙引號 -->
              <span class="absolute top-4 right-6 font-serif text-8xl text-[#FBF1EC] select-none">
                “
              </span>

              <h3
                class="relative z-10 mb-5 flex items-center gap-2 border-b-2 border-[#445944] pb-4 text-xl font-black text-[#445944]">
                <span class="text-xl">📖</span>
                我的個性與故事
              </h3>

              <div class="relative z-10 space-y-3 leading-relaxed font-bold text-gray-600">
                <p v-for="(paragraph, index) in pet.note ? pet.note.split('\n') : []" :key="index">
                  {{ paragraph }}
                </p>
                <p v-if="!pet.note" class="text-gray-400 italic">
                  這隻可愛的小傢伙還沒有填寫故事介紹，但牠溫柔的眼神已經說明了一切。快來帶牠回家創造幸福記憶吧！
                </p>
              </div>
            </div>

            <!-- 領養行動列 -->
            <div class="flex flex-col gap-4 pt-4 sm:flex-row">
              <button
                @click="showContactModal = true"
                class="flex-1 rounded-2xl border-2 border-[#445944] bg-[#445944] py-4 text-center text-lg font-black text-white shadow-[4px_4px_0px_#445944] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#445944]">
                💌 聯絡送養人 / 申請領養
              </button>

              <button
                @click="router.push({ name: 'pet-adoption' })"
                class="rounded-2xl border-2 border-[#445944] bg-white px-8 py-4 font-black text-[#445944] shadow-[4px_4px_0px_#445944] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#445944]">
                再逛逛其他寶貝
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 聯絡資訊 Lightbox Modal -->
    <div
      v-if="showContactModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 backdrop-blur-sm transition-opacity duration-300">
      <div
        class="w-full max-w-md scale-100 transform rounded-3xl border-4 border-[#445944] bg-white p-6 shadow-[8px_8px_0px_#445944] transition-all duration-300 md:p-8">
        <!-- Modal Header -->
        <div class="mb-6 flex items-center justify-between border-b-2 border-[#445944] pb-4">
          <h3 class="text-2xl font-black text-[#445944]">📫 送養聯絡窗口</h3>
          <button
            @click="showContactModal = false"
            class="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-[#445944] bg-[#FCF4E5] font-black text-gray-600 transition hover:bg-white hover:text-black">
            ✕
          </button>
        </div>

        <!-- Modal Body -->
        <div class="space-y-5">
          <div
            class="rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] p-4 text-sm leading-relaxed font-bold text-gray-700">
            📌
            領養前請務必審慎評估家庭環境、經濟狀況與長期陪伴的決心，讓我們一起為寶貝打造幸福終點站！
          </div>

          <div class="space-y-4">
            <!-- 聯絡人 -->
            <div class="flex flex-col gap-1">
              <span class="text-xs font-black text-gray-400">刊登送養人</span>
              <span class="text-base font-black text-gray-800">{{ contactInfo.name }}</span>
            </div>

            <!-- 電話 -->
            <div class="flex flex-col gap-1">
              <span class="text-xs font-black text-gray-400">行動電話</span>
              <span class="font-mono text-base font-black text-[#445944]">
                {{ contactInfo.phone }}
              </span>
            </div>

            <!-- Line ID -->
            <div class="flex flex-col gap-1">
              <span class="text-xs font-black text-gray-400">Line 聯絡帳號</span>
              <span
                class="flex w-max items-center gap-1.5 rounded-2xl border-2 border-[#445944] bg-[#FCF4E5] p-2 font-mono text-base font-black text-gray-800 shadow-[2px_2px_0px_#445944]">
                <span class="text-emerald-500">🟢</span>
                {{ contactInfo.lineId }}
              </span>
            </div>

            <!-- 聯絡備註 -->
            <div class="flex flex-col gap-1">
              <span class="text-xs font-black text-gray-400">聯絡偏好時段/方式</span>
              <span
                class="rounded-xl border-2 border-[#445944] bg-[#FCF4E5] p-3 text-sm font-bold text-gray-700">
                {{ contactInfo.method }}
              </span>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="mt-8 flex gap-3">
          <button
            @click="showContactModal = false"
            class="w-full rounded-2xl border-2 border-[#445944] bg-[#445944] py-3.5 font-black text-white shadow-[4px_4px_0px_#445944] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#445944]">
            我知道了，關閉視窗
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&family=Quicksand:wght@300..700&display=swap');

.font-fredoka {
  font-family: 'Fredoka', 'GenJyuu', sans-serif;
}

.font-quicksand {
  font-family: 'Quicksand', 'GenJyuu', sans-serif;
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

.aspect-square {
  aspect-ratio: 1 / 1;
}
</style>
