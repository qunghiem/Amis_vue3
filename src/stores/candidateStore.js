import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
// import danh sách mock data
import { employees as defaultData } from '@/data/candidates'

const STORAGE_KEY = 'candidates_data'
const DEFAULT_AVATAR =
  'https://amisplatform.misacdn.net/APIS/PlatformAPI/api/Avatar/77b8feac-dfe5-4b47-b1ff-ac9a2eaced5a/LT0YJBOP.jpg?avatarID=03762a31-c8c5-45ae-887b-17bcdc47043b&width=64&height=64'

export const useCandidateStore = defineStore('candidates', () => {
  // biến lưu danh sách ứng viên
  const candidates = ref([])
  // lưu keyword khi gõ tìm kiếm
  const searchKeyword = ref('')
  // page hiện tại
  const currentPage = ref(1)
  // pageSize
  const pageSize = ref(10)
  // Set lưu id được tích chọn checked
  const selectedIds = ref(new Set())

  // hàm khởi tạo
  function init() {
    const stored = localStorage.getItem(STORAGE_KEY)
    // nếu đã có trong Storage
    if (stored) {
      candidates.value = JSON.parse(stored)

      // nếu chưa có
    } else {
      candidates.value = [...defaultData]
      persist()
    }
  }

  // hàm lưu data vào Storage: dùng mỗi khi có sự thay đổi về data (thêm, sửa, xóa) để cập nhật lại Storage cho đồng bộ với data hiện tại
  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(candidates.value))
  }

  // hàm tìm kiếm ứng viên theo tên sđt email
  const filteredCandidates = computed(() => {
    // chuẩn hóa keyword: xóa khoảng trắng 2 đầu, chuyển về chữ thường để so sánh cho dễ
    const keyWord = searchKeyword.value.trim().toLowerCase()
    // nếu keyword rỗng thì trả về toàn bộ danh sách
    if (!keyWord) return candidates.value
    // nếu có keyword thì filter theo tên, sđt, email
    return candidates.value.filter(
      (c) =>
        c.fullName?.toLowerCase().includes(keyWord) ||
        c.phoneNumber?.toLowerCase().includes(keyWord) ||
        c.email?.toLowerCase().includes(keyWord),
    )
  })

  // tổng số bản ghi sau khi filter
  const totalFiltered = computed(() => filteredCandidates.value.length)

  // danh sách ứng viên của trang đang đứng
  const pageData = computed(() => {
    // tính start index của page hiện tại
    const start = (currentPage.value - 1) * pageSize.value
    return filteredCandidates.value.slice(start, start + pageSize.value)
  })

  // kiểm tra có phải trang đầu
  const isFirstPage = computed(() => currentPage.value <= 1)

  // kiểm tra có phải trang cuối
  const isLastPage = computed(() => currentPage.value * pageSize.value >= totalFiltered.value)

  // thông tin phân trang
  const pageInfo = computed(() => {
    // tổng số bản ghi sau khi filter
    const total = totalFiltered.value
    // tính start, end index của page hiện tại
    const start = total === 0 ? 0 : (currentPage.value - 1) * pageSize.value + 1
    let end = start + pageSize.value - 1
    // nếu là trang cuối thì end = tổng số bản ghi
    if (end > total) end = total
    return { start, end, total }
  })

  // next trang
  function nextPage() {
    if (!isLastPage.value) currentPage.value++
  }

  // lùi trang
  function prevPage() {
    if (!isFirstPage.value) currentPage.value--
  }

  // reset currentPage về = 1
  function resetPage() {
    currentPage.value = 1
  }

  // set size cho page
  function setPageSize(size) {
    pageSize.value = size
    resetPage()
  }

  // thêm ứng viên
  function addCandidate(data) {
    // tìm id lớn nhất hiện tại rồi +1 để tạo id cho ứng viên mới
    const maxId = candidates.value.reduce((m, c) => Math.max(m, c.employeeId), 0)

    // thêm ứng viên mới vào đầu danh sách
    candidates.value.unshift({
      ...data,
      employeeId: maxId + 1,
      avatar: data.avatar || DEFAULT_AVATAR,
    })

    // lưu lại vào Storage sau khi thêm
    persist()

    // reset về trang đầu sau khi thêm mới
    resetPage()
  }

  // cập nhật thông tin ứng viên
  function updateCandidate(data) {
    // tìm index của ứng viên có employeeId trùng với data.employeeId
    const idx = candidates.value.findIndex((c) => c.employeeId === data.employeeId)
    if (idx === -1) return false
    //
    candidates.value[idx] = { ...candidates.value[idx], ...data }
    persist()
    return true
  }

  // xóa 1 ứng viên theo ID
  function deleteById(id) {
    candidates.value = candidates.value.filter((c) => {
      return c.employeeId !== Number(id)
    })
    selectedIds.value.delete(Number(id))
    persist()
  }

  // xóa nhiều ứng viên theo ID
  function deleteByIds(ids) {
    const numSet = new Set(ids.map(Number))
    candidates.value = candidates.value.filter((c) => {
      return !numSet.has(c.employeeId)
    })
    ids.forEach((id) => {
      selectedIds.value.delete(Number(id))
    })
    persist()
  }

  // lấy ứng viên theo ID
  function getById(id) {
    return candidates.value.find((c) => c.employeeId === Number(id)) || null
  }

  //
  function toggleSelect(id) {
    const nId = Number(id)
    if (selectedIds.value.has(nId)) selectedIds.value.delete(nId)
    else selectedIds.value.add(nId)

    selectedIds.value = new Set(selectedIds.value)
  }
  // hàm thêm tất cả vào danh sách đã checked
  function selectAll(ids) {
    ids.forEach((id) => selectedIds.value.add(Number(id)))
    selectedIds.value = new Set(selectedIds.value)
  }
  // hàm xóa tất cả koir danh sách đã checked
  function unselectAll() {
    selectedIds.value = new Set()
  }
  // KIỂM TRA XEM ID ĐÓ ĐÃ TRONG DANH SÁCH ĐÃ CHECKED CHƯA
  function isSelected(id) {
    return selectedIds.value.has(Number(id))
  }

  const selectedCount = computed(() => selectedIds.value.size)
  const selectedIdList = computed(() => Array.from(selectedIds.value))

  return {
    candidates,
    searchKeyword,
    currentPage,
    pageSize,
    selectedIds,
    filteredCandidates,
    totalFiltered,
    pageData,
    isFirstPage,
    isLastPage,
    pageInfo,
    init,
    nextPage,
    prevPage,
    resetPage,
    setPageSize,
    addCandidate,
    updateCandidate,
    deleteById,
    deleteByIds,
    getById,
    toggleSelect,
    selectAll,
    unselectAll,
    isSelected,
    selectedCount,
    selectedIdList,
    DEFAULT_AVATAR,
  }
})
