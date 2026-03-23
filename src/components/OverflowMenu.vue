<template>
  <div class="overflow-menu" ref="containerRef">
    <!-- visible buttons -->
    <div class="overflow-menu__visible" ref="visibleRef">
      <button
        v-for="item in visibleItems"
        :key="item.id"
        :id="item.id"
        class="btn-selected"
        :data-id="item.id"
        @click="emit('action', item.id)"
      >
        {{ item.label }}
      </button>
    </div>

    <div
      class="overflow-menu__more-btn"
      :class="{ open: dropdownOpen }"
      v-if="overflowItems.length"
    >
      <button class="overflow-menu__trigger" @click.stop="dropdownOpen = !dropdownOpen"></button>
      <div class="overflow-menu__dropdown">
        <div
          v-for="item in overflowItems"
          :key="item.id"
          class="overflow-menu__dropdown-item"
          :data-id="item.id"
          @click="handleDropdownClick(item.id)"
        >
          {{ item.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const emit = defineEmits(['action'])

const MENU_ITEMS = [
  { id: 'send-email', label: 'Gửi email' },
  { id: 'tag-manager', label: 'Quản lý thẻ' },
  { id: 'create-job', label: 'Tạo công việc' },
  { id: 'add-campaign', label: 'Thêm vào chiến dịch' },
  { id: 'to-talent-pool', label: 'Chuyển vào kho tiềm năng' },
  { id: 'move-news', label: 'Chuyển đến tin khác' },
  { id: 'bulk-update', label: 'Cập nhật hàng loạt' },
  { id: 'download-cv', label: 'Tải xuống CV' },
  { id: 'export', label: 'Xuất khẩu' },
  { id: 'delete-selected', label: 'Xóa ứng viên đã chọn' },
]

const containerRef = ref(null)
const visibleRef = ref(null)
const dropdownOpen = ref(false)
const visibleItems = ref([...MENU_ITEMS])
const overflowItems = ref([])

// Cache measured widths
const widthCache = {}
function measureWidth(label) {
  if (widthCache[label]) return widthCache[label]
  const ghost = document.createElement('button')
  ghost.className = 'btn-selected'
  ghost.style.cssText = 'position:absolute;visibility:hidden;top:-9999px;white-space:nowrap;'
  ghost.textContent = label
  document.body.appendChild(ghost)
  const w = ghost.getBoundingClientRect().width + 6
  document.body.removeChild(ghost)
  widthCache[label] = w
  return w
}

function recalc() {
  if (!containerRef.value) return
  const totalWidth = containerRef.value.getBoundingClientRect().width
  const MORE_BTN = 90,
    GAP = 6

  const totalAll = MENU_ITEMS.reduce((s, item) => s + measureWidth(item.label), 0)

  if (totalAll <= totalWidth) {
    visibleItems.value = [...MENU_ITEMS]
    overflowItems.value = []
    return
  }

  const budget = totalWidth - MORE_BTN - GAP
  const vis = [],
    ovf = []
  let used = 0
  for (const item of MENU_ITEMS) {
    const w = measureWidth(item.label)
    if (used + w <= budget) {
      vis.push(item)
      used += w
    } else ovf.push(item)
  }
  visibleItems.value = vis
  overflowItems.value = ovf
}

function handleDropdownClick(id) {
  dropdownOpen.value = false
  emit('action', id)
}

function closeDropdown(e) {
  if (containerRef.value && !containerRef.value.contains(e.target)) {
    dropdownOpen.value = false
  }
}

let ro
onMounted(() => {
  nextTick(recalc)
  ro = new ResizeObserver(recalc)
  if (containerRef.value) ro.observe(containerRef.value)
  document.addEventListener('click', closeDropdown)
})
onUnmounted(() => {
  ro?.disconnect()
  document.removeEventListener('click', closeDropdown)
})
</script>
