import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Goods from '../views/Goods.vue'
import Category from '../views/Category.vue'
import User from '../views/User.vue'
import Gallery from '../views/Gallery.vue'

const routes = [
  { path: '/login', component: Login },
  { path: '/goods', component: Goods },
  { path: '/category', component: Category },
  { path: '/user', component: User },
  { path: '/gallery', component: Gallery },
  { path: '/', redirect: '/login' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router