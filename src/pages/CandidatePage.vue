<template>
  <main class="layout__content">
    <!-- Title header -->
    <div class="title__header">
      <div class="title__left">Ứng viên</div>
      <div class="title__right">
        <MsButton type="danger" size="large" icon="fa-solid fa-trash">
          Xóa dữ liệu ứng viên không trúng tuyển
        </MsButton>

        <MsButton type="primary" size="large" icon="fa-solid fa-plus" @click="openAddModal">
          Thêm ứng viên
        </MsButton>
      </div>
    </div>

    <div class="content">
      <!-- Thanh bar ngang nếu có Checked -->
      <div
        class="selected_content"
        :class="store.selectedCount > 0 ? 'display-flex' : 'display-none'"
      >
        <p class="selected-count">{{ store.selectedCount }} đang chọn</p>
        <MsButton type="text" @click="store.unselectAll()">Bỏ chọn</MsButton>
        <OverflowMenu @action="handleMenuAction" />
      </div>

      <!-- Search & filter bar -->
       <!-- // chỉ hiện khi k chọn checked ai  -->
      <div class="content__nav" :class="{ 'display-none': store.selectedCount > 0 }">
        <div class="content__search">
          <div class="icon-search-ami"></div>
          <input
            type="text"
            placeholder="Tìm kiếm hoặc nhờ AI trợ giúp"
            :value="store.searchKeyword"
            @input="onSearch"
          />
        </div>
        <div class="content__feature">
          <div class="filter"><div class="icon"></div></div>
          <div class="filter"><div class="icon"></div></div>
          <div class="filter"><div class="icon"></div></div>
          <div class="filter"><div class="icon"></div></div>
        </div>
      </div>

      <!-- Table -->
      <CandidateTable :candidates="store.pageData" @edit="openEditModal" @delete="handleDelete" />

      <!-- Footer pagination -->
      <div class="foot-table">
        <!-- // Tổng số bản ghi  -->
        <div class="total-record">Tổng bản ghi: {{ store.pageInfo.total }}</div>
        <!-- // Số bản ghi trên 1 trang -->
        <div class="total-page">
          Số bản ghi/trang
          <select
            :value="store.pageSize"
            @change="(e) => store.setPageSize(Number(e.target.value))"
          >
            <option v-for="n in [5, 10, 15, 25, 50, 100]" :key="n" :value="n">{{ n }}</option>
          </select>
          <!-- Số trang -->
          <div class="desc index-record">
            {{ store.pageInfo.start }} - {{ store.pageInfo.end }} bản ghi
          </div>
          <!-- // Nút chuyển trang -->
          <div class="prev-next">
            <button class="prev" :disabled="store.isFirstPage" @click="store.prevPage()"></button>
            <button class="next" :disabled="store.isLastPage" @click="store.nextPage()"></button>
          </div>
        </div>
      </div>
    </div>
  </main>

  <!-- Add / Edit Modal -->
  <CandidateForm
    :visible="formVisible"
    :editingCandidate="editingCandidate"
    @close="closeModal"
    @saved="handleSaved"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCandidateStore } from '@/stores/candidateStore'
import { useToast } from '@/composables/useToast'
import CandidateTable from '@/components/CandidateTable.vue'
import CandidateForm from '@/components/CandidateForm.vue'
import OverflowMenu from '@/components/OverflowMenu.vue'
import MsButton from '@/components/ms-button/MsButton.vue'

const store = useCandidateStore()
const toast = useToast()

// ẩn - hiện form thêm mới / sửa thông tin ứng viên
const formVisible = ref(false)

// Dữ liệu ứng viên đang được chỉnh sửa
const editingCandidate = ref(null)

// Khởi tạo dữ liệu ứng viên từ Storage khi component được mounted
onMounted(() => store.init())

// Hàm xử lý khi nhập từ ô tìm kiếm
function onSearch(e) {
  store.searchKeyword = e.target.value
  store.resetPage()
}

// Mở modal thêm mới (truyền null để form biết là đang ở chế độ thêm mới, không phải sửa)
function openAddModal() {
  editingCandidate.value = null
  // hiện form thêm mới
  formVisible.value = true
}

// Mở modal sửa thông tin (truyền dữ liệu ứng viên cần sửa vào form để form bind hiển thị thông tin đó lên các ô input)
function openEditModal(id) {
  editingCandidate.value = store.getById(id)
  // hiện form sửa thông tin
  formVisible.value = true
}

// Đóng modal và reset dữ liệu đang chỉnh sửa
function closeModal() {
  formVisible.value = false
  editingCandidate.value = null
}

// Hàm xử lý khi form thêm mới / sửa thông tin ứng viên được lưu lại
function handleSaved(data) {
  // nếu data có employeeId nghĩa là đang sửa thông tin ứng viên, ngược lại là đang thêm mới
  if (data.employeeId) {
    store.updateCandidate(data)
    toast.success('✅ Cập nhật thông tin thành công!')
  } else {
    store.addCandidate(data)
    toast.success('✅ Thêm ứng viên thành công!')
  }
  // đóng modal sau khi lưu thành công
  closeModal()
}

// Hàm xử lý khi xóa ứng viên
function handleDelete(id) {
  if (!confirm('Bạn có chắc muốn xóa ứng viên này?')) return
  store.deleteById(id)
  toast.success('✅ Xóa ứng viên thành công!')
}

// Hàm xử lý khi chọn các action Xóa đã chọn trong menu dropdown
function handleMenuAction(id) {

  if (id === 'delete-selected') {
    const ids = store.selectedIdList // Lấy danh sách id của các ứng viên đang được chọn
    if (!ids.length) return
    if (!confirm(`Bạn có chắc muốn xóa ${ids.length} ứng viên đã chọn?`)) return
    store.deleteByIds(ids)
    toast.success(`Đã xóa ${ids.length} ứng viên!`)
  } else {
    console.log('Menu action:', id, '| Selected:', store.selectedIdList)
  }
}
</script>
