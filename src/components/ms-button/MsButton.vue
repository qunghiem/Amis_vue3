<template>
  <button
    :class="btnClass"
    :disabled="disabled || loading"
  >
    <!-- Icon Bên Trái  -->
    <i v-if="icon && positionIcon === 'left'"
      :class="['ms-btn__icon', 'ms-btn__icon--left', icon]"
    ></i>

    <!-- Nội dung button  -->
     <span class="ms-btn__content">
      <slot></slot>
     </span>

     <!-- Icon Bên Phải  -->
    <i v-if="icon && positionIcon === 'right'"
      :class="['ms-btn__icon', 'ms-btn__icon--right', icon]"
    ></i>


  </button>
</template>


<!-- JS  -->
<script setup>
import { computed } from 'vue';

const btnClass = computed(() => [
  'ms-btn',
  `ms-btn__${props.type}`,
  `ms-btn__${props.size}`,
  {
    'ms-btn__loading': props.loading,
  }

])

const props = defineProps({
  type: { // color, bg-color
    type: String,
    default: 'primary'
  },
  size: {
    type: String,
    default: 'medium'
  },
  icon: {
    type: String,
    default: null
  },
  positionIcon: {
    type: String,
    default: 'left'
  },
  loading: {
    type: Boolean,
    default: false
  },
  disbled: {
    type: Boolean,
    default: false
  }
})

</script>


<!-- CSS  -->
<style scoped>
/* btn chung */
.ms-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

/* btn type  */
.ms-btn__primary {
  background-color: #1976d2;
  color: white;
}

.ms-btn__danger {
  background-color: #dc3545;
  color: white;
}

.ms-btn__warning {
  background-color: #ff9800;
  color: white;
}

/* btn size  */
.ms-btn__small {
  font-size: 12px;
  padding: 4px 8px;
}

.ms-btn__medium {
  font-size: 14px;
  padding: 8px 16px;
}

.ms-btn__large {
  font-size: 16px;
  padding: 12px 24px;
}

/* btn icon chung */
.ms-btn__icon {
  display: inline-flex;
  align-items: center;
}

/* btn icon left */
.ms-btn__icon--left {
  margin-right: 8px;
}

/* btn icon right */
.ms-btn__icon--right {
  margin-left: 8px;
}

/* btn loading  */
.ms-btn__loading {
  cursor: not-allowed;
  opacity: 0.7;
}



</style>
