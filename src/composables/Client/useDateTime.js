export function useDateTime() {
  // 1. 在地時間格式化
  const formatLocalDate = (utcString) => {
    if (!utcString) return '剛剛'
    try {
      const safeString =
        utcString.endsWith('Z') || utcString.includes('+') ? utcString : `${utcString}Z`
      const date = new Date(safeString)
      if (isNaN(date.getTime())) return utcString

      const yyyy = date.getFullYear()
      const mm = String(date.getMonth() + 1).padStart(2, '0')
      const dd = String(date.getDate()).padStart(2, '0')
      const hh = String(date.getHours()).padStart(2, '0')
      const min = String(date.getMinutes()).padStart(2, '0')

      return `${yyyy}-${mm}-${dd} ${hh}:${min}`
    } catch (error) {
      return utcString
    }
  }

  // 2. 模糊時間計算 (幾分鐘前...)
  const timeAgo = (utcString) => {
    if (!utcString) return '剛剛'
    try {
      const safeString =
        utcString.endsWith('Z') || utcString.includes('+') ? utcString : `${utcString}Z`
      const date = new Date(safeString)
      if (isNaN(date.getTime())) return utcString

      const now = new Date()
      const diffInMs = now.getTime() - date.getTime()
      if (diffInMs < 0) return '剛剛'

      const seconds = Math.floor(diffInMs / 1000)
      const minutes = Math.floor(seconds / 60)
      const hours = Math.floor(minutes / 60)
      const days = Math.floor(hours / 24)

      if (seconds < 60) return '剛剛'
      if (minutes < 60) return `${minutes} 分鐘前`
      if (hours < 24) return `${hours} 小時前`
      if (days < 7) return `${days} 天前`

      return formatLocalDate(utcString)
    } catch (error) {
      return '剛剛'
    }
  }

  return {
    formatLocalDate,
    timeAgo,
  }
}
