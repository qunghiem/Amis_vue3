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
      <CandidateTable
        :candidates="store.pageData"
        @edit="openEditModal"
        @delete="openDeleteConfirm"
      />

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
    <div
      v-if="store.error"
      style="
        background: #fef2f2;
        border: 1px solid #fca5a5;
        color: #991b1b;
        padding: 10px 16px;
        font-size: 14px;
        margin: 0 20px 10px;
        border-radius: 6px;
      "
    >
      ⚠️ {{ store.error }}
      <button
        @click="store.fetchPage()"
        style="
          margin-left: 12px;
          border: 1px solid #dc2626;
          background: transparent;
          color: #dc2626;
          padding: 2px 10px;
          border-radius: 4px;
          cursor: pointer;
        "
      >
        Thử lại
      </button>
    </div>
  </main>

  <!-- Add / Edit Modal -->
  <CandidateForm
    :visible="formVisible"
    :editingCandidate="editingCandidate"
    @close="closeModal"
    @saved="handleSaved"
  />

  <ConfirmModal
    :visible="confirmState.visible"
    :title="confirmState.title"
    :message="confirmState.message"
    type="danger"
    confirm-text="Xoá"
    @confirm="onConfirm"
    @cancel="closeConfirm"
  />
  />
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useCandidateStore } from '@/stores/candidateStore'
import { useToast } from '@/composables/useToast'
import CandidateTable from '@/components/CandidateTable.vue'
import CandidateForm from '@/components/CandidateForm.vue'
import OverflowMenu from '@/components/OverflowMenu.vue'
import MsButton from '@/components/ms-button/MsButton.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'

const store = useCandidateStore()
const toast = useToast()

// ẩn - hiện form thêm mới / sửa thông tin ứng viên
const formVisible = ref(false)

// Dữ liệu ứng viên đang được chỉnh sửa
const editingCandidate = ref(null)

const saving = ref(false)

const confirmState = reactive({
  visible: false,
  title: '',
  message: '',
  onConfirm: null,
})

// Khởi tạo dữ liệu ứng viên từ Storage khi component được mounted
onMounted(() => store.init())

// Hàm xử lý khi nhập từ ô tìm kiếm
function onSearch(e) {
  //
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

//
// Hàm xử lý khi form thêm mới / sửa thông tin ứng viên được lưu lại
async function handleSaved(data) {
  if (saving.value) return
  saving.value = true
  //
  const tid = toast.loading(data.employeeId ? 'Đang cập nhật...' : 'Đang thêm mới...')
  try {
    data.employeeId ? await store.updateCandidate(data) : await store.addCandidate(data)
    toast.update(tid, '✅ Lưu thành công!', 'success')
    closeModal()
  } catch (err) {
    toast.update(tid, `❌ ${err.message}`, 'error')
  } finally {
    saving.value = false
  }
}

function openDeleteConfirm(id) {
  const name = store.getById(id)?.fullName || 'ứng viên này'
  confirmState.title = 'Xoá ứng viên'
  confirmState.message = `Bạn có chắc muốn xoá ứng viên "${name}"? Thao tác này không thể hoàn tác.`
  // lấy ra hàm thực thi nếu user click Xóa, chưa chạy luôn
  confirmState.onConfirm = () => handleDelete(id)
  confirmState.visible = true
}

// hàm đóng model comfirm khi user click hủy
function closeConfirm() {
  confirmState.visible = false
  confirmState.onConfirm = null
}

// hàm thực hiện callback handleDelete(id) khi user click Xóa
async function onConfirm() {
  const callback = confirmState.onConfirm
  closeConfirm()
  // thực thi handleDelete(id)
  if (callback) await callback()
}

// Hàm xử lý khi xóa ứng viên
async function handleDelete(id) {
  const tid = toast.loading('Đang xóa...')
  try {
    //
    await store.deleteById(id)
    toast.update(tid, '✅ Xóa thành công!', 'success')
  } catch (err) {
    toast.update(tid, `❌ ${err.message}`, 'error')
  }
}

// Hàm xử lý khi chọn các action Xóa đã chọn trong menu dropdown
async function handleMenuAction(id) {
  if (id !== 'delete-selected') return
  const ids = store.selectedIdList
  if (!ids.length) return
  confirmState.title = 'Xoá nhiều ứng viên'
  confirmState.message = `Bạn có chắc muốn xoá ${ids.length} ứng viên đã chọn? Thao tác này không thể hoàn tác.`
  confirmState.onConfirm = async () => {
    const tid = toast.loading('Đang xóa...')
    try {
      await store.deleteByIds(ids)
      toast.update(tid, `✅ Đã xóa ${ids.length} ứng viên!`, 'success')
    } catch (err) {
      toast.update(tid, `❌ ${err.message}`, 'error')
    }
  }
  confirmState.visible = true
}
</script>
