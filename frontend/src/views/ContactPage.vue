<template>
  <div class="min-h-screen bg-[#1A1A1A] font-sans text-slate-100 relative overflow-x-hidden pt-32 pb-12 px-6">
    <!-- Background Decorative Elements -->
    <div class="absolute inset-0 pointer-events-none z-0">
      <div class="absolute top-[10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-[#C9A961]/5 blur-[120px]"></div>
      <div class="absolute top-[40%] right-[-10%] w-[400px] h-[400px] rounded-full bg-blue-600/5 blur-[150px]"></div>
    </div>

    <!-- Notification Toast -->
    <NotificationToast 
      :show="toast.show" 
      :message="toast.message" 
      :type="toast.type" 
      @close="toast.show = false" />

    <!-- Header Publik (Konsisten dengan AC-2.3) -->
    <header class="bg-[#1A1A1A]/90 backdrop-blur-md fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 px-6 md:px-12 py-3 flex justify-between items-center shadow-lg">
      <div class="flex items-center space-x-10">
        <router-link to="/" class="flex items-center space-x-3 group">
          <img src="../assets/logo-prime-property.png" alt="Prime Property Logo" class="h-9 w-auto object-contain transition-transform group-hover:scale-105" />
          <span class="text-xl font-black tracking-wider text-white uppercase">
            PRIME <span class="text-[#C9A961]">PROPERTY</span>
          </span>
        </router-link>
        <nav class="hidden md:flex space-x-8 text-sm font-medium text-zinc-400">
          <router-link to="/" class="hover:text-[#C9A961] transition duration-300">Beranda</router-link>
          <router-link to="/about" class="hover:text-[#C9A961] transition duration-300">Tentang Kami</router-link>
          <router-link to="/contact" class="text-[#C9A961] font-bold transition duration-300">Kontak</router-link>
        </nav>
      </div>

      <button @click="isMenuOpen = true" class="md:hidden p-2 text-zinc-300 hover:text-[#C9A961] transition">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
        </svg>
      </button>
    </header>

    <!-- Mobile Menu Drawer -->
    <transition name="fade">
      <div v-if="isMenuOpen" class="fixed inset-0 z-[100] md:hidden">
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="isMenuOpen = false"></div>
        <div class="fixed top-20 right-4 w-64 rounded-2xl bg-[#1A1A1A] border border-zinc-800 shadow-2xl p-6 flex flex-col space-y-6">
          <nav class="flex flex-col space-y-4">
            <router-link to="/" @click="isMenuOpen = false" class="text-sm font-bold text-zinc-300 hover:text-[#C9A961]">Beranda</router-link>
            <router-link to="/about" @click="isMenuOpen = false" class="text-sm font-bold text-zinc-300 hover:text-[#C9A961]">Tentang Kami</router-link>
            <router-link to="/contact" @click="isMenuOpen = false" class="text-sm font-bold text-[#C9A961]">Kontak</router-link>
          </nav>
        </div>
      </div>
    </transition>

    <div class="max-w-4xl mx-auto relative z-10">
      <div class="text-center mb-12">
        <span class="text-xs font-bold uppercase tracking-widest text-[#C9A961]">Hubungi Kami</span>
        <h1 class="text-4xl font-extrabold text-white tracking-tight mt-2">Hub Resmi Prime Property</h1>
        <p class="text-zinc-400 mt-4 max-w-xl mx-auto">
          Silakan isi formulir di bawah ini untuk pertanyaan mengenai unit, jadwal kunjungan, atau konsultasi investasi.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Info Kontak -->
        <div class="space-y-6">
          <div class="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 shadow-xl">
            <h3 class="text-[#C9A961] text-xs font-black uppercase tracking-widest mb-4">Alamat Kantor</h3>
            <p class="text-sm text-zinc-300 leading-relaxed">
              SCBD Kavling 52-53,<br>
              Jakarta Selatan, Indonesia
            </p>
          </div>
          <div class="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 shadow-xl">
            <h3 class="text-[#C9A961] text-xs font-black uppercase tracking-widest mb-4">Saluran Cepat</h3>
            <p class="text-sm text-zinc-300">+62 21 5550 789</p>
            <p class="text-sm text-zinc-300">admin@primeproperty.com</p>
          </div>
        </div>

        <!-- Form Kontak -->
        <div class="md:col-span-2 bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-2xl">
          <form @submit.prevent="handleFormSubmit" class="space-y-5">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div class="space-y-1.5">
                <label class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Nama Lengkap</label>
                <input v-model="contactForm.nama" type="text" required
                  class="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:border-[#C9A961] outline-none transition"
                  placeholder="Masukkan nama Anda">
              </div>
              <div class="space-y-1.5">
                <label class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Alamat Email</label>
                <input v-model="contactForm.email" type="email" required
                  class="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:border-[#C9A961] outline-none transition"
                  placeholder="email@anda.com">
              </div>
            </div>
            
            <div class="space-y-1.5">
              <label class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Nomor HP / WhatsApp</label>
              <input v-model="contactForm.phone" type="tel" required
                class="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:border-[#C9A961] outline-none transition"
                placeholder="0812...">
            </div>

            <div class="space-y-1.5">
              <label class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Pesan Anda</label>
              <textarea v-model="contactForm.pesan" rows="4" required
                class="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:border-[#C9A961] outline-none transition"
                placeholder="Ceritakan kebutuhan properti Anda..."></textarea>
            </div>

            <button type="submit" :disabled="isSending"
              class="w-full bg-[#C9A961] hover:bg-amber-500 text-[#1A1A1A] font-bold text-xs uppercase tracking-widest py-4 rounded-xl transition flex justify-center items-center space-x-2 disabled:opacity-50">
              <span v-if="isSending" class="w-4 h-4 border-2 border-[#1A1A1A] border-t-transparent rounded-full animate-spin"></span>
              <span>{{ isSending ? 'Mengirim...' : 'Kirim Pesan Sekarang' }}</span>
            </button>
          </form>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import NotificationToast from '../components/NotificationToast.vue'
const isMenuOpen = ref(false)

const isSending = ref(false)
const toast = reactive({ show: false, message: '', type: 'success' })

const contactForm = reactive({
  nama: '',
  email: '',
  phone: '',
  pesan: ''
})

// AC-9.2: Mengambil token CSRF agar request POST diizinkan oleh backend
const getCsrfToken = async () => {
  const res = await fetch('/api/auth/csrf-token', { credentials: 'include' });
  if (!res.ok) {
    throw new Error("Gagal mengambil token keamanan.");
  }
  const data = await res.json();
  return data.token;
};

const triggerToast = (msg, type = 'success') => {
  toast.message = msg
  toast.type = type
  toast.show = true
  setTimeout(() => { toast.show = false }, 3000)
}

const handleFormSubmit = async () => {
  isSending.value = true
  try {
    // 1. Ambil token CSRF terlebih dahulu
    const token = await getCsrfToken();

   const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-csrf-token': token // 2. Kirim token via header
      },
      credentials: 'include', // 3. Sertakan cookie agar validasi session binding berhasil
      body: JSON.stringify(contactForm)
    })
    
    if (res.ok) {
      const data = await res.json()
      triggerToast(data.message)
      // Reset Form
      contactForm.nama = ''
      contactForm.email = ''
      contactForm.phone = ''
      contactForm.pesan = ''
    } else {
      // Tangani error non-JSON (seperti 403 atau 500 HTML)
      const text = await res.text();
      let errorMessage = "Gagal mengirim pesan.";
      try {
        const data = JSON.parse(text);
        errorMessage = data.message || errorMessage;
      } catch (e) { /* Respon bukan JSON */ }
      
      triggerToast(errorMessage, "error")
    }
  } catch (err) {
    console.error("Contact Error:", err)
    triggerToast("Gagal terhubung ke server. Periksa koneksi Anda.", "error")
  } finally {
    isSending.value = false
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(10px); }
</style>