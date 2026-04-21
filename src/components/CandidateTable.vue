<template>
  <MsTable
    :columns="COLUMNS"
    :rows="candidates"
    row-key="employeeId"
    :selectable="true"
    :all-checked="allPageChecked"
    :is-selected="store.isSelected"
    empty-text="Chưa có ứng viên nào"
    @toggle-all="toggleAll"
    @toggle-row="(id) => store.toggleSelect(id)"
    @row-click="(row) => $emit('edit', row.employeeId)"
  >
    <!-- Avatar + Tên -->
    <template #cell-fullName="{ row }">
      <div class="avatar-cell">
        <img class="avatar" :src="row.avatar || store.DEFAULT_AVATAR" alt="" />
        {{ row.fullName || '--' }}
      </div>
    </template>

    <!-- Action buttons -->
    <template #actions="{ row }">
      <MsButton
        type="edit"
        icon="fa-solid fa-pen-to-square"
        title="Sửa"
        @click.stop="$emit('edit', row.employeeId)"
      />
      <MsButton
        type="delete"
        icon="fa-solid fa-trash"
        title="Xóa"
        @click.stop="$emit('delete', row.employeeId)"
      />
    </template>
  </MsTable>
</template>

<script setup>
import { computed } from 'vue'
import { useCandidateStore } from '@/stores/candidateStore'
import MsTable from './ms-table/MsTable.vue'
import MsButton from './ms-button/MsButton.vue'

const props = defineProps({ candidates: Array })
defineEmits(['edit', 'delete'])

const store = useCandidateStore()

const COLUMNS = [
  { key: 'fullName',            label: 'Họ và tên',              width: '264px' },
  { key: 'phoneNumber',         label: 'Số điện thoại',          width: '127px' },
  { key: 'candidateSource',     label: 'Nguồn ứng viên',         width: '151px' },
  { key: 'email',               label: 'Email',                  width: '236px', showTitle: true },
  { key: 'recruitmentCampaign', label: 'Chiến dịch tuyển dụng',  width: '188px' },
  { key: 'position',            label: 'Vị trí tuyển dụng',      width: '216px' },
  { key: 'jobPosting',          label: 'Tin tuyển dụng',         width: '244px' },
  { key: 'recruitmentStage',    label: 'Vòng tuyển dụng',        width: '160px' },
  { key: 'evaluation',          label: 'Đánh giá',               width: '120px' },
  { key: 'country',             label: 'Quốc gia',               width: '120px' },
  { key: 'province',            label: 'Tỉnh / Thành phố',       width: '150px' },
  { key: 'ward',                label: 'Phường / Xã',            width: '140px' },
]

// KIỂM TRA TẤT CẢ ĐÃ CHECKED CHƯA: TRUE, FALSE
// Nếu có ứng viên nào chưa được chọn thì allPageChecked sẽ là false, ngược lại nếu tất cả đều được chọn thì allPageChecked sẽ là true
const allPageChecked = computed(
  () =>
    props.candidates.length > 0 &&
    props.candidates.every((c) => store.isSelected(c.employeeId)),
)

// CLICK CHỌN TẤT CẢ
function toggleAll(e) {
  const ids = props.candidates.map((c) => c.employeeId)
  // Nếu đang checked thì uncheck tất cả, ngược lại thì check tất cả
  if (e.target.checked) store.selectAll(ids)
  else store.unselectAll()
}
</script>
