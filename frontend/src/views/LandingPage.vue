<template>
  <div class="min-h-screen bg-[#1A1A1A] font-sans text-slate-100 relative overflow-x-hidden">

    <!-- Notification -->
    <NotificationToast 
      :show="toast.show" 
      :message="toast.message" 
      :type="toast.type" 
      @close="toast.show = false" />

    <div class="absolute inset-0 pointer-events-none z-0">
      <div
        class="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_85%,transparent_100%)] opacity-20">
      </div>

      <div class="absolute top-[-5%] left-[-5%] w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[120px]"></div>
      <div class="absolute top-[30%] right-[-10%] w-[650px] h-[650px] rounded-full bg-cyan-500/5 blur-[150px]"></div>
    </div>

    <header
      class="bg-[#1A1A1A]/90 backdrop-blur-md fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 px-6 md:px-12 py-3 flex justify-between items-center shadow-lg">
      <div class="flex items-center space-x-10">

        <router-link to="/" class="flex items-center space-x-3 group">
          <img src="../assets/logo-prime-property.png" alt="Prime Property Logo"
            class="h-9 w-auto object-contain transition-transform group-hover:scale-105" />
          <span class="text-xl font-black tracking-wider text-white uppercase">
            PRIME <span class="text-[#C9A961]">PROPERTY</span>
          </span>
        </router-link>

        <nav class="hidden md:flex space-x-8 text-sm font-medium text-zinc-400">
          <a href="#hero" class="hover:text-[#C9A961] transition duration-300">Beranda</a>
          <router-link to="/about" class="hover:text-[#C9A961] transition duration-300">Tentang Kami</router-link>
          <router-link to="/contact" class="hover:text-[#C9A961] transition duration-300">Kontak</router-link>
        </nav>
      </div>

      <button @click="isMenuOpen = true" class="md:hidden p-2 text-zinc-300 hover:text-[#C9A961] transition z-50">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
        </svg>
      </button>
    </header>

    <transition name="fade">
      <div v-if="isMenuOpen"
        class="fixed top-20 right-4 w-64 rounded-2xl z-[100] bg-[#1A1A1A]/95 backdrop-blur-xl border border-zinc-800 shadow-2xl p-5 flex flex-col">
        <div class="flex justify-between items-center mb-6">
          <img src="../assets/logo-prime-property.png" alt="Prime Property Logo" class="h-7 w-auto object-contain" />
          <button @click="isMenuOpen = false" class="p-1 text-zinc-400 hover:text-white transition">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="flex flex-col space-y-5">
          <a @click="isMenuOpen = false" href="#hero"
            class="flex items-center space-x-3 text-sm font-bold text-zinc-300 hover:text-[#C9A961] transition">
            <svg class="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6">
              </path>
            </svg>
            <span>Beranda</span>
          </a>

          <router-link @click="isMenuOpen = false" to="/about"
            class="flex items-center space-x-3 text-sm font-bold text-zinc-300 hover:text-[#C9A961] transition">
            <svg class="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Tentang Kami</span>
          </router-link>

          <router-link @click="isMenuOpen = false" to="/contact"
            class="flex items-center space-x-3 text-sm font-bold text-zinc-300 hover:text-[#C9A961] transition">
            <svg class="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z">
              </path>
            </svg>
            <span>Kontak</span>
          </router-link>
        </div>
      </div>
    </transition>

    <section id="hero"
      class="relative z-10 pt-44 pb-28 px-6 md:px-12 flex flex-col items-center text-center max-w-5xl mx-auto space-y-6">
      <span
        class="bg-zinc-900/90 text-[#C9A961] text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full border border-zinc-800 shadow-sm flex items-center space-x-1">
        <svg class="w-3.5 h-3.5 animate-pulse text-[#C9A961]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z">
          </path>
        </svg>
        <span>Koleksi Terkurasi & Investasi Terpercaya</span>
      </span>

      <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
        Kurasi Hunian Mewah & <br> Investasi Properti Komersial Terbaik
      </h1>

      <p class="text-zinc-400 max-w-2xl text-base md:text-lg leading-relaxed font-normal">
        Menyediakan skema data properti premium yang ringkas dan informatif. Pilihan ruko komersial strategis dan villa
        eksklusif dengan nilai investasi tinggi.
      </p>

      <div class="pt-4">
        <a href="#listings"
          class="bg-[#C9A961] hover:bg-[#B33A3A] text-[#1A1A1A] hover:text-white font-bold px-8 py-4 rounded shadow-xl transition-all duration-300 flex items-center space-x-2 mx-auto group">
          <span>Lihat Koleksi Properti</span>
          <svg class="w-4 h-4 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor"
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 13l-7 7-7-7"></path>
          </svg>
        </a>
      </div>
    </section>

    <section id="listings" class="relative z-10 py-24 px-6 bg-[#1A1A1A]">
      <div class="max-w-6xl mx-auto">
       <h2 class="text-3xl font-bold mb-10 text-center tracking-tight">Properti Unggulan</h2>

        <div v-if="isLoading" class="text-center py-20 text-zinc-500 animate-pulse">
          Memuat properti terbaik untuk Anda...
        </div>

        <div v-else-if="properties.length === 0" class="text-center py-20 text-zinc-500">
          Belum ada unit properti yang tersedia saat ini.
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="item in properties" :key="item.id" class="bg-zinc-900 rounded-xl p-5 border border-zinc-800 hover:border-[#C9A961] transition-all group">
            <h3 class="text-lg font-bold text-white group-hover:text-[#C9A961] transition">{{ item.nama_property }}</h3>
            <p class="text-zinc-500 text-xs mt-1">{{ item.kawasan }} • {{ item.tipe }}</p>

            <div class="flex justify-between items-center mt-4">
              <p class="text-[#C9A961] font-bold">Rp {{ item.price?.toLocaleString('id-ID') }}</p>
              <a v-if="item.maps_link" :href="item.maps_link" target="_blank"
                class="text-[10px] bg-zinc-800 px-3 py-1.5 rounded hover:bg-[#C9A961] hover:text-black transition uppercase font-bold">
                Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- AC-2.2: Section "Mengapa Prime Property" -->
    <section class="relative z-10 py-24 bg-[#1A1A1A] px-6 md:px-12 border-t border-zinc-900">
      <div class="max-w-6xl mx-auto text-center">
        <span class="text-xs font-bold uppercase tracking-widest text-[#C9A961]">Keunggulan Kami</span>
        <h2 class="text-4xl font-extrabold text-white tracking-tight mt-2 mb-12">Mengapa Memilih Prime Property?</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 shadow-lg space-y-4">
            <svg class="w-12 h-12 text-[#C9A961] mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 000-2 2h2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
            </svg>
            <h3 class="text-xl font-bold text-white">Data Properti Akurat</h3>
            <p class="text-zinc-400 text-sm">Kami menyediakan data properti yang ringkas, informatif, dan terverifikasi untuk keputusan investasi terbaik Anda.</p>
          </div>

          <div class="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 shadow-lg space-y-4">
            <svg class="w-12 h-12 text-[#C9A961] mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 class="text-xl font-bold text-white">Nilai Investasi Optimal</h3>
            <p class="text-zinc-400 text-sm">Fokus pada properti dengan potensi pertumbuhan nilai yang tinggi, baik komersial maupun hunian.</p>
          </div>

          <div class="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 shadow-lg space-y-4">
            <svg class="w-12 h-12 text-[#C9A961] mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <h3 class="text-xl font-bold text-white">Lokasi Strategis</h3>
            <p class="text-zinc-400 text-sm">Setiap properti kami dipilih berdasarkan kriteria lokasi premium yang mendukung aksesibilitas dan bisnis.</p>
          </div>

          <div class="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 shadow-lg space-y-4">
            <svg class="w-12 h-12 text-[#C9A961] mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v2m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
            </svg>
            <h3 class="text-xl font-bold text-white">Transparansi Penuh</h3>
            <p class="text-zinc-400 text-sm">Kami menjamin transparansi dalam setiap transaksi dan informasi, membangun kepercayaan jangka panjang.</p>
          </div>
        </div>
      </div>
    </section>

    <section id="about" class="relative z-10 py-24 bg-[#1A1A1A] px-6 md:px-12 border-t border-zinc-900">
      <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div class="space-y-6 text-left">
          <div>
            <span class="text-xs font-bold uppercase tracking-widest text-[#C9A961]">Profil Korporasi</span>
            <h2 class="text-3xl font-bold text-white mt-1">Tentang Kami</h2>
          </div>
          <p class="text-zinc-400 text-sm leading-relaxed">
            Prime Property merupakan pionir platform agensi manajemen aset yang berdedikasi tinggi dalam menyediakan
            kurasi ruko komersial serta villa eksklusif di wilayah strategis Indonesia.
          </p>
          <router-link to="/about" class="inline-block text-[#C9A961] text-xs font-bold uppercase border-b border-[#C9A961] pb-1 hover:text-white hover:border-white transition">Baca Selengkapnya →</router-link>
        </div>
        <div
          class="bg-gradient-to-br from-zinc-900 to-black text-white p-10 rounded-xl border border-zinc-800 border-l-4 border-l-[#C9A961] shadow-xl text-left relative overflow-hidden">
          <p class="text-xl font-medium italic text-zinc-300 leading-relaxed relative z-10">
            "Kepercayaan dari para investor tidak dapat dibangun hanya lewat keindahan visual semata, melainkan melalui
            akurasi presisi matriks properti."
          </p>
        </div>
      </div>
    </section>

    <section id="contact" class="relative z-10 py-24 bg-[#1A1A1A] px-6 md:px-12 border-t border-zinc-900">
      <div class="max-w-6xl mx-auto flex flex-col items-center text-center space-y-6">

        <div>
          <span class="text-xs font-bold uppercase tracking-widest text-[#C9A961]">Saluran Komunikasi</span>
          <h2 class="text-4xl font-extrabold text-white tracking-tight mt-2">Kontak Kami</h2>
        </div>

        <p class="text-zinc-400 text-base leading-relaxed max-w-xl">
          Punya pertanyaan mengenai spesifikasi teknis, harga, atau ingin menjadwalkan kunjungan langsung ke lokasi
          properti?
        </p>

        <div class="pt-4">
          <router-link to="/contact"
            class="bg-[#C9A961] hover:bg-amber-500 text-[#1A1A1A] text-sm font-bold uppercase tracking-widest px-8 py-4 rounded shadow-xl transition duration-300 inline-flex items-center space-x-2 focus:outline-none">
            <span>Hubungi Hub Resmi</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </router-link>
        </div>

        <div class="pt-8 space-y-2 text-sm text-zinc-400">
          <p><span class="text-[#C9A961] font-bold">HQ:</span> Sudirman Central Business District (SCBD), Kavling 52-53,
            Jakarta Selatan</p>
          <p>Telepon: <span class="text-zinc-200 font-semibold">+62 21 5550 789</span> | Email: <span
              class="text-zinc-200 font-semibold">admin@primeproperty.com</span></p>
        </div>
      </div>
    </section>

    <footer
      class="bg-zinc-950 text-zinc-500 py-12 px-6 md:px-12 border-t border-zinc-900 text-center md:text-left relative z-10">
      <div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div class="space-y-1.5">
          <div class="flex items-center space-x-3 justify-center md:justify-start mb-2">
            <img src="../assets/logo-prime-property.png" alt="Prime Property Logo"
              class="h-6 w-auto object-contain grayscale opacity-60" />
            <p class="text-base font-black tracking-wider text-white">PRIME <span class="text-[#C9A961]">PROPERTY</span>
            </p>
          </div>
          <p class="text-xs text-zinc-400">Kontak: +62 21 5550 789 | admin@primeproperty.com</p>
        </div>
      </div>
      <div class="max-w-6xl mx-auto mt-8 pt-6 border-t border-zinc-900 text-center text-[11px] text-zinc-600">
        &copy; 2026 Prime Property Hub. Sistem Format Mata Uang Terintegrasi Locale ID (Rp).
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import NotificationToast from '../components/NotificationToast.vue'

// 1. SEMUA STATE DI SINI
const isMenuOpen = ref(false)
const properties = ref([])
const isLoading = ref(true)
const toast = reactive({ show: false, message: '', type: 'success' })

// 2. FORM KONTAK (Tadi ini yang lupa dideklarasikan)
const contactForm = reactive({
  nama: '',
  email: '',
  phone: '',
  pesan: ''
})

const triggerToast = (msg, type = 'success') => {
  toast.message = msg;
  toast.type = type;
  toast.show = true;
  setTimeout(() => { toast.show = false }, 3000);
}

// 3. FUNGSI FETCH
const fetchProperties = async () => {
  isLoading.value = true
  try {
    // Menggunakan endpoint featured yang mengembalikan array sederhana (max 3)
    const res = await fetch('http://localhost:3000/api/properties/featured')
    if (res.ok) {
      const data = await res.json()
      properties.value = data
    }
  } catch (err) {
    console.error("Gagal:", err)
  } finally {
    isLoading.value = false
  }
}

// 4. FUNGSI SUBMIT
const handleFormSubmit = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactForm)
    })
    const data = await res.json()
    if (res.ok) {
      triggerToast(data.message)
      contactForm.nama = ''
      contactForm.email = ''
      contactForm.phone = ''
      contactForm.pesan = ''
    } else {
      triggerToast(data.message || "Gagal mengirim pesan.", 'error')
    }
  } catch (err) {
    console.error("Contact Error:", err)
    triggerToast("Terjadi kesalahan koneksi ke server.", 'error')
  }
}

onMounted(fetchProperties)
</script>

<style scoped>
/* Animasi Transisi Sempurna */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>