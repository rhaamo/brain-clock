import Vue from 'vue'
import VueRouter from 'vue-router'
import Tasks from '../views/Tasks.vue'
import Projects from '../views/Projects.vue'
import About from '../views/About.vue'
import Settings from '../views/Settings.vue'
import Dashboard from '../views/Dashboard.vue'

Vue.use(VueRouter)

  const routes = [
  { path: '/', name: 'home', component: Tasks },
  { path: '/projects', name: 'projects', component: Projects },
  { path: '/settings', name: 'settings', component: Settings },
  { path: '/dashboard', name: 'dashboard', component: Dashboard },
  { path: '/about', name: 'about', component: About }
]

const router = new VueRouter({
  mode: process.env.IS_ELECTRON ? 'hash' : 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
