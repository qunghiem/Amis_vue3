<template>
  <button :class="btnClass" :disabled="disabled || loading" v-bind="$attrs">
    <!-- loading -->
    <span v-if="loading" class="ms-btn__spinner"></span>

    <!-- Icon Bên Trái -->
    <i
      v-if="icon && positionIcon === 'left' && !loading"
      :class="['ms-btn__icon', 'ms-btn__icon--left', icon]"
    ></i>

    <!-- Nội dung button -->
    <span class="ms-btn__content">
      <slot></slot>
    </span>

    <!-- Icon Bên Phải -->
    <i
      v-if="icon && positionIcon === 'right' && !loading"
      :class="['ms-btn__icon', 'ms-btn__icon--right', icon]"
    ></i>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'primary',
  },
  size: {
    type: String,
    default: 'medium',
  },
  icon: {
    type: String,
    default: null,
  },
  positionIcon: {
    type: String,
    default: 'left',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const btnClass = computed(() => [
  'ms-btn',
  `ms-btn--${props.type}`,
  `ms-btn--${props.size}`,
  {
    'ms-btn--loading': props.loading,
  },
])
</script>

<style scoped>
/* base  */
.ms-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  border-radius: 5px;
  transition:
    color 0.15s,
    background-color 0.15s,
    border-color 0.15s;
  position: relative;
  user-select: none;
  vertical-align: middle;
}

.ms-btn:focus-visible {
  outline: 2px solid #2680eb;
  outline-offset: 2px;
}

/* size  */
.ms-btn--small {
  font-size: 14px;
  padding: 0 10px;
  height: 32px;
}

.ms-btn--medium {
  font-size: 15px;
  padding: 5px 12px;
}

.ms-btn--large {
  font-size: 15px;
  padding: 11px 20px;
}

/* TYPES  */

.ms-btn--primary {
  background-color: #2680eb;
  color: #ffffff;
  border: none;
  gap: 8px;
}
.ms-btn--primary:hover:not(:disabled) {
  background-color: #4097ff;
}

.ms-btn--danger {
  background-color: #ffffff;
  color: inherit;
  border: 1px solid #ffffff;
  gap: 8px;
}
.ms-btn--danger:hover:not(:disabled) {
  color: #4097ff;
  border-color: #4097ff;
}

.ms-btn--save {
  background-color: #2970f6;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  padding: 8px 20px;
  font-weight: 500;
  height: auto;
}
.ms-btn--save:hover:not(:disabled) {
  background-color: #1d63e0;
}

.ms-btn--cancel {
  background-color: transparent;
  color: #374151;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  padding: 8px 16px;
  font-weight: 400;
  height: auto;
}
.ms-btn--cancel:hover:not(:disabled) {
  background-color: #e5e7eb;
}

.ms-btn--edit {
  background-color: #f1f1f1;
  color: #2563eb;
  border: none;
  border-radius: 6px;
  width: 32px;
  height: 32px;
  padding: 0;
  font-size: 14px;
  font-weight: 400;
}
.ms-btn--edit:hover:not(:disabled) {
  background-color: #2563eb;
  color: #ffffff;
}

.ms-btn--delete {
  background-color: #f1f1f1;
  color: #dc2626;
  border: none;
  border-radius: 6px;
  width: 32px;
  height: 32px;
  padding: 0;
  font-size: 14px;
  font-weight: 400;
  margin-right: 8px;
}
.ms-btn--delete:hover:not(:disabled) {
  background-color: #dc2626;
  color: #ffffff;
}

.ms-btn--reupload {
  background-color: #ffffff;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 13px;
  padding: 0 14px;
  height: 32px;
  font-weight: 400;
  flex-shrink: 0;
  white-space: nowrap;
}
.ms-btn--reupload:hover:not(:disabled) {
  border-color: #2970f6;
  color: #2970f6;
}

.ms-btn--text {
  background-color: #ffffff;
  color: #1d63e0;
  border: none;
  font-size: 14px;
  padding: 0;
  font-weight: 400;
}
.ms-btn--text:hover:not(:disabled) {
  color: #0717f3;
}

/* warning */
.ms-btn--warning {
  background-color: #ff9800;
  color: #ffffff;
  border: none;
}
.ms-btn--warning:hover:not(:disabled) {
  background-color: #e68900;
}

/* DISABLED*/
.ms-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  pointer-events: none;
}

/*  LOADING */
.ms-btn--loading {
  cursor: not-allowed;
  pointer-events: none;
  opacity: 0.75;
}

.ms-btn__spinner {
  display: inline-block;
  width: 13px;
  height: 13px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: currentColor;
  border-radius: 50%;
  animation: ms-btn-spin 0.65s linear infinite;
  flex-shrink: 0;
  margin-right: 6px;
}

@keyframes ms-btn-spin {
  to {
    transform: rotate(360deg);
  }
}

/*  ICONS */
.ms-btn__icon {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
}
/* .ms-btn__icon--left {
  margin-right: 5px;
}
.ms-btn__icon--right {
  margin-left: 5px;
} */

/* CONTENT*/
.ms-btn__content {
  display: inline-flex;
  align-items: center;
}
</style>
