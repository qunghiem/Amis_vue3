<template>
  <div class="ms-table__wrapper">
    <table class="ms-table">
      <!-- Header -->
      <thead>
        <tr>
          <!-- Ô check box all  -->
          <th v-if="selectable" class="ms-table__th ms-table__checkbox">
            <input type="checkbox" :checked="allChecked" @change="$emit('toggle-all', $event)">
          </th>

          <!-- Các ô còn lại  -->
           <th v-for="col in columns" :key="col.key" class="ms-table__th"
           :style="col.width ? { width: col.width } : {}">
              {{ col.label }}
           </th>
        </tr>
      </thead>

      <!-- Body -->
      <tbody>
        <!-- Khi không có dữ liệu -->
          <tr v-if="!rows.length">
            <td :colspan = "totalCols" class="ms-table__empty">
              <slot name="empty"> {{ emptyText }}</slot>
            </td>
         </tr>
         <!-- khi có dữ liệu -->
          <tr
          v-for="(row, rowIndex) in rows"
          :key="row[rowKey] ?? rowIndex"
          class="ms-table__row"
        >
          <!-- Checkbox -->
          <td v-if="selectable" class="ms-table__td ms-table__checkbox">
            <input
              type="checkbox"
              :checked="isSelected(row[rowKey])"
              @change="$emit('toggle-row', row[rowKey], $event)"
              @click.stop
            />
          </td>

          <!-- các ô còn lại -->
          <td
            v-for="col in columns"
            :key="col.key"
            class="ms-table__td"
            :title="col.showTitle ? String(row[col.key] ?? '') : undefined"
          >
            <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
              {{ row[col.key] ?? '--' }}
            </slot>
          </td>

          <!-- Action  -->
          <td v-if="$slots.actions" class="ms-table__td ms-table__col-action">
            <slot name="actions" :row="row" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // danh sách cột: key, lable, width
  columns: {
    type: Array,
    required: true
  },
  // Danh sách dữ liệu: vd candidates
  rows: {
    type: Array,
    default: () => [],
  },
  // field dùng làm key cho mỗi row: vd employeeId
  rowKey: {
    type: String,
    default: 'id' ,
  },
  // Có hiển thị checkbox không
  selectable: {
    type: Boolean,
    default: false,
  },
  // tất cả row hiện tại đã được tích chọn chưa
  allChecked: {
    type: Boolean,
    default: false,
  },
  // Hàm kiểm tra row có đang được chọn không
   isSelected: {
    type: Function,
    default: () => false,
  },
  // Text khi không có dữ liệu
  emptyText: {
    type: String,
    default: 'Không có dữ liệu',
  },
})

defineEmits(['toggle-all', 'toggle-row', 'row-click'])


const totalCols = computed(() => {
  let count = props.columns.length
  if (props.selectable) count++
  return count
})
</script>

<style scoped>
.ms-table__wrapper {
  max-width: 100%;
  flex: 1;
  overflow-y: auto;
  overflow-x: auto;
}

.ms-table {
  border-collapse: collapse;
  font-size: 14px;
  width: max-content;
  min-width: 100%;
}

.ms-table__th {
  font-size: 14px;
  font-weight: 600;
  border-bottom: 1px solid #ddd;
  border-right: 1px solid #f5f5f5;
  border-top: 1px solid #ddd;
  text-align: left;
  padding: 15px;
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #f9fafb;
}

.ms-table__th:last-child {
  border-right: 0;
}

.ms-table__td {
  padding: 7.5px;
  border-bottom: 1px solid #ddd;
  text-align: left;
  overflow: hidden;
}

.ms-table__row:hover {
  background: #e1eeff;
  cursor: pointer;
}

.ms-table__row:hover .ms-table__checkbox {
  background: #e1eeff;
}

/* Checkbox cột sticky bên trái */
.ms-table__checkbox {
  position: sticky;
  left: 0;
  z-index: 9;
  background: #fff;
  text-align: center;
}

/* Cột action: ẩn, chỉ hiện khi hover row */
.ms-table__col-action {
  display: none;
  position: sticky;
  right: 0;
}

.ms-table__row:hover .ms-table__col-action {
  display: flex;
  align-items: center;
  background: #e1eeff;
}

/* Empty state */
.ms-table__empty {
  text-align: center;
  padding: 40px;
  color: #888;
}
</style>
