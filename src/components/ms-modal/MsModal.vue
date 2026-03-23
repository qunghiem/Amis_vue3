<template>
  <teleport to="body">
    <!-- Click ra bên ngoài form thì đóng Modal -->
    <div v-if="modelValue" class="ms-modal__overlay" @click.self="onOverlayClick">
      <div class="ms-modal__container" :style="{ width }">
        <!-- Header -->
        <div class="ms-modal__header">
          <slot name="header">
            <span class="ms-modal__title">
              {{ title }}
            </span>
          </slot>
          <!-- Nút đóng: click thì gửi sự kiện update để đóng -->
          <!-- Truyền giá trị mới -->
          <button class="ms-modal__close" @click="$emit('update:modelValue', false)">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Body -->
        <div class="ms-modal__body">
          <slot />
        </div>

        <!-- Footer -->
        <div v-if="$slots.footer" class="ms-modal__footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
const props = defineProps({
  // quyết định có render modal k
  modelValue: {
    type: Boolean,
    default: false,
  },
  width: {
    type: String,
    default: '600px',
  },
  // kiểm soát có đóng modal k
  closeOnOverlay: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: '' },
})

const emit = defineEmits(['update: modelValue'])

// click đóng modal
function onOverlayClick() {
  if (props.closeOnOverlay) emit('update: modelValue', false)
}
</script>

<style scoped>
.ms-modal__overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
}

.ms-modal__container {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  overflow: hidden;
}

.ms-modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px 16px;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
}

.ms-modal__title {
  font-size: 18px;
  font-weight: 600;
  color: #1f1f1f;
}

.ms-modal__close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #6b7280;
  font-size: 18px;
  display: flex;
  align-items: center;
  border-radius: 4px;
  transition:
    background 0.15s,
    color 0.15s;
}
.ms-modal__close:hover {
  background: #f3f4f6;
  color: #111;
}

.ms-modal__body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.ms-modal__footer {
  padding: 12px 24px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  background: #f9fafb;
  flex-shrink: 0;
}
</style>
