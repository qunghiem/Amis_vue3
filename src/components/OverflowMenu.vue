<template>
  <div class="overflow-menu" ref="containerRef">
     <!-- // Các button hiển thị trực tiếp trên thanh, không bị ẩn vào menu dropdown -->
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

    <!-- Nút More -->
    <div
      class="overflow-menu__more-btn"
      :class="{ open: dropdownOpen }"
      v-if="overflowItems.length"
    >
      <button class="overflow-menu__trigger" @click.stop="dropdownOpen = !dropdownOpen"></button>
      <!--Menu bị ẩn -->
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

//
const containerRef = ref(null)
//
const visibleRef = ref(null)
//
const dropdownOpen = ref(false)
// Các item hiển thị trực tiếp trên thanh, không bị ẩn vào menu dropdown
const visibleItems = ref([...MENU_ITEMS])
// Các item bị ẩn vào menu dropdown
const overflowItems = ref([])

const widthCache = {}

// Hàm đo chiều rộng của button lúc hiện dựa vào label
function measureWidth(label) {
  if (widthCache[label]) return widthCache[label]
  // Tạo một button ảo để đo chiều rộng của label, sau đó cache kết quả để lần sau không phải tạo lại
  const ghost = document.createElement('button')
  // Đặt class giống với button thật
  ghost.className = 'btn-selected'
  // Đặt style để button không ảnh hưởng layout và có cùng font, padding như button thật
  ghost.style.cssText = 'position:absolute;visibility:hidden;top:-9999px;white-space:nowrap;'
  ghost.textContent = label
  // Thêm button ảo vào DOM để đo kích thước
  document.body.appendChild(ghost)
  // Đo chiều rộng của button ảo, cộng thêm một khoảng padding để đảm bảo không bị chèn ép
  const w = ghost.getBoundingClientRect().width + 6
  // Loại bỏ button ảo sau khi đo xong
  document.body.removeChild(ghost)
  // Cache kết quả đo được để lần sau không phải tạo lại button ảo
  widthCache[label] = w
  return w
}

// Hàm tính toán lại việc phân bổ các item vào visibleItems và overflowItems dựa trên kích thước của container
// quyết định item nào ẩn/ item nào sẽ hiện
function recalc() {
  //
  if (!containerRef.value) return

  // Nếu tổng chiều rộng của container
  const totalWidth = containerRef.value.getBoundingClientRect().width

  const MORE_BTN = 90,
    GAP = 6

  // Ước tính tổng độ rộng của các mục
  const totalAll = MENU_ITEMS.reduce((s, item) => s + measureWidth(item.label), 0)

  // nếu độ rộng Container mà đủ để hiển thị hết thì k cần ẩn
  if (totalAll <= totalWidth) {
    visibleItems.value = [...MENU_ITEMS]
    overflowItems.value = []
    return
  }
  // Nếu k đủ, thì tính phần width còn lại sau khi trừ nút More và Gap
  const budget = totalWidth - MORE_BTN - GAP

  const vis = [],
    ovf = []

  // tạo biến lưu độ rộng đã dùng
  let used = 0

  // duyệt từng item để đẩy vào visibleItems nếu còn đủ chỗ, ngược lại đẩy vào overflowItems
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

// Xử lý khi click vào item trong dropdown menu: mới làm nút Xóa
function handleDropdownClick(id) {
  dropdownOpen.value = false
  emit('action', id)
}

// Xử lý khi click ra bên ngoài menu dropdown sẽ đóng menu dropdown
function closeDropdown(e) {
  if (containerRef.value && !containerRef.value.contains(e.target)) {
    dropdownOpen.value = false
  }
}

// Menu dropdown sẽ tự động đóng khi kích thước của container thay đổi (ví dụ khi resize cửa sổ trình duyệt)
let ro
// Sử dụng ResizeObserver để theo dõi sự thay đổi kích thước của container
onMounted(() => {
  nextTick(recalc)
  // tạo một người theo dõi resize để gọi lại recalc
  ro = new ResizeObserver(recalc)
  // nếu containerRef đã có giá trị thì bắt đầu theo dõi sự thay đổi kích thước của container
  if (containerRef.value) ro.observe(containerRef.value)
  
  document.addEventListener('click', closeDropdown)
})
// Cleanup khi component bị unmounted: ngắt kết nối ResizeObserver và remove event listener
onUnmounted(() => {
  ro?.disconnect()
  document.removeEventListener('click', closeDropdown)
})
</script>
