import { computed } from 'vue'

export function useDataTable(userList, search, sortColumn, sortDirection, currentPage, perPage) {
  const filteredData = computed(() => {
    const searchLower = search.value.toLowerCase()
    const list = Array.isArray(userList) ? userList : userList.value || []
    return list
      .filter(
        (user) =>
          (user.name ? user.name.toLowerCase().includes(searchLower) : false) ||
          (user.userName ? user.userName.toLowerCase().includes(searchLower) : false) ||
          (user.phone ? user.phone.toLowerCase().includes(searchLower) : false) ||
          (user.city ? user.city.toLowerCase().includes(searchLower) : false) ||
          (user.job ? user.job.toLowerCase().includes(searchLower) : false) ||
          (user.systemName ? user.systemName.toLowerCase().includes(searchLower) : false) ||
          (user.roleName ? user.roleName.toLowerCase().includes(searchLower) : false),
      )
      .sort((a, b) => {
        let modifier = sortDirection.value === 'asc' ? 1 : -1
        const aVal = a[sortColumn.value] || ''
        const bVal = b[sortColumn.value] || ''
        if (aVal < bVal) return -1 * modifier
        if (aVal > bVal) return 1 * modifier
        return 0
      })
  })

  const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * perPage.value
    const end = start + perPage.value
    return filteredData.value.slice(start, end)
  })

  const totalEntries = computed(() => filteredData.value.length)
  const totalPages = computed(() => Math.ceil(filteredData.value.length / perPage.value))

  const startEntry = computed(() => (currentPage.value - 1) * perPage.value + 1)
  const endEntry = computed(() => {
    const end = currentPage.value * perPage.value
    return end > totalEntries.value ? totalEntries.value : end
  })

  const pagesAroundCurrent = computed(() => {
    let pages = []
    const startPage = Math.max(2, currentPage.value - 2)
    const endPage = Math.min(totalPages.value - 1, currentPage.value + 2)
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    return pages
  })

  function goToPage(page) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  function nextPage() {
    if (currentPage.value < totalPages.value) {
      currentPage.value++
    }
  }

  function prevPage() {
    if (currentPage.value > 1) {
      currentPage.value--
    }
  }

  function sortBy(column) {
    if (sortColumn.value === column) {
      sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortDirection.value = 'asc'
      sortColumn.value = column
    }
  }

  return {
    filteredData,
    paginatedData,
    totalEntries,
    totalPages,
    startEntry,
    endEntry,
    pagesAroundCurrent,
    goToPage,
    nextPage,
    prevPage,
    sortBy,
  }
}
