<template>
  <div class="form" :class="{ 'display-block': visible }" id="form__add">
    <!-- khi click bên ngoài modal, close modal  -->
    <div class="form__bg" @click="$emit('close')"></div>

    <!-- nếu có CV -->
    <div class="form__wrapper" v-if="currentCV">
      <!-- CV Preview Panel -->
      <div class="form__cv-preview-panel">
        <div class="cv-panel__body">
          <!-- loading -->
          <div class="cv-loading" v-if="cvLoading" id="cv-iframe-loading">
            <div class="spinner"></div>
            <span>Đang tải CV...</span>
          </div>
          <iframe
            v-if="currentCV.type === 'application/pdf'"
            :src="currentCV.dataUrl"
            title="CV"
            @load="cvLoading = false"
          ></iframe>
        </div>
      </div>

      <!-- Form edit/add -->
      <div class="form__container active">
        <FormInner
          :title="title"
          :form="form"
          :errors="errors"
          :currentAvatar="currentAvatar"
          :currentCV="currentCV"
          @close="$emit('close')"
          @save="handleSave"
          @avatar-change="onAvatarChange"
          @avatar-remove="onAvatarRemove"
          @cv-change="onCVChange"
          @cv-reupload="triggerCVInput"
        />
      </div>
    </div>

    <!-- nếu không có CV -->
    <div class="form__container" v-else>
      <FormInner
        :title="title"
        :form="form"
        :errors="errors"
        :currentAvatar="currentAvatar"
        :currentCV="currentCV"
        @close="$emit('close')"
        @save="handleSave"
        @avatar-change="onAvatarChange"
        @avatar-remove="onAvatarRemove"
        @cv-change="onCVChange"
        @cv-reupload="triggerCVInput"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import FormInner from './FormInner.vue'

const props = defineProps({
  visible: Boolean,
  editingCandidate: Object,
})

const emit = defineEmits(['close', 'saved'])

const title = ref('Thêm ứng viên')
const currentAvatar = ref(null)
const currentCV = ref(null)
const cvLoading = ref(false)
const errors = ref({})

// reset form
const EMPTY_FORM = () => ({
  fullName: '',
  phoneNumber: '',
  email: '',
  country: '',
  dob: '',
  gender: '',
  area: '',
  province: 'Hà Nội',
  ward: '1',
  address: '',
  educationLevel: '',
  educationPlace: '',
  major: '',
  applicationDate: new Date().toISOString().slice(0, 10),
  candidateSource: '',
  recentWorkplace: '',
  recruiter: '',
  collaborator: '',
})
const form = ref(EMPTY_FORM())

// khi mở form
watch(
  () => props.visible,
  (v) => {
    if (!v) return
    errors.value = {}
    // nếu mở form edit
    if (props.editingCandidate) {
      title.value = 'Chỉnh sửa thông tin ứng viên'
      // copy các data vào form
      Object.assign(form.value, props.editingCandidate)
      currentAvatar.value = props.editingCandidate.avatar || null
      if (props.editingCandidate.cv) {
        currentCV.value = props.editingCandidate.cv
        cvLoading.value = true
      } else {
        currentCV.value = null
      }
    } else { // nếu mở form thêm
      title.value = 'Thêm ứng viên'
      // reset form
      form.value = EMPTY_FORM()
      currentAvatar.value = null
      currentCV.value = null
    }
  },
)

// Avatar
function onAvatarChange(dataUrl) {
  currentAvatar.value = dataUrl
}
function onAvatarRemove() {
  currentAvatar.value = null
}

//CV
function onCVChange(cvObj) {
  currentCV.value = cvObj
  cvLoading.value = true
}

// Validate
function validate() {
  const e = {}
  if (!form.value.fullName) e.fullName = 'Vui lòng nhập họ và tên'
  if (!form.value.phoneNumber) e.phoneNumber = 'Vui lòng nhập số điện thoại'
  else if (!/^0[0-9]{9}$/.test(form.value.phoneNumber)) e.phoneNumber = 'Số điện thoại không hợp lệ'
  if (!form.value.email) e.email = 'Vui lòng nhập email'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) e.email = 'Email không hợp lệ'
  if (!form.value.country) e.country = 'Vui lòng nhập quốc gia'
  if (!form.value.province) e.province = 'Vui lòng chọn tỉnh / thành phố'
  if (!form.value.dob) e.dob = 'Vui lòng nhập ngày sinh'
  else if (new Date(form.value.dob) > new Date()) e.dob = 'Ngày sinh không hợp lệ'
  errors.value = e
  return Object.keys(e).length === 0
}

function handleSave() {
  if (!validate()) return
  emit('saved', {
    ...form.value,
    avatar: currentAvatar.value,
    cv: currentCV.value,
    employeeId: props.editingCandidate?.employeeId,
  })
}
</script>
