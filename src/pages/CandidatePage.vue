<template>
  <main class="layout__content">
    <!-- Title header -->
    <div class="title__header">
      <div class="title__left">Ứng viên</div>
      <div class="title__right">
        <MsButton type="danger" size="medium" icon="fa-solid fa-trash">
          Xóa dữ liệu ứng viên không trúng tuyển
        </MsButton>

        <MsButton type="primary" size="medium" icon="fa-solid fa-plus" @click="openAddModal">
          Thêm ứng viên
        </MsButton>
      </div>
    </div>

    <div class="content">
      <!-- Selection toolbar -->
      <div
        class="selected_content"
        :class="store.selectedCount > 0 ? 'display-flex' : 'display-none'"
      >
        <p class="selected-count">{{ store.selectedCount }} đang chọn</p>
        <MsButton type="text" @click="store.unselectAll()">Bỏ chọn</MsButton>
        <OverflowMenu @action="handleMenuAction" />
      </div>

      <!-- Search & filter bar -->
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
        <div class="total-record">Tổng bản ghi: {{ store.pageInfo.total }}</div>
        <div class="total-page">
          Số bản ghi/trang
          <select
            :value="store.pageSize"
            @change="(e) => store.setPageSize(Number(e.target.value))"
          >
            <option v-for="n in [5, 10, 15, 25, 50, 100]" :key="n" :value="n">{{ n }}</option>
          </select>
          <div class="desc index-record">
            {{ store.pageInfo.start }} - {{ store.pageInfo.end }} bản ghi
          </div>
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

const formVisible = ref(false)
const editingCandidate = ref(null)

onMounted(() => store.init())

function onSearch(e) {
  store.searchKeyword = e.target.value
  store.resetPage()
}

function openAddModal() {
  editingCandidate.value = null
  formVisible.value = true
}

function openEditModal(id) {
  editingCandidate.value = store.getById(id)
  formVisible.value = true
}

function closeModal() {
  formVisible.value = false
  editingCandidate.value = null
}

function handleSaved(data) {
  if (data.employeeId) {
    store.updateCandidate(data)
    toast.success('✅ Cập nhật thông tin thành công!')
  } else {
    store.addCandidate(data)
    toast.success('✅ Thêm ứng viên thành công!')
  }
  closeModal()
}

function handleDelete(id) {
  if (!confirm('Bạn có chắc muốn xóa ứng viên này?')) return
  store.deleteById(id)
  toast.success('✅ Xóa ứng viên thành công!')
}

function handleMenuAction(id) {
  if (id === 'delete-selected') {
    const ids = store.selectedIdList
    if (!ids.length) return
    if (!confirm(`Bạn có chắc muốn xóa ${ids.length} ứng viên đã chọn?`)) return
    store.deleteByIds(ids)
    toast.success(`✅ Đã xóa ${ids.length} ứng viên!`)
  } else {
    console.log('Menu action:', id, '| Selected:', store.selectedIdList)
  }
}
</script>
