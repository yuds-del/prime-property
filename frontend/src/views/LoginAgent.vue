<template>
  <div class="min-h-screen bg-[#1A1A1A] font-sans text-slate-100 relative overflow-x-hidden flex flex-col justify-center items-center px-6">
    
    <!-- Custom Notification -->
    <NotificationToast 
      :show="toast.show" 
      :message="toast.message" 
      :type="toast.type" 
      @close="toast.show = false" />

    <div class="absolute inset-0 pointer-events-none z-0">
      <div class="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#C9A961]/5 blur-[120px]"></div>
    </div>

    <div class="relative z-10 w-full max-w-md bg-zinc-900/60 p-8 rounded-2xl border border-zinc-800/80 shadow-2xl backdrop-blur-md">
      
      <div class="flex flex-col items-center text-center mb-8 space-y-3">
        <div class="flex items-center space-x-3 justify-center">
          <img 
            src="../assets/logo-prime-property.png" 
            alt="Prime Property Logo" 
            class="h-8 w-auto object-contain"
          />
          <span class="text-lg font-black tracking-wider text-white uppercase">
            PRIME <span class="text-[#C9A961]">PROP</span>
          </span>
        </div>
        <div>
          <h2 class="text-xl font-bold text-white tracking-tight">Internal Hub Agent</h2>
          <p class="text-xs text-zinc-500 font-mono mt-1">Silakan masuk untuk mengelola aset properti</p>
        </div>
      </div>

      <form @submit.prevent="handleLoginSubmit" class="space-y-5">
        
        <div class="space-y-1.5">
          <label class="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Alamat Email</label>
          <div class="relative">
            <input 
              v-model="loginForm.email" 
              type="email" 
              placeholder="nama@primeproperty.com" 
              class="w-full p-3.5 pl-4 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:border-[#C9A961] transition outline-none" 
              required 
            />
          </div>
        </div>

        <div class="space-y-1.5">
          <div class="flex justify-between items-center">
            <label class="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Kata Sandi</label>
            <a href="#" @click.prevent="handleForgotPassword" class="text-[11px] text-[#C9A961] hover:underline">Lupa Sandi?</a>
          </div>
          <div class="relative">
            <input 
              v-model="loginForm.password" 
              :type="showPassword ? 'text' : 'password'" 
              placeholder="••••••••" 
              class="w-full p-3.5 pl-4 pr-12 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:border-[#C9A961] transition outline-none" 
              required 
            />
            <button 
              type="button" 
              @click="showPassword = !showPassword"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-[#C9A961] transition"
            >
              <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"/></svg>
            </button>
          </div>
        </div>

        <p v-if="errorMessage" class="text-xs text-[#B33A3A] font-medium bg-red-950/20 border border-red-900/50 p-3 rounded-lg text-center">
          {{ errorMessage }}
        </p>

        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full bg-[#C9A961] text-[#1A1A1A] font-bold text-xs uppercase tracking-widest py-4 rounded-xl hover:bg-amber-500 transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center space-x-2 shadow-lg shadow-[#C9A961]/5"
        >
          <span v-if="isLoading" class="w-4 h-4 border-2 border-[#1A1A1A] border-t-transparent rounded-full animate-spin"></span>
          <span>{{ isLoading ? 'Memverifikasi...' : 'Masuk ke Portal' }}</span>
        </button>
      </form>

      <div class="mt-8 text-center">
        <router-link to="/" class="text-xs text-zinc-500 hover:text-zinc-300 transition">
          ← Kembali ke Halaman Publik
        </router-link>
      </div>

    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import NotificationToast from '../components/NotificationToast.vue'

const router = useRouter()
const isLoading = ref(false)
const showPassword = ref(false)
const errorMessage = ref('')
const toast = reactive({ show: false, message: '', type: 'success' })

const loginForm = reactive({
  email: '',
  password: ''
})

const triggerToast = (msg, type = 'success') => {
  toast.message = msg;
  toast.type = type;
  toast.show = true;
  setTimeout(() => { toast.show = false }, 3000);
}

const getCsrfToken = async () => {
  const res = await fetch('http://localhost:3000/api/auth/csrf-token', { credentials: 'include' });
  if (!res.ok) {
    const text = await res.text();
    console.error("Server Error Page:", text);
    throw new Error(JSON.parse(text).message || "Gagal mengambil token keamanan.");
  }
  const data = await res.json();
  return data.token;
};

// AC-5.1: Memindahkan logika alert ke fungsi agar tidak error _ctx.alert
const handleForgotPassword = () => {
  triggerToast('Silakan hubungi Superadmin TI untuk reset password.', 'error')
}

const handleLoginSubmit = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const token = await getCsrfToken();
    // Menembak ke backend Express di port 3000
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-csrf-token': token
      },
      credentials: 'include', // PENTING: Agar cookie tersimpan
      body: JSON.stringify({
        email: loginForm.email,
        password: loginForm.password
      })
    })

    const data = await response.json()

   // ... di dalam handleLoginSubmit ...
    if (response.ok) {
      localStorage.setItem('user', JSON.stringify(data.user))
      
      // PERBAIKAN: Gunakan nama_lengkap sesuai struktur database Anda
     
      window.dispatchEvent(new Event('auth-changed'));
      router.push('/admin') 
    
    } else {
      // Menampilkan pesan error dari backend
      errorMessage.value = data.message || "Login gagal, periksa kembali kredensial Anda."
    }
  } catch (error) {
    errorMessage.value = error.message.includes('Failed to fetch') ? "Tidak dapat terhubung ke server. Pastikan backend jalan!" : error.message;
    console.error("Login Error:", error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Menghilangkan efek background autofill browser pada input agar tetap estetik gelap */
input:-webkit-autofill,
input:-webkit-autofill:hover, 
input:-webkit-autofill:focus {
  -webkit-text-fill-color: #f1f5f9;
  -webkit-box-shadow: 0 0 0px 1000px #09090b inset;
  transition: background-color 5000s ease-in-out 0s;
}
</style>