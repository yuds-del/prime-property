<template>
  <div v-if="!route.meta?.isAdmin" class="min-h-screen bg-white">
    <router-view />
  </div>

  <div v-else class="flex min-h-screen bg-zinc-950 font-sans text-zinc-100 antialiased selection:bg-[#C9A961]/30">
    <!-- Global Notification & Modal for Admin Layout -->
    <NotificationToast 
      :show="toast.show" 
      :message="toast.message" 
      :type="toast.type" 
      @close="toast.show = false" />

    <CustomModal 
      v-model="modal.show" 
      :title="modal.title" 
      :message="modal.message" 
      :is-confirm="true"
      @confirm="logoutAction" 
      @cancel="modal.show = false" />

    <aside :class="isSidebarCollapsed ? 'w-20' : 'w-64'"
      class="bg-[#1A1A1A] border-r border-zinc-800/80 p-4 flex flex-col justify-between shadow-xl fixed h-screen z-50 transition-all duration-300 ease-in-out">
      <div>
        <div class="flex items-center justify-between mb-8 pb-4 border-b border-zinc-800/60 h-14">

          <div v-if="!isSidebarCollapsed" class="flex items-center space-x-3 transition-opacity duration-200">
            <img src="./assets/logo-prime-property.png" alt="Prime Property Logo" class="h-8 w-auto object-contain" />
            <div>
              <h1 class="text-sm font-black tracking-wider text-white uppercase leading-none">PRIME <span
                  class="text-[#C9A961]">PROPERTY</span></h1>
              <p class="text-[9px] text-zinc-500 font-mono tracking-tight mt-0.5">Admin Portal v1.0</p>
            </div>
          </div>

          <div v-else class="w-full flex justify-center transition-opacity duration-200">
            <img src="./assets/logo-prime-property.png" alt="Prime Property Logo" class="h-7 w-auto object-contain"
              title="Prime Property Portal" />
          </div>

          <button @click="isSidebarCollapsed = !isSidebarCollapsed"
            class="text-zinc-400 hover:text-white p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition"
            :title="isSidebarCollapsed ? 'Buka Sidebar' : 'Tutup Sidebar'">
            <svg class="w-3.5 h-3.5 transform transition-transform duration-300"
              :class="{ 'rotate-180': isSidebarCollapsed }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M11 19l-7-7 7-7M19 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        <nav class="space-y-1.5">
          <router-link v-if="currentUser?.role_id === 1" to="/admin/users"
            class="flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-900/50"
            :class="isSidebarCollapsed ? 'justify-center' : 'space-x-3'"
            active-class="bg-[#C9A961] text-[#1A1A1A] font-bold shadow-lg shadow-[#C9A961]/10">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z">
              </path>
            </svg>
            <span v-if="!isSidebarCollapsed" class="truncate">Manajemen User</span>
          </router-link>
          <router-link to="/admin"
            class="flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group text-xs font-medium"
            :class="isSidebarCollapsed ? 'justify-center' : 'space-x-3'"
            active-class="bg-[#C9A961] text-[#1A1A1A] font-bold shadow-lg shadow-[#C9A961]/10"
            exact-active-class="bg-[#C9A961] text-[#1A1A1A] font-bold shadow-lg shadow-[#C9A961]/10">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M11 3.055A9.003 9.003 0 1020.945 13H11V3.055z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>
            </svg>
            <span v-if="!isSidebarCollapsed" class="truncate">Dashboard Overview</span>
          </router-link>

          <router-link to="/admin/properties"
            class="flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-900/50"
            :class="isSidebarCollapsed ? 'justify-center' : 'space-x-3'"
            active-class="bg-[#C9A961] text-[#1A1A1A] font-bold shadow-lg shadow-[#C9A961]/10">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4">
              </path>
            </svg>
            <span v-if="!isSidebarCollapsed" class="truncate">Kelola Properti</span>
          </router-link>
        </nav>
      </div>

      <div :class="isSidebarCollapsed ? 'items-center px-0' : 'px-2 space-y-4'" class="flex flex-col mb-4">
        <!-- AC-1.1 Redesigned Logout Button -->
        <button @click="handleLogout"
          class="flex items-center rounded-xl transition-all duration-300 group overflow-hidden border border-transparent shadow-sm"
          :class="isSidebarCollapsed 
            ? 'w-12 h-12 justify-center bg-zinc-900/30 hover:bg-red-950/20 hover:border-red-900/30' 
            : 'w-full px-4 py-3 bg-zinc-900/40 border-zinc-800/50 hover:bg-red-950/10 hover:border-red-900/30 space-x-3'">
          <svg class="w-5 h-5 flex-shrink-0 text-zinc-500 group-hover:text-[#B33A3A] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span v-if="!isSidebarCollapsed" class="text-[11px] font-black uppercase tracking-[0.15em] text-zinc-500 group-hover:text-[#B33A3A] transition-colors">
            Keluar Portal
          </span>
        </button>

        <div v-if="!isSidebarCollapsed"
          class="text-[10px] text-zinc-600 border-t border-zinc-800/40 pt-4 w-full text-center font-mono">
          &copy; 2026 Prime Property
        </div>
      </div>
    </aside>

    <div :class="isSidebarCollapsed ? 'pl-20' : 'pl-64'"
      class="flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out">
      <header
        class="bg-[#1A1A1A] border-b border-zinc-800/80 px-6 h-14 flex justify-between items-center sticky top-0 z-40 backdrop-blur-md bg-opacity-95">

        <div class="text-xs text-zinc-400 font-medium">
          Sistem Informasi Real Estate
          <span class="mx-1.5 text-zinc-700">|</span>
          <span class="text-zinc-500 font-mono">Internal Hub</span>
        </div>

        <div class="flex items-center space-x-2.5 bg-zinc-950/60 px-3 py-1.5 rounded-full border border-zinc-800/80">
          <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span class="text-[11px] font-bold tracking-wider uppercase text-zinc-300">
            {{ currentUser ? currentUser.nama_lengkap : 'Admin Mode' }}
          </span>
        </div>
      </header>

      <main class="p-6 bg-zinc-950 flex-1">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CustomModal from './components/CustomModal.vue'
import NotificationToast from './components/NotificationToast.vue'

const route = useRoute()
const router = useRouter()
const isSidebarCollapsed = ref(false)

// 1. Variabel state untuk user
const currentUser = ref(null)
const toast = reactive({ show: false, message: '', type: 'success' })
const modal = reactive({ show: false, title: '', message: '' })

// 2. Fungsi untuk sinkronisasi data
const checkUser = () => {
  const user = localStorage.getItem('user')
  currentUser.value = user ? JSON.parse(user) : null
}

// 3. Lifecycle hooks
onMounted(() => {
  checkUser() // Load data saat komponen pertama kali dimuat
  window.addEventListener('auth-changed', checkUser) // Mendengarkan event dari LoginAgent
})

// Watcher untuk menangani error dari router (opsional)
onMounted(() => {
  if (route.query.error === 'unauthorized') {
    triggerToast('Akses ditolak! Area khusus Superadmin.', 'error')
  }
})

onUnmounted(() => {
  window.removeEventListener('auth-changed', checkUser)
})

// 4. Logout
const handleLogout = async () => {
  modal.title = 'Konfirmasi Keluar'
  modal.message = 'Apakah Anda yakin ingin mengakhiri sesi dan keluar dari portal agent?'
  modal.show = true
}

const triggerToast = (msg, type = 'success') => {
  toast.message = msg
  toast.type = type
  toast.show = true
  setTimeout(() => { toast.show = false }, 3000)
}

const logoutAction = async () => {
  modal.show = false
  try {
   const res = await fetch('/api/auth/logout', { 
    method: 'POST', 
    credentials: 'include'
    });
    if (res.ok) {
      localStorage.removeItem('user')
      window.dispatchEvent(new Event('auth-changed'))
      router.push('/agent/login')
    }
  } catch (err) {
    triggerToast('Gagal logout, periksa koneksi server.', 'error')
  }
}
</script>