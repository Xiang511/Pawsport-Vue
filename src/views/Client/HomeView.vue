<script setup>
import { onMounted } from 'vue'
import { useHomeAdoption } from '@/composables/Client/Home/useHomeAdoption'
import { useHomeMissing } from '@/composables/Client/Home/useHomeMissing'
import { useHomeSuccessStories } from '@/composables/Client/Home/useHomeSuccessStories'
import { useHomeCommunity } from '@/composables/Client/Home/useHomeCommunity'

import HomeHero from '@/components/Client/Home/HomeHero.vue'
import HomeAdoptionCard from '@/components/Client/Home/HomeAdoptionCard.vue'
import HomeHealthPassportCard from '@/components/Client/Home/HomeHealthPassportCard.vue'
import HomeMissingReportCard from '@/components/Client/Home/HomeMissingReportCard.vue'
import HomeTriviaCard from '@/components/Client/Home/HomeTriviaCard.vue'
import HomeSuccessStories from '@/components/Client/Home/HomeSuccessStories.vue'
import HomeCommunitySpotlights from '@/components/Client/Home/HomeCommunitySpotlights.vue'
import HomeNewsletter from '@/components/Client/Home/HomeNewsletter.vue'

const { adoptionPets, isAdoptionLoading, getAdoptionPets } = useHomeAdoption()
const { missingPets, getMissingPets } = useHomeMissing()
const { successStories, getSuccessStories } = useHomeSuccessStories()
const { communityArticles, getCommunityArticles } = useHomeCommunity()

onMounted(async () => {
  await Promise.all([
    getAdoptionPets(),
    getMissingPets(),
    getSuccessStories(),
    getCommunityArticles(),
  ])
})
</script>

<template>
  <div class="page-container min-h-screen bg-[#FDF9F3] text-gray-800 antialiased">
    <HomeHero />

    <section class="bg-[#FCF4E5] py-20">
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
          <HomeAdoptionCard :adoption-pets="adoptionPets" />
          <HomeHealthPassportCard />
          <HomeMissingReportCard :missing-pets="missingPets" />
          <HomeTriviaCard />
        </div>
      </div>
    </section>

    <HomeSuccessStories :stories="successStories" />
    <HomeCommunitySpotlights :articles="communityArticles" />
    <HomeNewsletter />
  </div>
</template>
