<!-- <template>
 <div class="container-list">{{ text }}</div>

 <button @click="handleAdd">Them nhan vien moi</button>
</template>



<script>
import BaseList from '../../base/BaseList.js';
import { defineComponent, getCurrentInstance, ref } from 'vue';
// import CandidateForm from '@/components/CandidateForm.vue';

export default defineComponent({
  extends: BaseList,
  name: 'InventoryItemList',
  components: {
    // CandidateForm
  },

  setup() {
    const { proxy }  = getCurrentInstance();

    const text = ref('nxq');

    const store = ref({
      data: [],
      total: 0
    });
    // Hàm xử lý khi click thêm mới (điều hướng đến trang tạo mới)
    const handleAdd = () => {
      const me = proxy;
      console.log("Handle Add đã override thành công");
      // console.log(me);`

    }
    return {
      handleAdd,
      text,
      store
    };
  }
})
</script>

<style scoped>

</style> -->

<template>
 <h2>Danh sách mặt hàng</h2>
</template>
