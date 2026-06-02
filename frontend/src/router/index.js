import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../views/LandingPage.vue'
import AboutPage from '../views/AboutPage.vue' 
import ContactPage from '../views/ContactPage.vue' 
import LoginAgent from '../views/LoginAgent.vue' 
import Dashboard from '../views/Dashboard.vue'
import KelolaProperti from '../views/PropertyList.vue'
import ManajemenUser from '../views/ManajemenUser.vue'

const routes = [
  // Rute Publik (meta isAdmin: false atau tidak perlu meta)
  { path: '/', name: 'LandingPage', component: LandingPage, meta: { isAdmin: false }},
  { path: '/about', name: 'AboutPage', component: AboutPage, meta: { isAdmin: false }},
  { path: '/contact', name: 'ContactPage', component: ContactPage, meta: { isAdmin: false }},
  { path: '/agent/login', name: 'LoginAgent', component: LoginAgent, meta: { isAdmin: false }},
  
  // Rute Admin
  { path: '/admin', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true, isAdmin: true }},
  { path: '/admin/properties', name: 'PropertyList', component: KelolaProperti, meta: { requiresAuth: true, isAdmin: true }},
  { path: '/admin/users', name: 'ManajemenUser', component: ManajemenUser, meta: { requiresAuth: true, isAdmin: true, requiresSuperAdmin: true }}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const isLoggedIn = !!user.id // Mengecek apakah data user ada di storage
  
  // 1. Jika halaman butuh Auth tapi tidak ada data user, paksa ke Login
  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/agent/login')
  } 
  // 2. Jika halaman butuh SuperAdmin (role_id 1), tapi user role_id-nya bukan 1
  else if (to.meta.requiresSuperAdmin && (user.role_id !== 1)) {
    next({ path: '/admin', query: { error: 'unauthorized' } }) // Kirim parameter error
  } 
  // 3. Jika sudah login dan mencoba ke halaman login, lempar ke dashboard
  else if (to.path === '/agent/login' && isLoggedIn) {
    next('/admin')
  }
  // 4. Selebihnya izinkan
  else {
    next()
  }
})

export default router