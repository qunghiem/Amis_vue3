<template>
  <div class="content_body">
    <div class="table-wrapper">
      <table class="candidate-table">
        <thead>
          <tr>
            <th class="checkbox">
              <input type="checkbox" :checked="allPageChecked" @change="toggleAll" />
            </th>
            <th class="td_fullName">Họ và tên</th>
            <th class="td_phone">Số điện thoại</th>
            <th class="td_candidate-source">Nguồn ứng viên</th>
            <th class="td_email">Email</th>
            <th class="td_recruitment-campaign">Chiến dịch tuyển dụng</th>
            <th class="td_position">Vị trí tuyển dụng</th>
            <th class="td_job-posting">Tin tuyển dụng</th>
            <th class="td_recruitment-stage">Vòng tuyển dụng</th>
            <th class="td_evaluation">Đánh giá</th>
            <th>Quốc gia</th>
            <th>Tỉnh / Thành phố</th>
            <th>Phường / Xã</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!candidates.length">
            <td colspan="14" style="text-align:center;padding:40px;color:#888;">Chưa có ứng viên nào</td>
          </tr>
          <tr v-for="c in candidates" :key="c.employeeId">
            <td class="checkbox">
              <input type="checkbox" :data-id="c.employeeId" :checked="store.isSelected(c.employeeId)" @change="store.toggleSelect(c.employeeId)" />
            </td>
            <td>
              <div class="avatar-cell">
                <img class="avatar" :src="c.avatar || store.DEFAULT_AVATAR" alt="">
                {{ c.fullName || '--' }}
              </div>
            </td>
            <td>{{ c.phoneNumber || '--' }}</td>
            <td>{{ c.candidateSource || '--' }}</td>
            <td :title="c.email">{{ c.email || '--' }}</td>
            <td>{{ c.recruitmentCampaign || '--' }}</td>
            <td>{{ c.position || '--' }}</td>
            <td>{{ c.jobPosting || '--' }}</td>
            <td>{{ c.recruitmentStage || '--' }}</td>
            <td>{{ c.evaluation || '--' }}</td>
            <td>{{ c.country || '--' }}</td>
            <td>{{ c.province || '--' }}</td>
            <td>{{ c.ward || '--' }}</td>
            <td class="col-action">
              <button class="btn-action btn-edit" :data-id="c.employeeId" @click.stop="$emit('edit', c.employeeId)" title="Sửa">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button class="btn-action btn-delete" :data-id="c.employeeId" @click.stop="$emit('delete', c.employeeId)" title="Xóa">
                <i class="fa-solid fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCandidateStore } from '@/stores/candidateStore'

const props = defineProps({ candidates: Array })
defineEmits(['edit', 'delete'])

const store = useCandidateStore()

const allPageChecked = computed(() =>
  props.candidates.length > 0 && props.candidates.every(c => store.isSelected(c.employeeId))
)

function toggleAll(e) {
  const ids = props.candidates.map(c => c.employeeId)
  if (e.target.checked) store.selectAll(ids)
  else store.unselectAll()
}
</script>
