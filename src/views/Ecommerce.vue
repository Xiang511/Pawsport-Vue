<script>
import CustomerDemographic from '@/components/Tailadmin/ecommerce/CustomerDemographic.vue'
import EcommerceMetrics from '@/components/Tailadmin/ecommerce/EcommerceMetrics.vue'
import MonthlySale from '@/components/Tailadmin/ecommerce/MonthlySale.vue'
import MonthlyTarget from '@/components/Tailadmin/ecommerce/MonthlyTarget.vue'
import RecentOrders from '@/components/Tailadmin/ecommerce/RecentOrders.vue'
import StatisticsChart from '@/components/Tailadmin/ecommerce/StatisticsChart.vue'

export default {
  components: {
    EcommerceMetrics,
    MonthlyTarget,
    MonthlySale,
    CustomerDemographic,
    StatisticsChart,
    RecentOrders,
  },
  name: 'Ecommerce',
}
</script>

<template>
  <div class="grid grid-cols-12 gap-4 md:gap-6">
    <div class="col-span-12 space-y-6 xl:col-span-7">
      <ecommerce-metrics />
      <monthly-target />
    </div>
    <div class="col-span-12 xl:col-span-5">
      <monthly-sale />
    </div>

    <div class="col-span-12">
      <statistics-chart />
    </div>

    <div class="col-span-12 xl:col-span-5">
      <customer-demographic />
    </div>

    <div class="col-span-12 xl:col-span-7">
      <recent-orders />
    </div>
  </div>
</template>
