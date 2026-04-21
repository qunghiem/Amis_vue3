<template>
  <MsModal
    v-model="localVisible"
    :title="isEditing ? 'Chỉnh sửa thông tin ứng viên' : 'Thêm ứng viên'"
    :width="currentCV ? 'min(1378px, calc(100vw - 48px))' : '600px'"
    :close-on-overlay="true"
    @update:modelValue="(v) => !v && $emit('close')"
  >
    <div :class="['cf-layout', { 'cf-layout--with-cv': currentCV }]">
      <!-- CV Preview -->
      <div v-if="currentCV" class="cf-cv-panel">
        <div class="cf-cv-panel__body">
          <div v-if="cvLoading" class="cv-loading">
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

      <!-- Form -->
      <div class="cf-form">
        <!-- CV Upload -->
        <div
          class="form__content__file"
          :class="{ 'has-cv': currentCV }"
          @click="!currentCV && cvInput?.click()"
        >
          <div class="upload-prompt" v-if="!currentCV">
            <div class="form__content__file__title">Kéo thả hoặc bấm vào đây để tải CV lên</div>
            <div class="form__content__file__note">
              Chấp nhận file .doc, .docx, .pdf, .jpg, .jpeg, .png
              <span>(Dung lượng &lt; 15 Mb)</span>
            </div>
          </div>
          <div class="cv-uploaded-info" v-if="currentCV">
            <div class="cv-uploaded-title">
              <div class="cv-file-icon"></div>
              <div>
                <div class="cv-info-name">{{ currentCV.name }}</div>
                <div class="cv-info-size">{{ currentCV.size }}</div>
              </div>
            </div>
            <MsButton type="reupload" @click.stop="cvInput?.click()">Tải CV khác</MsButton>
          </div>
          <input
            type="file"
            ref="cvInput"
            accept=".doc,.docx,.pdf,.jpg,.jpeg,.png"
            style="display: none"
            @change="onCVInputChange"
          />
        </div>

        <!-- Avatar + Fields -->
        <div class="form__content__infor">
          <!-- Avatar -->
          <div class="form__content_avatar">
            <div class="avatar-upload-wrapper" @click="avatarInput?.click()">
              <div class="form__content_img">
                <img v-if="currentAvatar" :src="currentAvatar" alt="Avatar" />
                <span v-else style="font-size: 12px; color: #9ca3af">Ảnh</span>
              </div>
              <div class="avatar-upload-overlay">
                <i class="fa-solid fa-camera overlay-icon"></i>
                <span class="overlay-text">Đổi ảnh</span>
              </div>
              <button
                v-if="currentAvatar"
                class="avatar-remove-btn visible"
                type="button"
                @click.stop="currentAvatar = null"
              >
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
            <input
              type="file"
              ref="avatarInput"
              accept="image/*"
              style="display: none"
              @change="onAvatarChange"
            />
          </div>

          <!-- Fields -->
          <div class="form__infor__user">
            <!-- Họ tên -->
            <MsInput
              ref="fullNameRef"
              label="Họ và tên"
              placeholder="Nhập họ và tên"
              v-model="form.fullName"
              :required="true"
              :error="errors.fullName"
            />

            <!-- Ngày sinh + Giới tính -->
            <div class="ms__flex">
              <MsInput
                ref="dobRef"
                label="Ngày sinh"
                type="date"
                v-model="form.dob"
                :required="true"
                :error="errors.dob"
              />
              <MsInput label="Giới tính" type="select" v-model="form.gender">
                <option value="">Chọn giới tính</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </MsInput>
            </div>

            <!-- SĐT + Email -->
            <div class="ms__flex">
              <MsInput
                ref="phoneRef"
                label="Số điện thoại"
                placeholder="Nhập số điện thoại"
                v-model="form.phoneNumber"
                :required="true"
                :error="errors.phoneNumber"
              />
              <MsInput
                ref="emailRef"
                label="Email"
                type="email"
                placeholder="Nhập email"
                v-model="form.email"
                :required="true"
                :error="errors.email"
              />
            </div>

            <!-- Quốc gia + Tỉnh/TP -->
            <div class="ms__flex">
              <MsInput
                ref="countryRef"
                label="Quốc gia"
                placeholder="Nhập quốc gia"
                v-model="form.country"
                :required="true"
                :error="errors.country"
              />
              <MsInput
                ref="provinceRef"
                label="Tỉnh / Thành phố"
                type="select"
                v-model="form.province"
                :required="true"
                :error="errors.province"
              >
                <option value="Hà Nội">Hà Nội</option>
                <option value="TP.HCM">TP.HCM</option>
                <option value="Đà Nẵng">Đà Nẵng</option>
                <option value="Hải Phòng">Hải Phòng</option>
              </MsInput>
            </div>

            <!-- Phường/Xã + Địa chỉ -->
            <div class="ms__flex">
              <MsInput label="Phường / Xã" type="select" v-model="form.ward">
                <option v-for="i in 8" :key="i" :value="String(i)">Xã {{ i }}</option>
              </MsInput>
              <MsInput label="Địa chỉ" placeholder="Nhập địa chỉ" v-model="form.address" />
            </div>

            <!-- Học vấn -->
            <div class="form__section">
              <div class="form__section__title">HỌC VẤN</div>
              <div class="ms__flex">
                <MsInput
                  label="Trình độ đào tạo"
                  placeholder="Nhập trình độ"
                  v-model="form.educationLevel"
                />
                <MsInput
                  label="Chuyên ngành"
                  placeholder="Nhập chuyên ngành"
                  v-model="form.major"
                />
              </div>
              <MsInput
                label="Nơi đào tạo"
                placeholder="Nhập nơi đào tạo"
                v-model="form.educationPlace"
              />
            </div>

            <!-- Tuyển dụng -->
            <div class="ms__flex">
              <MsInput label="Ngày ứng tuyển" type="date" v-model="form.applicationDate" />
              <MsInput label="Nguồn ứng viên" type="select" v-model="form.candidateSource">
                <option value="">Chọn nguồn</option>
                <option value="Facebook">Facebook</option>
                <option value="TopCV">TopCV</option>
                <option value="LinkedIn">LinkedIn</option>
              </MsInput>
            </div>

            <div class="ms__flex">
              <MsInput label="Nhân sự khai thác" type="select" v-model="form.recruiter">
                <option value="">Chọn nhân sự</option>
                <option value="1">Đinh Nga QTHT</option>
                <option value="2">Le Linh HR</option>
                <option value="3">Tung Duong QTHT</option>
              </MsInput>
              <MsInput
                label="Nơi làm việc gần đây"
                placeholder="Nhập nơi làm việc"
                v-model="form.recentWorkplace"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <MsButton type="cancel" @click="$emit('close')">Huỷ</MsButton>
      <MsButton type="save" @click="handleSave">Lưu</MsButton>
    </template>
  </MsModal>
</template>

<script setup>
import { ref, watch, computed, nextTick } from 'vue'
import MsModal from './ms-modal/MsModal.vue'
import MsButton from './ms-button/MsButton.vue'
import MsInput from './ms-input/MsInput.vue'

const props = defineProps({
  visible: Boolean,
  editingCandidate: Object,
})
const emit = defineEmits(['close', 'saved'])

const localVisible = computed(() => props.visible)
const isEditing = computed(() => !!props.editingCandidate)

const currentAvatar = ref(null)
const currentCV = ref(null)
const cvLoading = ref(false)
const errors = ref({})
const cvInput = ref(null)
const avatarInput = ref(null)
const fullNameRef = ref(null)
const dobRef      = ref(null)
const phoneRef    = ref(null)
const emailRef    = ref(null)
const countryRef  = ref(null)
const provinceRef = ref(null)

const fieldRefMap = {
  fullName:    fullNameRef,
  dob:         dobRef,
  phoneNumber: phoneRef,
  email:       emailRef,
  country:     countryRef,
  province:    provinceRef,
}

const EMPTY_FORM = () => ({
  fullName: '',
  phoneNumber: '',
  email: '',
  country: '',
  dob: '',
  gender: '',
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
})

const form = ref(EMPTY_FORM())

watch(
  () => props.visible,
  (v) => {
    if (!v) return
    errors.value = {}
    if (props.editingCandidate) {
      Object.assign(form.value, props.editingCandidate)
      currentAvatar.value = props.editingCandidate.avatar || null
      if (props.editingCandidate.cv) {
        currentCV.value = props.editingCandidate.cv
        cvLoading.value = true
      } else {
        currentCV.value = null
      }
    } else {
      form.value = EMPTY_FORM()
      currentAvatar.value = null
      currentCV.value = null
    }
  },
)

watch(() => form.value.fullName,    (v) => { if (v?.trim()) errors.value.fullName = '' })
watch(() => form.value.country,     (v) => { if (v?.trim()) errors.value.country  = '' })
watch(() => form.value.province,    (v) => { if (v)         errors.value.province = '' })
watch(() => form.value.dob,         (v) => { if (v && new Date(v) <= new Date()) errors.value.dob = '' })
watch(() => form.value.phoneNumber, (v) => { if (/^0[0-9]{9}$/.test(v)) errors.value.phoneNumber = '' })
watch(() => form.value.email,       (v) => { if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) errors.value.email = '' })

function onAvatarChange(e) {
  const file = e.target.files[0]
  if (!file || !file.type.startsWith('image/')) return
  const reader = new FileReader()
  reader.onload = (ev) => (currentAvatar.value = ev.target.result)
  reader.readAsDataURL(file)
  e.target.value = ''
}

const CV_EXT = ['.doc', '.docx', '.pdf', '.jpg', '.jpeg', '.png']
const CV_MAX = 15 * 1024 * 1024

function formatSize(bytes) {
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

function onCVInputChange(e) {
  const file = e.target.files[0]
  if (!file) return
  const ext = '.' + file.name.split('.').pop().toLowerCase()
  if (!CV_EXT.includes(ext)) return alert('File không hợp lệ')
  if (file.size > CV_MAX) return alert('File vượt quá 15MB')
  const reader = new FileReader()
  reader.onload = (ev) => {
    currentCV.value = {
      name: file.name,
      size: formatSize(file.size),
      type: file.type,
      dataUrl: ev.target.result,
    }
    cvLoading.value = true
  }
  reader.readAsDataURL(file)
  e.target.value = ''
}

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
  if (!validate()) {
    const ORDER = ['fullName', 'dob', 'phoneNumber', 'email', 'country', 'province']
    const firstKey = ORDER.find((k) => errors.value[k])
    if (firstKey) nextTick(() => fieldRefMap[firstKey]?.value?.focus())
    return
  }


  emit('saved', {
    ...form.value,
    avatar: currentAvatar.value,
    cv: currentCV.value,
    employeeId: props.editingCandidate?.employeeId,
  })
}
</script>

<style scoped>
.cf-layout {
  display: flex;
}
.cf-layout--with-cv {
  gap: 0;
}

.cf-cv-panel {
  flex: 1;
  min-width: 0;
  border-right: 1px solid #e5e7eb;
  background: #f8f9fb;
  display: flex;
  flex-direction: column;
  min-height: 400px;
}

.cf-cv-panel__body {
  flex: 1;
  overflow: hidden;
  position: relative;
  min-height: 400px;
}

.cf-cv-panel__body iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}

.cf-form {
  width: 100%;
  min-width: 420px;
  max-width: 550px;
}

.cf-layout:not(.cf-layout--with-cv) .cf-form {
  max-width: 100%;
}

/* Flex row cho các cặp field */
.ms__flex {
  display: flex;
  gap: 16px;
  margin-top: 5px;
}
.ms__flex > * {
  flex: 1;
}
</style>
