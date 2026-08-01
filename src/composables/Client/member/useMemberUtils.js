/**
 * 會員頁面共用工具函式
 */
export function useMemberUtils() {
  /**
   * 將日期字串格式化為 YYYY/MM/DD
   * @param {string|null} dateStr - ISO 日期字串
   * @param {string} fallback - 無資料時的預設文字
   * @returns {string} 格式化後的日期字串
   */
  const formatDate = (dateStr, fallback = '尚未遊玩') => {
    if (!dateStr) return fallback
    const d = new Date(dateStr)
    return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`
  }

  return { formatDate }
}
