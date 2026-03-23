<template>
  <div class="form__header">
    <div class="form__header__title">{{ title }}</div>
    <div class="mi__icon" @click="$emit('close')" style="cursor: pointer; padding: 4px">
      <i class="fa-solid fa-xmark" style="font-size: 18px; color: #6b7280"></i>
    </div>
  </div>

  <div class="form__content">
    <!-- CV Upload Zone -->
    <div
      class="form__content__file"
      :class="{ 'has-cv': currentCV, dragover: isDragging }"
      @click="!currentCV && cvInput?.click()"
      @dragover.prevent="isDragging = true"
      @dragleave="isDragging = false"
      @drop.prevent="onDrop"
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
          <div class="cv-file-icon">
            <i :class="`fa-solid ${cvIcon}`" style="font-size: 16px; display: none"></i>
          </div>
          <div class="cv-info-text">
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

    <div class="form__content__infor">
      <!-- Avatar -->
      <div class="form__content_avatar">
        <div class="avatar-upload-wrapper" @click="avatarInput?.click()">
          <div class="form__content_img" id="avatar-preview-box">
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
            @click.stop="$emit('avatar-remove')"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <input
          type="file"
          ref="avatarInput"
          accept="image/*"
          style="display: none"
          @change="onAvatarInputChange"
        />
      </div>

      <!-- Fields -->
      <div class="form__infor__user">
        <div class="ms__row">
          <label class="ms__label">Họ và tên <span class="ms__require">*</span></label>
          <div class="ms__input">
            <input
              id="input-fullName"
              type="text"
              placeholder="Nhập họ và tên"
              v-model="localForm.fullName"
              :class="{ 'is-invalid': errors.fullName }"
            />
            <div v-if="errors.fullName" class="field-error">{{ errors.fullName }}</div>
          </div>
        </div>
        <div class="ms__row ms__flex">
          <div>
            <label class="ms__label">Ngày sinh <span class="ms__require">*</span></label>
            <div class="ms__input">
              <input
                id="input-dob"
                type="date"
                v-model="localForm.dob"
                :class="{ 'is-invalid': errors.dob }"
              />
              <div v-if="errors.dob" class="field-error">{{ errors.dob }}</div>
            </div>
          </div>
          <div>
            <label class="ms__label">Giới tính <span class="ms__require">*</span></label>
            <div class="ms__input">
              <select id="input-gender" v-model="localForm.gender">
                <option value="">Chọn giới tính</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>
          </div>
        </div>
        <div class="ms__row">
          <label class="ms__label">Khu vực <span class="ms__require">*</span></label>
          <div class="ms__input"><input type="text" v-model="localForm.area" /></div>
        </div>
        <div class="ms__row ms__flex">
          <div>
            <label class="ms__label">Số điện thoại</label>
            <div class="ms__input">
              <input
                type="text"
                placeholder="Nhập số điện thoại"
                v-model="localForm.phoneNumber"
                :class="{ 'is-invalid': errors.phoneNumber }"
              />
              <div v-if="errors.phoneNumber" class="field-error">{{ errors.phoneNumber }}</div>
            </div>
          </div>
          <div>
            <label class="ms__label">Email</label>
            <div class="ms__input">
              <input
                type="email"
                placeholder="Nhập email"
                v-model="localForm.email"
                :class="{ 'is-invalid': errors.email }"
              />
              <div v-if="errors.email" class="field-error">{{ errors.email }}</div>
            </div>
          </div>
        </div>
        <div class="ms__row">
          <label class="ms__label">Quốc gia <span class="ms__require">*</span></label>
          <div class="ms__input">
            <input
              type="text"
              placeholder="Nhập quốc gia"
              v-model="localForm.country"
              :class="{ 'is-invalid': errors.country }"
            />
            <div v-if="errors.country" class="field-error">{{ errors.country }}</div>
          </div>
        </div>
        <div class="ms__row">
          <label class="ms__label">Tỉnh / Thành phố <span class="ms__require">*</span></label>
          <div class="ms__input">
            <select v-model="localForm.province" :class="{ 'is-invalid': errors.province }">
              <option value="Hà Nội">Hà Nội</option>
              <option value="TP.HCM">TP.HCM</option>
              <option value="Đà Nẵng">Đà Nẵng</option>
              <option value="Hải Phòng">Hải Phòng</option>
            </select>
            <div v-if="errors.province" class="field-error">{{ errors.province }}</div>
          </div>
        </div>
        <div class="ms__row">
          <label class="ms__label">Phường / Xã <span class="ms__require">*</span></label>
          <div class="ms__input">
            <select v-model="localForm.ward">
              <option v-for="i in 8" :key="i" :value="String(i)">Xã {{ i }}</option>
            </select>
          </div>
        </div>
        <div class="ms__row">
          <label class="ms__label">Địa chỉ <span class="ms__require">*</span></label>
          <div class="ms__input">
            <input type="text" placeholder="Nhập địa chỉ" v-model="localForm.address" />
          </div>
        </div>

        <div class="form__section">
          <div class="form__section__title">HỌC VẤN</div>
          <div class="ms__row ms__flex">
            <div><label class="ms__label">Trình độ đào tạo</label></div>
            <div>
              <div class="ms__input">
                <input
                  type="text"
                  placeholder="Nhập trình độ đào tạo"
                  v-model="localForm.educationLevel"
                />
              </div>
            </div>
          </div>
          <div class="ms__row ms__flex">
            <div><label class="ms__label">Nơi đào tạo</label></div>
            <div>
              <div class="ms__input">
                <input
                  type="text"
                  placeholder="Nhập nơi đào tạo"
                  v-model="localForm.educationPlace"
                />
              </div>
            </div>
          </div>
          <div class="ms__row ms__flex">
            <div><label class="ms__label">Chuyên ngành</label></div>
            <div>
              <div class="ms__input">
                <input type="text" placeholder="Nhập chuyên ngành" v-model="localForm.major" />
              </div>
            </div>
          </div>
          <div class="form__add">+ Thêm học vấn</div>
        </div>

        <div class="ms__row ms__flex">
          <div>
            <label class="ms__label">Ngày ứng tuyển <span class="ms__require">*</span></label>
            <div class="ms__input"><input type="date" v-model="localForm.applicationDate" /></div>
          </div>
          <div>
            <label class="ms__label">Nguồn ứng viên</label>
            <div class="ms__input">
              <select v-model="localForm.candidateSource">
                <option value="" disabled>Chọn nguồn ứng viên</option>
                <option value="Facebook">Facebook</option>
                <option value="TopCV">TopCV</option>
                <option value="LinkedIn">LinkedIn</option>
              </select>
            </div>
          </div>
        </div>
        <div class="ms__row ms__flex">
          <div>
            <label class="ms__label">Nhân sự khai thác</label>
            <div class="ms__input">
              <select v-model="localForm.recruiter">
                <option value="" disabled>Chọn nhân sự khai thác</option>
                <option value="1">Đinh Nga QTHT</option>
                <option value="2">Le Linh HR</option>
                <option value="3">Tung Duong QTHT</option>
                <option value="4">Khanh Huyen HR</option>
              </select>
            </div>
          </div>
          <div>
            <label class="ms__label">Cộng tác viên</label>
            <div class="ms__input">
              <select v-model="localForm.collaborator">
                <option value="" disabled>Chọn cộng tác viên</option>
                <option value="1">CTV 1</option>
                <option value="2">CTV 2</option>
                <option value="3">CTV 3</option>
              </select>
            </div>
          </div>
        </div>
        <div class="ms__row">
          <label class="ms__label">Nơi làm việc gần đây</label>
          <div class="ms__input">
            <input
              type="text"
              placeholder="Nhập nơi làm việc gần đây"
              v-model="localForm.recentWorkplace"
            />
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="form__footer">
    <MsButton type="cancel" @click="$emit('close')">Huỷ</MsButton>
    <MsButton type="save" @click="$emit('save')">Lưu</MsButton>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import MsButton from './ms-button/MsButton.vue'

const props = defineProps({
  title: String,
  form: Object,
  errors: Object,
  currentAvatar: String,
  currentCV: Object,
})
const emit = defineEmits(['close', 'save', 'avatar-change', 'avatar-remove', 'cv-change'])

const cvInput = ref(null)
const avatarInput = ref(null)
const isDragging = ref(false)

const localForm = computed(() => props.form)

const cvIcon = computed(() => {
  if (!props.currentCV) return ''
  if (props.currentCV.type === 'application/pdf') return 'fa-file-pdf'
  if (props.currentCV.type?.startsWith('image/')) return 'fa-file-image'
  return 'fa-file-word'
})

function onAvatarInputChange(e) {
  const file = e.target.files[0]
  if (!file) return
  if (!file.type.startsWith('image/')) { alert('Chỉ chấp nhận file ảnh!'); return }
  if (file.size > 5 * 1024 * 1024) { alert('Ảnh không được vượt quá 5MB!'); return }
  const reader = new FileReader()
  reader.onload = (ev) => emit('avatar-change', ev.target.result)
  reader.readAsDataURL(file)
  e.target.value = ''
}

const CV_EXT = ['.doc', '.docx', '.pdf', '.jpg', '.jpeg', '.png']
const CV_MAX = 15 * 1024 * 1024

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

function handleCVFile(file) {
  const ext = '.' + file.name.split('.').pop().toLowerCase()
  if (!CV_EXT.includes(ext)) { alert('Chỉ chấp nhận file .doc, .docx, .pdf, .jpg, .jpeg, .png'); return }
  if (file.size > CV_MAX) { alert('Dung lượng file không được vượt quá 15MB!'); return }
  const reader = new FileReader()
  reader.onload = (ev) =>
    emit('cv-change', { name: file.name, size: formatSize(file.size), type: file.type, dataUrl: ev.target.result })
  reader.readAsDataURL(file)
}

function onCVInputChange(e) {
  if (e.target.files[0]) handleCVFile(e.target.files[0])
  e.target.value = ''
}

function onDrop(e) {
  isDragging.value = false
  if (e.dataTransfer.files[0]) handleCVFile(e.dataTransfer.files[0])
}
</script>
