<script setup>
import { ref, onMounted, reactive } from 'vue'
import axios from 'axios'
import { useDataTable } from '@/composables/Tailadmin/useMemberDataTableLogic.js'

import { EditIcon, Trash2, X, UserRoundX, UserRound } from 'lucide-vue-next'
import DataTablePagination from './DataTablePagination.vue'
import ProfileModal from './ProfileModal.vue'

const blockList = reactive([])
const search = ref('')
const sortColumn = ref('userId')
const sortDirection = ref('asc')
const currentPage = ref(1)
const perPage = ref(10)
const isProfileInfoModal = ref(false)
const isAddBlockModal = ref(false)
const isLoading = ref(true)

const selectedUser = reactive({
  userId: 'string',
  name: 'string',
  note: 'string',
  updatedAt: null,
  status: false,
})

const newBlockUser = reactive({
  userId: '',
  note: '',
  status: false,
})

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
} = useDataTable(blockList, search, sortColumn, sortDirection, currentPage, perPage)

async function GetAllBlocklistInfo() {
  isLoading.value = true
  try {
    const { data } = await axios.get('https://localhost:7048/api/Permissions/block/users')
    const UserInfo = data.data
    UserInfo.forEach((i) => {
      blockList.push({
        userId: i.userId,
        name: i.name,
        note: i.note,
        updatedAt: i.updatedAt.slice(0, 10) + ' ' + i.updatedAt.slice(11, 19),
        status: i.status,
      })
    })
    // console.table(blockList[0].note)
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

function handleEdit(user) {
  Object.assign(selectedUser, user)
  isProfileInfoModal.value = true
}

function openAddBlockModal() {
  // 重置表單
  newBlockUser.userId = ''
  newBlockUser.note = ''
  newBlockUser.status = false
  isAddBlockModal.value = true
}

async function addBlockUser() {
  if (!newBlockUser.userId.trim()) {
    alert('請輸入 User ID')
    return
  }

  try {
    const data = {
      note: newBlockUser.note,
      status: newBlockUser.status,
    }
    await axios.patch(
      `https://localhost:7048/api/Permissions/block/users/${newBlockUser.userId}`,
      data,
    )

    // 重新載入列表
    blockList.length = 0
    await GetAllBlocklistInfo()

    alert('新增成功')
    isAddBlockModal.value = false
  } catch (error) {
    console.error('新增失敗:', error)
    alert('新增失敗，請稍後再試')
  }
}

async function saveProfile() {
  try {
    const id = selectedUser.userId
    const data = {
      note: selectedUser.note,
      status: selectedUser.status,
    }
    await axios.patch(`https://localhost:7048/api/Permissions/block/users/${id}`, data)
    // 重新載入列表
    blockList.length = 0
    await GetAllBlocklistInfo()
    // 從列表中移除該用戶
    // const index = blockList.findIndex((u) => u.userId === id)
    // if (index !== -1) {
    //   blockList.splice(index, 1)
    // }
    alert('更新成功')
    isProfileInfoModal.value = false
  } catch (error) {
    console.error('更新失敗:', error)
    alert('更新失敗，請稍後再試')
  }
}

async function ModifyBanStatus(user) {
  if (confirm('確定要解除封鎖嗎？')) {
    try {
      const id = user.userId
      const data = {
        note: '',
        status: true,
      }
      await axios.patch(`https://localhost:7048/api/Permissions/block/users/${id}`, data)
      // 從列表中移除該用戶
      const index = blockList.findIndex((u) => u.userId === id)
      if (index !== -1) {
        blockList.splice(index, 1)
      }
      alert('解除封鎖成功')
    } catch (error) {
      console.error('解除封鎖失敗:', error)
      alert('解除封鎖失敗，請稍後再試')
    }
  }
}

onMounted(() => {
  GetAllBlocklistInfo()
})
</script>

<template>
  <div class="flex items-center justify-between border-b border-none px-1">
    <div class="pb-4">
      <h3 class="py-2 text-left text-lg font-semibold text-gray-800 dark:text-white/90">
        違規名單列表
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
        <button
          @click="openAddBlockModal"
          class="bg-brand-success-500 text-theme-xl hover:bg-brand-success-600 shadow-theme-sm inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-white transition-all active:scale-95">
          新增封鎖人員
          <UserRoundX />
        </button>
      </div>
    </div>
  </div>
  <div
    class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
    <div class="custom-scrollbar max-w-full overflow-x-auto">
      <table class="min-w-full">
        <thead>
          <tr class="border-b border-gray-200 dark:border-gray-700">
            <th class="w-1/12 px-4 py-3 text-left sm:px-4">
              <p class="text-theme-xs font-medium text-gray-500 dark:text-gray-400">User ID</p>
            </th>
            <th class="w-max px-2 py-3 text-left sm:px-4">
              <p class="text-theme-xs font-medium text-gray-500 dark:text-gray-400">名稱</p>
            </th>
            <th class="w-1/5 px-2 py-3 text-left sm:px-4">
              <p class="text-theme-xs font-medium text-gray-500 dark:text-gray-400">封鎖原因</p>
            </th>
            <th class="w-1/5 px-2 py-3 text-left sm:px-4">
              <p class="text-theme-xs font-medium text-gray-500 dark:text-gray-400">狀態</p>
            </th>
            <th class="w-1/5 px-2 py-3 text-left sm:px-4">
              <p class="text-theme-xs font-medium text-gray-500 dark:text-gray-400">更新時間</p>
            </th>
            <th class="w-1/12 px-2 py-3 text-left sm:px-4">
              <p class="text-theme-xs font-medium text-gray-500 dark:text-gray-400">動作</p>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <!-- Skeleton Loading Rows -->
          <template v-if="isLoading">
            <tr
              v-for="i in perPage"
              :key="'skeleton-' + i"
              class="animate-pulse border-t border-gray-100 dark:border-gray-800">
              <td class="w-1/12 px-4 py-4 text-left sm:px-4">
                <div class="h-4 w-8 rounded bg-gray-200 dark:bg-gray-700"></div>
              </td>
              <td class="w-max px-2 py-4 text-left sm:px-4">
                <div class="flex items-center gap-3">
                  <div class="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                  <div class="space-y-2">
                    <div class="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
                    <div class="h-3 w-20 rounded bg-gray-200 dark:bg-gray-700"></div>
                  </div>
                </div>
              </td>
              <td class="w-1/5 px-2 py-4 text-left sm:px-4">
                <div class="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>
              </td>
              <td class="w-1/5 px-2 py-4 text-left sm:px-4">
                <div class="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700"></div>
              </td>
              <td class="w-1/5 px-2 py-4 text-left sm:px-4">
                <div class="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700"></div>
              </td>
              <td class="px-4 py-4 text-center">
                <div class="flex items-center justify-center gap-2">
                  <div class="h-10 w-20 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                  <div class="h-10 w-20 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                </div>
              </td>
            </tr>
          </template>

          <!-- Actual Data Rows -->
          <tr
            v-else
            v-for="(user, index) in paginatedData"
            :key="index"
            class="border-t border-gray-100 dark:border-gray-800">
            <td class="w-1/12 px-4 py-4 text-left sm:px-4">
              <p class="text-theme-sm text-gray-500 dark:text-gray-400">{{ user.userId }}</p>
            </td>

            <td class="w-max px-2 py-4 text-left sm:px-4">
              <div class="flex items-center gap-3">
                <!-- <div class="h-10 w-10 overflow-hidden rounded-full">
                  <img :src="user.photo" :alt="user.name" />
                </div> -->
                <div>
                  <span
                    class="text-theme-sm block w-max font-medium text-gray-800 dark:text-white/90">
                    {{ user.name }}
                  </span>
                </div>
              </div>
            </td>
            <td class="w-min px-4 py-4 text-left sm:px-4">
              <p class="text-theme-sm text-gray-500 dark:text-gray-400">{{ user.note }}</p>
            </td>
            <td class="w-1/5 px-2 py-4 text-left sm:px-4">
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

            <td class="w-max px-2 py-4 text-left sm:px-4">
              <p class="text-theme-sm text-gray-500 dark:text-gray-400">
                {{ user.updatedAt }}
              </p>
            </td>
            <td class="w-1/12 px-4 py-4">
              <div class="flex items-center justify-center gap-2">
                <button
                  @click="handleEdit(user)"
                  class="bg-brand-success-500 text-theme-xl hover:bg-brand-success-600 shadow-theme-sm inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-white transition-all active:scale-95">
                  <EditIcon />
                </button>
                <button
                  @click="ModifyBanStatus(user)"
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
      v-if="!isLoading"
      :current-page="currentPage"
      :total-pages="totalPages"
      :total-entries="totalEntries"
      :start-entry="startEntry"
      :end-entry="endEntry"
      @go-to-page="goToPage"
      @next-page="nextPage"
      @prev-page="prevPage" />
  </div>

  <!-- Edit Modal -->
  <ProfileModal v-if="isProfileInfoModal" @close="isProfileInfoModal = false">
    <template #body>
      <div
        class="no-scrollbar relative w-full max-w-175 overflow-y-auto rounded-3xl bg-white p-4 lg:p-11 dark:bg-gray-900">
        <div class="px-2 pr-14">
          <h4 class="mb-2 text-left text-2xl font-semibold text-gray-800 dark:text-white/90">
            編輯封鎖狀態
          </h4>
          <p class="mb-6 text-left text-sm text-gray-500 lg:mb-7 dark:text-gray-400">
            更新會員的狀態或封鎖原因
          </p>
        </div>

        <form class="flex flex-col" @submit.prevent="saveProfile">
          <div class="custom-scrollbar h-114.5 overflow-y-auto p-2">
            <div>
              <h5
                class="mb-5 text-left text-lg font-medium text-gray-800 lg:mb-6 dark:text-white/90">
                基本資料
              </h5>

              <div class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <label
                    class="mb-1.5 block text-left text-sm font-medium text-gray-700 dark:text-gray-400">
                    Id
                  </label>
                  <input
                    readonly="true"
                    v-model="selectedUser.userId"
                    type="text"
                    class="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30" />
                </div>
                <div>
                  <label
                    class="mb-1.5 block text-left text-sm font-medium text-gray-700 dark:text-gray-400">
                    姓名
                  </label>
                  <input
                    readonly="true"
                    v-model="selectedUser.name"
                    type="text"
                    class="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30" />
                </div>
              </div>
            </div>
            <div class="mt-7">
              <h5
                class="mb-5 hidden text-left text-lg font-medium text-gray-800 lg:mb-6 dark:text-white/90">
                狀態資訊
              </h5>

              <div class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div class="col-span-2 lg:col-span-1">
                  <label
                    class="mb-1.5text-left flex hidden items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-400">
                    <input
                      v-model="selectedUser.status"
                      type="checkbox"
                      class="text-brand-500 focus:ring-brand-500 h-4 w-4 rounded border-gray-300" />
                    帳號是否啟用
                  </label>
                </div>

                <div class="col-span-2">
                  <label
                    class="mb-1.5 block text-left text-sm font-medium text-gray-700 dark:text-gray-400">
                    封鎖原因
                  </label>
                  <textarea
                    v-model="selectedUser.note"
                    rows="3"
                    class="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 w-full rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"></textarea>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-6 flex items-center gap-3 px-2 lg:justify-end">
            <button
              @click="isProfileInfoModal = false"
              type="button"
              class="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-auto dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3">
              取消
            </button>
            <button
              type="submit"
              class="bg-brand-success-500 hover:bg-brand-success-600 flex w-full justify-center rounded-lg px-4 py-2.5 text-sm font-medium text-white sm:w-auto">
              儲存變更
            </button>
          </div>
        </form>
      </div>
    </template>
  </ProfileModal>

  <!-- Add Block User Modal -->
  <ProfileModal v-if="isAddBlockModal" @close="isAddBlockModal = false">
    <template #body>
      <div
        class="no-scrollbar relative w-full max-w-175 overflow-y-auto rounded-3xl bg-white p-4 lg:p-11 dark:bg-gray-900">
        <div class="px-2 pr-14">
          <h4 class="mb-2 text-left text-2xl font-semibold text-gray-800 dark:text-white/90">
            新增封鎖人員
          </h4>
          <p class="mb-6 text-left text-sm text-gray-500 lg:mb-7 dark:text-gray-400">
            將會員加入封鎖名單
          </p>
        </div>

        <form class="flex flex-col" @submit.prevent="addBlockUser">
          <div class="custom-scrollbar h-auto overflow-y-auto p-2">
            <div>
              <h5
                class="mb-5 text-left text-lg font-medium text-gray-800 lg:mb-6 dark:text-white/90">
                基本資料
              </h5>

              <div class="grid grid-cols-1 gap-x-6 gap-y-5">
                <div>
                  <label
                    class="mb-1.5 block text-left text-sm font-medium text-gray-700 dark:text-gray-400">
                    User ID
                    <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="newBlockUser.userId"
                    type="text"
                    required
                    placeholder="請輸入會員的 User ID"
                    class="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30" />
                </div>
              </div>
            </div>
            <div class="mt-7">
              <h5
                class="mb-5 hidden text-left text-lg font-medium text-gray-800 lg:mb-6 dark:text-white/90">
                狀態資訊
              </h5>

              <div class="grid grid-cols-1 gap-x-6 gap-y-5">
                <div class="col-span-1">
                  <label
                    class="mb-1.5 flex hidden items-center gap-2 text-left text-sm font-medium text-gray-700 dark:text-gray-400">
                    <input
                      v-model="newBlockUser.status"
                      type="checkbox"
                      class="text-brand-500 focus:ring-brand-500 hidden h-4 w-4 rounded border-gray-300" />
                    帳號是否啟用
                  </label>
                </div>

                <div class="col-span-1">
                  <label
                    class="mb-1.5 block text-left text-sm font-medium text-gray-700 dark:text-gray-400">
                    封鎖原因
                  </label>
                  <textarea
                    v-model="newBlockUser.note"
                    rows="3"
                    placeholder="請輸入封鎖原因（選填）"
                    class="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 w-full rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"></textarea>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-6 flex items-center gap-3 px-2 lg:justify-end">
            <button
              @click="isAddBlockModal = false"
              type="button"
              class="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-auto dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3">
              取消
            </button>
            <button
              type="submit"
              class="bg-brand-success-500 hover:bg-brand-success-600 flex w-full justify-center rounded-lg px-4 py-2.5 text-sm font-medium text-white sm:w-auto">
              新增封鎖
            </button>
          </div>
        </form>
      </div>
    </template>
  </ProfileModal>
</template>

<style scoped></style>
