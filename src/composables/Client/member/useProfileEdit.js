import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import request from '@/api/axios'

/**
 * 管理會員個人資料編輯表單與儲存邏輯的 composable
 */
export function useProfileEdit() {
  const authStore = useAuthStore()
  const user = computed(() => authStore.userInfo || {})

  const isEditingProfile = ref(false)
  const isLoadingForm = ref(false)
  const isSaving = ref(false)
  const saveError = ref('')

  const editForm = ref({
    // 可編輯欄位
    photo: '',
    name: '',
    phone: '',
    job: '',
    birthday: '',
    city: '',
    note: '',
    hasPriorExp: null,
    isSubscribe: null,
    // 唯讀欄位（帶入 payload 但不開放修改）
    userId: null,
    email: '',
    point: null,
    status: true,
    isVerify: null,
    createdAt: null,
    updatedAt: null,
  })

  const avatarInitials = computed(() => {
    const name = user.value?.name || user.value?.userName || 'U'
    return name.charAt(0).toUpperCase()
  })

  /**
   * 將使用者資料物件映射為 editForm 格式
   * @param {Object} u - 使用者資料
   * @returns {Object} 對應 editForm 結構的資料物件
   */
  const mapUserToForm = (u) => ({
    photo: u.photo || '',
    name: u.name || u.userName || '',
    phone: u.phone?.trim() || '',
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
  })

  /**
   * 開啟編輯 Modal 並從 API 取得最新使用者資料填入表單
   */
  const startEdit = async () => {
    saveError.value = ''
    isEditingProfile.value = true
    isLoadingForm.value = true

    const userId = parseInt(user.value?.userId ?? user.value?.id)

    try {
      const res = await request.get(`/Users/${userId}`)
      const u = res.data?.success && res.data?.data ? res.data.data : user.value
      editForm.value = mapUserToForm(u)
    } catch (e) {
      // API 失敗時退回 authStore 的快取資料
      editForm.value = mapUserToForm(user.value)
      console.warn('[startEdit] 無法取得最新資料，使用快取', e)
    } finally {
      isLoadingForm.value = false
    }
  }

  /**
   * 將表單資料送出至 API 並更新 authStore 快取
   */
  const saveProfile = async () => {
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
        userId,
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

  return {
    editForm,
    isEditingProfile,
    isLoadingForm,
    isSaving,
    saveError,
    avatarInitials,
    startEdit,
    saveProfile,
  }
}
