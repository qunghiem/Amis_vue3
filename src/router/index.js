import { createRouter, createWebHistory } from 'vue-router'
import CandidatePage from '@/pages/CandidatePage.vue'
import NewsPage from '@/pages/NewsPage.vue'
import InventoryItemList from '@/views/DI/InventoryItem/InventoryItemList.vue'

const routes = [
  { path: '/', redirect: '/candidates' },
  { path: '/candidates', component: CandidatePage },
  { path: '/news', component: NewsPage },
  { path: '/inventoryitemlist', component: InventoryItemList },

]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
