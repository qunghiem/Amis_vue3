import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { employeeService } from '@/services/employeeService'

export const useCandidateStore = defineStore('candidates', () => {
  const candidates    = ref([])
  const totalCount    = ref(0)
  const loading       = ref(false)
  const error         = ref(null)
  const searchKeyword = ref('')
  const currentPage   = ref(1)
  const pageSize      = ref(10)
  const selectedIds   = ref(new Set())
  let debounceTimer   = null

  const DEFAULT_AVATAR = 'https://amisplatform.misacdn.net/APIS/PlatformAPI/api/Avatar/77b8feac-dfe5-4b47-b1ff-ac9a2eaced5a/LT0YJBOP.jpg?avatarID=03762a31-c8c5-45ae-887b-17bcdc47043b&width=64&height=64'

  async function fetchPage() {
    loading.value = true; error.value = null
    try {
      const res = await employeeService.search(searchKeyword.value, currentPage.value, pageSize.value)
      candidates.value = res.data
      totalCount.value = res.totalCount
    } catch (err) {
      error.value = err.message; candidates.value = []
    } finally {
      loading.value = false
    }
  }

  watch(searchKeyword, () => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => { currentPage.value = 1; fetchPage() }, 350)
  })
  watch([currentPage, pageSize], fetchPage)

  const init        = () => fetchPage()
  const pageData    = computed(() => candidates.value)
  const isFirstPage = computed(() => currentPage.value <= 1)
  const isLastPage  = computed(() => currentPage.value * pageSize.value >= totalCount.value)
  const pageInfo    = computed(() => {
    const total = totalCount.value
    const start = total === 0 ? 0 : (currentPage.value - 1) * pageSize.value + 1
    return { start, end: Math.min(start + pageSize.value - 1, total), total }
  })

  const nextPage  = () => { if (!isLastPage.value)  currentPage.value++ }
  const prevPage  = () => { if (!isFirstPage.value) currentPage.value-- }
  const resetPage = () => { currentPage.value = 1 }
  const setPageSize = (size) => { pageSize.value = size; resetPage() }

  async function addCandidate(data)    { await employeeService.insert(data);  resetPage(); await fetchPage() }
  async function updateCandidate(data) { await employeeService.update(data);  await fetchPage() }
  async function deleteById(id)        { await employeeService.deleteById(id); selectedIds.value.delete(id); await fetchPage() }
  async function deleteByIds(ids) {
    await employeeService.deleteMultiple(ids)
    ids.forEach(id => selectedIds.value.delete(id))
    selectedIds.value = new Set(selectedIds.value)
    await fetchPage()
  }

  const getById = (id) => candidates.value.find(c => c.employeeId === id) ?? null

  const toggleSelect = (id) => { const s = new Set(selectedIds.value); s.has(id) ? s.delete(id) : s.add(id); selectedIds.value = s }
  const selectAll    = (ids) => { const s = new Set(selectedIds.value); ids.forEach(id => s.add(id)); selectedIds.value = s }
  const unselectAll  = () => { selectedIds.value = new Set() }
  const isSelected   = (id) => selectedIds.value.has(id)

  const selectedCount   = computed(() => selectedIds.value.size)
  const selectedIdList  = computed(() => Array.from(selectedIds.value))

  return {
    candidates, totalCount, loading, error, searchKeyword, currentPage, pageSize, selectedIds,
    pageData, isFirstPage, isLastPage, pageInfo, selectedCount, selectedIdList, DEFAULT_AVATAR,
    init, fetchPage, nextPage, prevPage, resetPage, setPageSize,
    addCandidate, updateCandidate, deleteById, deleteByIds, getById,
    toggleSelect, selectAll, unselectAll, isSelected,
  }
})
