<template>
  <div class="ms-input__wrapper">
    <!-- Label -->
    <label v-if="label" class="ms-input__label">
      {{ label }}
      <span v-if="required" class="ms-input__require">*</span>
    </label>

    <!-- Control -->
     <div class="ms-input__control">
      <!-- Select -->
       <select
        ref="fieldRef"
        v-if="type === 'select'"
        v-model="model"
        :class="['ms-input__field', { 'ms-input--invalid': error}]"
        v-bind="$attrs"
        @blur="emit('blur', $event)"
      >
          <slot></slot>
       </select>

       <!-- Input: text, gmail, phone, date,... -->
        <input
          ref="fieldRef"
          v-else
          v-model="model"
          :placeholder="placeholder"
          :class="['ms-input__field', { 'ms-input--invalid': error}]"
          v-bind="$attrs"
          :type="type"
          @blur="emit('blur', $event)"
        />
     </div>

     <div class="ms-input__error">
      {{ error }}
     </div>
  </div>

</template>

<script setup>
import { computed, ref  } from 'vue';

// Tắt tự động gán attr vào root element
defineOptions({
    inheritAttrs: false
})



const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  // type của input, select: 'text' | 'date' | 'email' | 'select' | ...
  type: {
    type: String,
    default: 'text',
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'blur'])

// theo dõi giá trị các ô input, select
const model = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})

const fieldRef = ref(null)
defineExpose({ focus: () => fieldRef.value?.focus() })

</script>

<style scoped>
.ms-input__wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ms-input__label {
  font-size: 13px;
  color: #374151;
  font-weight: 500;
}

.ms-input__require {
  color: red;
}

.ms-input__field {
  width: 100%;
  height: 36px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  padding: 0 10px;
  font-size: 13px;
  color: #1f2937;
  background-color: #fff;
  outline: none;
  font-family: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.ms-input__field:focus {
  border-color: #2970f6;
  box-shadow: 0 0 0 2px rgba(41, 112, 246, 0.1);
}

.ms-input__field::placeholder {
  color: #9ca3af;
}

.ms-input--invalid {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.15) !important;
}

.ms-input__error {
  font-size: 12px;
  color: #ef4444;
}
</style>

