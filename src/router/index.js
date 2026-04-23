import { createRouter, createWebHistory } from 'vue-router'
import CandidatePage from '@/pages/CandidatePage.vue'
import NewsPage from '@/pages/NewsPage.vue'

const routes = [
  { path: '/', redirect: '/candidates' },
  { path: '/candidates', component: CandidatePage },
  { path: '/news', component: NewsPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
