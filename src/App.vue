<template>
  <AppHeader />
  <section class="layout">
    <AppSidebar :collapsed="sidebarCollapsed" @toggle="sidebarCollapsed = !sidebarCollapsed" />
    <router-view />
  </section>
  <AppToast />
</template>

<script setup>
import { ref } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import AppToast from '@/components/AppToast.vue'

// đóng mở sidebar
const sidebarCollapsed = ref(false)
</script>
