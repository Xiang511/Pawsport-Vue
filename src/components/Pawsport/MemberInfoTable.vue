<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { reactive } from 'vue'
import { useDataTable } from '@/composables/Tailadmin/useMemberDataTableLogic.js'

import { EditIcon, Trash2 } from 'lucide-vue-next'
import DataTablePagination from './DataTablePagination.vue'

const userList = reactive([])
const search = ref('')
const sortColumn = ref('userId')
const sortDirection = ref('asc')
const currentPage = ref(1)
const perPage = ref(10)

const {
  paginatedData,
  totalPages,
  totalEntries,
  startEntry,
  endEntry,
  pagesAroundCurrent,
  goToPage,
  nextPage,
  prevPage,
  sortBy,
} = useDataTable(userList, search, sortColumn, sortDirection, currentPage, perPage)

async function GetAllMemberInfo() {
  try {
    const { data } = await axios.get('https://localhost:7048/api/Users')
    const UserInfo = data.data
    UserInfo.forEach((i) => {
      userList.push({
        userId: i.userId,
        name: i.name,
        photo: i.photo,
        job: i.job,
        phone: i.phone,
        birthday: i.birthday,
        city: i.city,
        point: i.point,
        note: i.note,
        hasPriorExp: i.hasPriorExp,
        status: i.status,
        isSubscribe: i.isSubscribe,
        isVerify: i.isVerify,
        createdAt: new Date(i.createdAt),
        updatedAt: new Date(i.updatedAt),
      })
    })
    console.table(userList)
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  GetAllMemberInfo()
})
</script>

<template>
  <div class="flex items-center justify-between border-b border-none px-1">
    <div class="pb-4">
      <h3 class="py-2 text-left text-lg font-semibold text-gray-800 dark:text-white/90">
        個人資料列表
      </h3>
      <p class="text-sm text-gray-500 dark:text-gray-400">預設顯示10筆資料</p>
    </div>
    <div class="flex gap-3.5">
      <div class="hidden flex-col gap-3 sm:flex sm:flex-row sm:items-center">
        <div class="relative">
          <span class="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 dark:text-gray-400">
            <svg
              class="fill-current"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M3.04199 9.37363C3.04199 5.87693 5.87735 3.04199 9.37533 3.04199C12.8733 3.04199 15.7087 5.87693 15.7087 9.37363C15.7087 12.8703 12.8733 15.7053 9.37533 15.7053C5.87735 15.7053 3.04199 12.8703 3.04199 9.37363ZM9.37533 1.54199C5.04926 1.54199 1.54199 5.04817 1.54199 9.37363C1.54199 13.6991 5.04926 17.2053 9.37533 17.2053C11.2676 17.2053 13.0032 16.5344 14.3572 15.4176L17.1773 18.238C17.4702 18.5309 17.945 18.5309 18.2379 18.238C18.5308 17.9451 18.5309 17.4703 18.238 17.1773L15.4182 14.3573C16.5367 13.0033 17.2087 11.2669 17.2087 9.37363C17.2087 5.04817 13.7014 1.54199 9.37533 1.54199Z"
                fill="" />
            </svg>
          </span>

          <input
            v-model="search"
            type="text"
            placeholder="Search..."
            class="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pr-4 pl-11 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden xl:w-[300px] dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30" />
        </div>
      </div>
    </div>
  </div>
  <div
    class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
    <div class="custom-scrollbar max-w-full overflow-x-auto">
      <table class="min-w-full">
        <thead>
          <tr class="border-b border-gray-200 dark:border-gray-700">
            <th class="w-min px-4 py-3 text-left sm:px-4">
              <p class="text-theme-xs font-medium text-gray-500 dark:text-gray-400">ID</p>
            </th>
            <th class="w-max px-2 py-3 text-left sm:px-4">
              <p class="text-theme-xs font-medium text-gray-500 dark:text-gray-400">名稱</p>
            </th>
            <th class="w-1/12 px-2 py-3 text-left sm:px-4">
              <p class="text-theme-xs font-medium text-gray-500 dark:text-gray-400">電話</p>
            </th>
            <th class="w-max px-2 py-3 text-left sm:px-4">
              <p class="text-theme-xs font-medium text-gray-500 dark:text-gray-400">生日</p>
            </th>
            <th class="w-1/12 px-2 py-3 text-left sm:px-4">
              <p class="text-theme-xs font-medium text-gray-500 dark:text-gray-400">城市</p>
            </th>
            <th class="w-1/12 px-2 py-3 text-left sm:px-4">
              <p class="text-theme-xs font-medium text-gray-500 dark:text-gray-400">備註</p>
            </th>
            <th class="w-1/12 px-2 py-3 text-left sm:px-4">
              <p class="text-theme-xs font-medium text-gray-500 dark:text-gray-400">領養經驗</p>
            </th>
            <th class="w-1/12 px-2 py-3 text-left sm:px-4">
              <p class="text-theme-xs font-medium text-gray-500 dark:text-gray-400">帳號狀態</p>
            </th>
            <th class="w-1/12 px-2 py-3 text-left sm:px-4">
              <p class="text-theme-xs font-medium text-gray-500 dark:text-gray-400">訂閱狀態</p>
            </th>
            <th class="w-1/12 px-2 py-3 text-left sm:px-4">
              <p class="text-theme-xs font-medium text-gray-500 dark:text-gray-400">認證狀態</p>
            </th>
            <th class="w-1/12 px-2 py-3 text-left sm:px-4">
              <p class="text-theme-xs font-medium text-gray-500 dark:text-gray-400">創建時間</p>
            </th>
            <th class="w-1/12 px-2 py-3 text-left sm:px-4">
              <p class="text-theme-xs font-medium text-gray-500 dark:text-gray-400">更新時間</p>
            </th>
            <th class="w-1/12 px-2 py-3 text-left sm:px-4">
              <p class="text-theme-xs font-medium text-gray-500 dark:text-gray-400">動作</p>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr
            v-for="(user, index) in paginatedData"
            :key="index"
            class="border-t border-gray-100 dark:border-gray-800">
            <td class="w-min px-4 py-4 text-left sm:px-4">
              <p class="text-theme-sm text-gray-500 dark:text-gray-400">{{ user.userId }}</p>
            </td>
            <td class="w-max px-2 py-4 text-left sm:px-4">
              <div class="flex items-center gap-3">
                <div class="h-10 w-10 overflow-hidden rounded-full">
                  <img :src="user.photo" :alt="user.name" />
                </div>
                <div>
                  <span
                    class="text-theme-sm block w-max font-medium text-gray-800 dark:text-white/90">
                    {{ user.name }}
                  </span>
                  <span class="text-theme-xs block font-medium text-gray-800 dark:text-white/90">
                    {{ user.job }}
                  </span>
                </div>
              </div>
            </td>
            <td class="w-1/12 px-2 py-4 text-left sm:px-4">
              <p class="text-theme-sm text-gray-500 dark:text-gray-400">{{ user.phone }}</p>
            </td>
            <td class="w-max px-2 py-4 text-left sm:px-4">
              <p class="text-theme-sm text-gray-500 dark:text-gray-400">
                {{ user.birthday ? user.birthday.split('-').join('/') : '無資料' }}
              </p>
            </td>
            <td class="w-1/12 px-2 py-4 text-left sm:px-4">
              <p class="text-theme-sm text-gray-500 dark:text-gray-400">{{ user.city }}</p>
            </td>
            <td class="w-1/12 px-2 py-4 text-left sm:px-4">
              <p class="text-theme-sm text-gray-500 dark:text-gray-400">
                {{ user.notes ? user.notes : '無' }}
              </p>
            </td>
            <td class="w-1/12 px-2 py-4 text-left sm:px-4">
              <p class="text-theme-sm text-gray-500 dark:text-gray-400">
                {{ user.hasPriorExp ? '有' : '無' }}
              </p>
            </td>
            <td class="w-1/12 px-2 py-4 text-left sm:px-4">
              <span
                :class="[
                  'text-theme-xs rounded-full px-2 py-0.5 font-medium',
                  {
                    'bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-500':
                      user.status === true,
                    'bg-error-100 text-error-700 dark:bg-error-500/15 dark:text-error-500':
                      user.status === false,
                  },
                ]">
                {{ user.status ? 'Active' : 'Ban' }}
              </span>
            </td>
            <td class="w-1/12 px-2 py-4 text-left sm:px-4">
              <p class="text-theme-sm text-gray-500 dark:text-gray-400">
                {{ user.isSubscribe ? '已訂閱' : '未訂閱' }}
              </p>
            </td>
            <td class="w-1/12 px-2 py-4 text-left sm:px-4">
              <p class="text-theme-sm text-gray-500 dark:text-gray-400">
                {{ user.isVerify ? '已驗證' : '未驗證' }}
              </p>
            </td>
            <td class="w-1/12 px-2 py-4 text-left sm:px-4">
              <p class="text-theme-sm text-gray-500 dark:text-gray-400">
                {{ user.createdAt.toLocaleDateString('zh-TW') }}
              </p>
            </td>
            <td class="w-1/12 px-2 py-4 text-left sm:px-4">
              <p class="text-theme-sm text-gray-500 dark:text-gray-400">
                {{ user.updatedAt.toLocaleDateString('zh-TW') }}
              </p>
            </td>
            <td class="px-4 py-4 text-center">
              <div class="flex items-center justify-center gap-2">
                <button
                  @click="openModal(item)"
                  class="bg-brand-success-500 text-theme-xl hover:bg-brand-success-600 shadow-theme-sm inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-white transition-all active:scale-95">
                  <EditIcon />
                </button>
                <button
                  @click="deleteQuestion(item.gameId)"
                  class="bg-brand-error-500 text-theme-xl hover:bg-brand-error-600 shadow-theme-sm inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-white transition-all active:scale-95">
                  <Trash2 />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Pagination -->
    <DataTablePagination
      :current-page="currentPage"
      :total-pages="totalPages"
      :total-entries="totalEntries"
      :start-entry="startEntry"
      :end-entry="endEntry"
      @go-to-page="goToPage"
      @next-page="nextPage"
      @prev-page="prevPage" />
  </div>
</template>

<style scoped>
/* Add any additional styles here if needed */
</style>
