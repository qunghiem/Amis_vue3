<template>
  <aside class="layout__sidebar" :class="{ collapsed }">
    <div class="sidebar__item">
      <div class="sidebar__container">
        <div class="sidebar__icon ai-agent"></div>
        <div class="sidebar-text">AI Agent <span>New</span></div>
      </div>
    </div>
    <div class="sidebar__item">
      <div class="sidebar__container" :class="{ 'sidebar--acitve': $route.path === '/news' }" @click="$router.push('/news')">
        <div class="sidebar__icon news-candidate"></div>
        <div class="sidebar-text">Tin tuyển dụng</div>
      </div>
    </div>
    <div class="sidebar__item">
      <div class="sidebar__container" :class="{ 'sidebar--acitve': $route.path === '/candidates' }" @click="$router.push('/candidates')">
        <div class="sidebar__icon candidate"></div>
        <div class="sidebar-text">Ứng viên</div>
      </div>
    </div>
    <div class="sidebar__item">
      <div class="sidebar__container">
        <div class="sidebar__icon calendar"></div>
        <div class="sidebar-text">Lịch</div>
      </div>
    </div>
    <div class="sidebar__item">
      <div class="sidebar__container">
        <div class="sidebar__icon talent-pool"></div>
        <div class="sidebar-text">Kho tiềm năng</div>
      </div>
    </div>
    <div class="sidebar__item">
      <div class="sidebar__container">
        <div class="sidebar__icon recruitment-campaign"></div>
        <div class="sidebar-text">Chiến dịch tuyển dụng</div>
      </div>
    </div>
    <div class="sidebar__item">
      <div class="sidebar__container">
        <div class="sidebar__icon jobs"></div>
        <div class="sidebar-text">Công việc</div>
      </div>
    </div>

    <button class="sidebar__toggle" @click="$emit('toggle')">
      <span class="icon-toogle"></span>
      <span class="toggle-label">Thu gọn</span>
    </button>
  </aside>
</template>

<script setup>
defineProps({ collapsed: Boolean })
defineEmits(['toggle'])
</script>
