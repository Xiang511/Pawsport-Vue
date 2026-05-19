<script setup>
import { ref, onMounted, reactive, computed } from 'vue'
import axios from 'axios'
import { useDataTable } from '@/composables/Tailadmin/useMemberDataTableLogic.js'
import request from '@/api/axios'
import { EditIcon, Trash2, X, Plus } from 'lucide-vue-next'
import DataTablePagination from './DataTablePagination.vue'
import ProfileModal from './ProfileModal.vue'

const userList = reactive([])
const groupedUsers = ref([])
const systemList = reactive([])
const roleList = reactive([])
const search = ref('')
const sortColumn = ref('userId')
const sortDirection = ref('asc')
const currentPage = ref(1)
const perPage = ref(10)
const isProfileInfoModal = ref(false)
const isLoading = ref(true)

const selectedUser = reactive({
  userId: '',
  userName: '',
  permissions: [],
})

const newPermission = reactive({
  systemId: '',
  roleId: '',
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
} = useDataTable(groupedUsers, search, sortColumn, sortDirection, currentPage, perPage)

// 按用戶分組權限數據
function groupPermissionsByUser(permissions) {
  const userMap = new Map()

  permissions.forEach((perm) => {
    if (!userMap.has(perm.userId)) {
      userMap.set(perm.userId, {
        userId: perm.userId,
        userName: perm.userName,
        permissions: [],
      })
    }
    userMap.get(perm.userId).permissions.push({
      mappingId: perm.mappingId,
      systemId: perm.systemId,
      systemName: perm.systemName,
      roleId: perm.roleId,
      roleName: perm.roleName,
      updatedAt: perm.updatedAt,
    })
  })

  return Array.from(userMap.values())
}

// 根據系統 ID 獲取顏色類別
function getSystemColor(systemId) {
  const colors = [
    {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      darkBg: 'dark:bg-blue-900/30',
      darkText: 'dark:text-blue-300',
    },
    {
      bg: 'bg-green-100',
      text: 'text-green-800',
      darkBg: 'dark:bg-green-900/30',
      darkText: 'dark:text-green-300',
    },
    {
      bg: 'bg-purple-100',
      text: 'text-purple-800',
      darkBg: 'dark:bg-purple-900/30',
      darkText: 'dark:text-purple-300',
    },
    {
      bg: 'bg-orange-100',
      text: 'text-orange-800',
      darkBg: 'dark:bg-orange-900/30',
      darkText: 'dark:text-orange-300',
    },
    {
      bg: 'bg-pink-100',
      text: 'text-pink-800',
      darkBg: 'dark:bg-pink-900/30',
      darkText: 'dark:text-pink-300',
    },
    {
      bg: 'bg-indigo-100',
      text: 'text-indigo-800',
      darkBg: 'dark:bg-indigo-900/30',
      darkText: 'dark:text-indigo-300',
    },
    {
      bg: 'bg-teal-100',
      text: 'text-teal-800',
      darkBg: 'dark:bg-teal-900/30',
      darkText: 'dark:text-teal-300',
    },
    {
      bg: 'bg-cyan-100',
      text: 'text-cyan-800',
      darkBg: 'dark:bg-cyan-900/30',
      darkText: 'dark:text-cyan-300',
    },
  ]

  // 使用系統 ID 來確保同一系統總是獲得相同的顏色
  const index = systemId % colors.length
  return colors[index]
}

async function GetAllMemberPermission() {
  isLoading.value = true
  try {
    const { data } = await request.get('/Permissions/users')
    const UserInfo = data.data
    // 清空原有數據
    userList.splice(0, userList.length)
    // 添加新數據
    UserInfo.forEach((i) => {
      userList.push({
        userId: i.userId,
        userName: i.userName,
        systemName: i.systemName,
        roleName: i.roleName,
        updatedAt: new Date(i.updatedAt),
        mappingId: i.mappingId,
        systemId: i.systemId,
        roleId: i.roleId,
      })
    })
    // 按用戶分組
    groupedUsers.value = groupPermissionsByUser(userList)
    console.log('分組後的用戶數據:', groupedUsers.value)
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

async function GetAllSystem() {
  try {
    const { data } = await request.get('/Permissions/systems')
    const result = data.data?.systems || data.systems || []
    systemList.splice(0, systemList.length)
    result.forEach((i) => {
      systemList.push({
        systemId: i.systemId,
        systemName: i.systemName,
      })
    })
  } catch (error) {
    console.error('GetAllSystem 錯誤:', error)
  }
}

async function GetAllRole() {
  try {
    const { data } = await request.get('/Permissions/roles')
    const result = data.data?.roles || data.roles || []
    roleList.splice(0, roleList.length)
    result.forEach((i) => {
      roleList.push({
        roleId: i.roleId,
        roleName: i.roleName,
      })
    })
  } catch (error) {
    console.error('GetAllRole 錯誤:', error)
  }
}

function handleEdit(user) {
  console.log('handleEdit 被調用，用戶數據:', user)
  selectedUser.userId = user.userId
  selectedUser.userName = user.userName
  // 深拷貝權限並保留 Date 對象
  selectedUser.permissions = user.permissions.map((perm) => ({
    ...perm,
    updatedAt: perm.updatedAt instanceof Date ? perm.updatedAt : new Date(perm.updatedAt),
  }))
  newPermission.systemId = ''
  newPermission.roleId = ''
  console.log('設置 modal 為 true')
  isProfileInfoModal.value = true
  console.log('isProfileInfoModal.value:', isProfileInfoModal.value)
}

async function handleDeletePermission(mappingId) {
  if (confirm('確定要刪除此權限嗎？')) {
    try {
      await request.delete(`/users/${mappingId}/roles`)
      // 從 selectedUser 的權限列表中移除
      const index = selectedUser.permissions.findIndex((p) => p.mappingId === mappingId)
      if (index !== -1) {
        selectedUser.permissions.splice(index, 1)
      }
      // 重新載入數據
      await GetAllMemberPermission()
      alert('刪除成功')
    } catch (error) {
      console.error('刪除失敗:', error)
      alert('刪除失敗，請稍後再試')
    }
  }
}

async function addNewPermission() {
  if (!newPermission.systemId || !newPermission.roleId) {
    alert('請選擇系統和角色')
    return
  }

  try {
    await request.post(`/users/roles`, {
      userId: selectedUser.userId,
      systemId: parseInt(newPermission.systemId),
      roleId: parseInt(newPermission.roleId),
    })

    // 重新載入數據
    await GetAllMemberPermission()

    // 更新 modal 中的權限列表
    const updatedUser = groupedUsers.value.find((u) => u.userId === selectedUser.userId)
    if (updatedUser) {
      selectedUser.permissions = JSON.parse(JSON.stringify(updatedUser.permissions))
    }

    // 清空表單
    newPermission.systemId = ''
    newPermission.roleId = ''

    alert('新增成功')
  } catch (error) {
    console.error('新增失敗:', error)
    alert('新增失敗，請稍後再試')
  }
}

function closeModal() {
  isProfileInfoModal.value = false
}

onMounted(() => {
  GetAllMemberPermission()
  GetAllSystem()
  GetAllRole()
})
</script>

<template>
  <div class="flex items-center justify-between border-b border-none px-1">
    <div class="pb-4">
      <h3 class="py-2 text-left text-lg font-semibold text-gray-800 dark:text-white/90">
        所有權限列表
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
              <p class="text-theme-xs font-medium text-gray-500 dark:text-gray-400">User ID</p>
            </th>
            <th class="w-max px-2 py-3 text-left sm:px-4">
              <p class="text-theme-xs font-medium text-gray-500 dark:text-gray-400">名稱</p>
            </th>
            <th class="w-max px-2 py-3 text-left sm:px-4">
              <p class="text-theme-xs font-medium text-gray-500 dark:text-gray-400">權限列表</p>
            </th>
            <th class="w-1/12 px-2 py-3 text-center sm:px-4">
              <p class="text-theme-xs font-medium text-gray-500 dark:text-gray-400">操作</p>
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
              <td class="w-min px-4 py-4 text-left sm:px-4">
                <div class="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700"></div>
              </td>
              <td class="w-max px-2 py-4 text-left sm:px-4">
                <div class="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
              </td>
              <td class="w-1/3 px-2 py-4 text-left sm:px-4">
                <div class="flex gap-1.5">
                  <div class="h-6 w-20 rounded bg-gray-200 dark:bg-gray-700"></div>
                  <div class="h-6 w-20 rounded bg-gray-200 dark:bg-gray-700"></div>
                </div>
              </td>
              <td class="w-1/12 px-4 py-4 text-center">
                <div class="flex items-center justify-center">
                  <div class="h-10 w-24 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
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
            <td class="w-min px-4 py-4 text-left sm:px-4">
              <p class="text-theme-sm text-gray-500 dark:text-gray-400">{{ user.userId }}</p>
            </td>
            <td class="w-max px-2 py-4 text-left sm:px-4">
              <span class="text-theme-sm font-medium text-gray-800 dark:text-white/90">
                {{ user.userName }}
              </span>
            </td>
            <td class="w-max px-2 py-4 text-left sm:px-4">
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="perm in user.permissions.slice(0, 3)"
                  :key="perm.mappingId"
                  :class="[
                    'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium',
                    getSystemColor(perm.systemId).bg,
                    getSystemColor(perm.systemId).text,
                    getSystemColor(perm.systemId).darkBg,
                    getSystemColor(perm.systemId).darkText,
                  ]">
                  {{ perm.systemName }} - {{ perm.roleName }}
                </span>
                <span
                  v-if="user.permissions.length > 3"
                  class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                  +{{ user.permissions.length - 3 }} 更多
                </span>
              </div>
            </td>

            <td class="px-4 py-4 text-center">
              <button
                @click.prevent="handleEdit(user)"
                type="button"
                class="bg-brand-success-500 hover:bg-brand-success-600 shadow-theme-sm inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm text-white transition-all active:scale-95">
                <EditIcon />
              </button>
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
  <ProfileModal v-if="isProfileInfoModal" @close="closeModal">
    <template #body>
      <div
        class="no-scrollbar relative w-full max-w-200 overflow-y-auto rounded-3xl bg-white p-4 lg:p-11 dark:bg-gray-900">
        <!-- 關閉按鈕 -->
        <button
          @click="closeModal"
          type="button"
          class="absolute top-4 right-4 z-10 rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300">
          <X :size="20" />
        </button>

        <div class="px-2 pr-14">
          <h4 class="mb-2 text-left text-2xl font-semibold text-gray-800 dark:text-white/90">
            管理會員權限
          </h4>
          <p class="mt-5 mb-6 text-left text-3xl text-gray-500 lg:mb-7 dark:text-gray-400">
            {{ selectedUser.userName }} (ID: {{ selectedUser.userId }})
          </p>
        </div>

        <div class="custom-scrollbar max-h-[600px] overflow-y-auto p-2">
          <!-- 現有權限列表 -->
          <div class="mb-8">
            <h5 class="mb-4 text-left text-lg font-medium text-gray-800 dark:text-white/90">
              現有權限列表
            </h5>

            <div
              v-if="selectedUser.permissions.length === 0"
              class="rounded-lg border border-gray-200 p-6 text-center dark:border-gray-700">
              <p class="text-sm text-gray-500 dark:text-gray-400">此用戶尚無任何權限</p>
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="perm in selectedUser.permissions"
                :key="perm.mappingId"
                class="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                <div class="flex-1 items-center">
                  <div class="flex items-center gap-3">
                    <span
                      :class="[
                        'inline-flex items-center rounded-md px-2.5 py-1 text-sm font-medium',
                        getSystemColor(perm.systemId).bg,
                        getSystemColor(perm.systemId).text,
                        getSystemColor(perm.systemId).darkBg,
                        getSystemColor(perm.systemId).darkText,
                      ]">
                      {{ perm.systemName }}
                    </span>
                    <span
                      class="inline-flex items-center rounded-md bg-green-100 px-2.5 py-1 text-sm font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                      {{ perm.roleName }}
                    </span>
                    <p
                      class="inline-flex items-center rounded-md px-2.5 py-1 text-sm font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                      更新時間: {{ perm.updatedAt.toLocaleDateString('zh-TW') }}
                    </p>
                  </div>
                </div>
                <button
                  @click="handleDeletePermission(perm.mappingId)"
                  type="button"
                  class="bg-brand-error-500 hover:bg-brand-error-600 ml-4 inline-flex items-center justify-center rounded-lg p-2 text-white transition-all active:scale-95">
                  <Trash2 :size="18" />
                </button>
              </div>
            </div>
          </div>

          <!-- 新增權限表單 -->
          <div>
            <h5 class="mb-4 text-left text-lg font-medium text-gray-800 dark:text-white/90">
              新增權限
            </h5>

            <div
              class="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
              <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div>
                  <label
                    class="mb-2 block text-left text-sm font-medium text-gray-700 dark:text-gray-400">
                    選擇系統
                  </label>
                  <select
                    v-model="newPermission.systemId"
                    class="focus:border-brand-500 focus:ring-brand-500/20 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 focus:ring-2 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white/90">
                    <option value="">請選擇系統</option>
                    <option
                      v-for="system in systemList"
                      :key="system.systemId"
                      :value="system.systemId">
                      {{ system.systemName }}
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    class="mb-2 block text-left text-sm font-medium text-gray-700 dark:text-gray-400">
                    選擇角色
                  </label>
                  <select
                    v-model="newPermission.roleId"
                    class="focus:border-brand-500 focus:ring-brand-500/20 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 focus:ring-2 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white/90">
                    <option value="">請選擇角色</option>
                    <option v-for="role in roleList" :key="role.roleId" :value="role.roleId">
                      {{ role.roleName }}
                    </option>
                  </select>
                </div>
                <button
                  @click="addNewPermission"
                  type="button"
                  class="bg-brand-success-500 hover:bg-brand-success-600 mt-4 mt-7 inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-all active:scale-95 lg:w-auto">
                  <Plus :size="18" />
                  新增權限
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 flex items-center justify-end gap-3 px-2">
          <button
            @click="closeModal"
            type="button"
            class="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3">
            關閉
          </button>
        </div>
      </div>
    </template>
  </ProfileModal>
</template>

<style scoped></style>
