<template>
  <div class="min-h-screen bg-[#1A1A1A] font-sans text-slate-100 relative overflow-x-hidden">
    <!-- Background Decorative Elements -->
    <div class="absolute inset-0 pointer-events-none z-0">
      <div class="absolute top-[10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[#C9A961]/5 blur-[120px]"></div>
    </div>

    <!-- Header Publik (Konsisten dengan AC-2.3) -->
    <header class="bg-[#1A1A1A]/90 backdrop-blur-md fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 px-6 md:px-12 py-3 flex justify-between items-center">
      <div class="flex items-center space-x-10">
        <router-link to="/" class="flex items-center space-x-3 group">
          <img src="../assets/logo-prime-property.png" alt="Prime Property Logo" class="h-9 w-auto object-contain" />
          <span class="text-xl font-black tracking-wider text-white uppercase">
            PRIME <span class="text-[#C9A961]">PROPERTY</span>
          </span>
        </router-link>
        <nav class="hidden md:flex space-x-8 text-sm font-medium text-zinc-400">
          <router-link to="/" class="hover:text-[#C9A961] transition">Beranda</router-link>
          <router-link to="/about" class="text-[#C9A961] transition font-bold">Tentang Kami</router-link>
          <router-link to="/contact" class="hover:text-[#C9A961] transition">Kontak</router-link>
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
            <router-link to="/about" @click="isMenuOpen = false" class="text-sm font-bold text-[#C9A961]">Tentang Kami</router-link>
            <router-link to="/contact" @click="isMenuOpen = false" class="text-sm font-bold text-zinc-300 hover:text-[#C9A961]">Kontak</router-link>
          </nav>
        </div>
      </div>
    </transition>

    <main class="relative z-10 pt-32 pb-24 px-6 md:px-12 max-w-6xl mx-auto">
      <!-- Layout 2 Kolom Desktop (AC-3.1) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
        <!-- Kolom Kiri: Profil, Visi, Misi -->
        <div class="space-y-12">
          <section>
            <span class="text-xs font-bold uppercase tracking-[0.2em] text-[#C9A961]">Profil Perusahaan</span>
            <h1 class="text-4xl font-black text-white mt-3 mb-6">Membangun Kepercayaan Melalui Presisi</h1>
            <p class="text-zinc-400 leading-relaxed text-lg">
              Prime Property adalah agensi manajemen aset premium yang berfokus pada kurasi properti komersial dan hunian mewah. Kami memahami bahwa setiap properti bukan sekadar bangunan, melainkan instrumen investasi yang memerlukan data akurat dan manajemen profesional.
            </p>
          </section>

          <section class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 class="text-[#C9A961] font-bold uppercase tracking-widest text-sm mb-4">Visi Kami</h2>
              <p class="text-zinc-300 text-sm leading-relaxed">
                Menjadi standar emas global dalam kurasi aset properti strategis melalui integrasi teknologi informasi dan transparansi data.
              </p>
            </div>
            <div>
              <h2 class="text-[#C9A961] font-bold uppercase tracking-widest text-sm mb-4">Misi Kami</h2>
              <ul class="text-zinc-300 text-sm space-y-3">
                <li class="flex items-start">
                  <span class="text-[#C9A961] mr-2">01.</span> Memberikan akses informasi properti yang ringkas dan informatif.
                </li>
                <li class="flex items-start">
                  <span class="text-[#C9A961] mr-2">02.</span> Menjamin nilai investasi maksimal bagi setiap klien korporasi maupun individu.
                </li>
              </ul>
            </div>
          </section>

          <section class="pt-8 border-t border-zinc-800">
            <h2 class="text-white font-bold text-xl mb-6">Nilai-Nilai Kami</h2>
            <div class="grid grid-cols-3 gap-4 text-center">
              <div class="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
                <div class="text-[#C9A961] font-bold text-lg mb-1">Integritas</div>
                <div class="text-zinc-500 text-[10px] uppercase">Kejujuran Data</div>
              </div>
              <div class="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
                <div class="text-[#C9A961] font-bold text-lg mb-1">Presisi</div>
                <div class="text-zinc-500 text-[10px] uppercase">Akurasi Matriks</div>
              </div>
              <div class="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
                <div class="text-[#C9A961] font-bold text-lg mb-1">Eksklusif</div>
                <div class="text-zinc-500 text-[10px] uppercase">Layanan Mewah</div>
              </div>
            </div>
          </section>
        </div>

        <!-- Kolom Kanan: Visual / Quote (AC-3.1) -->
        <div class="lg:sticky lg:top-40">
          <div class="relative group">
            <div class="absolute -inset-4 bg-[#C9A961]/10 rounded-2xl blur-xl group-hover:bg-[#C9A961]/20 transition duration-500"></div>
            <div class="relative bg-gradient-to-br from-zinc-900 to-black p-12 rounded-2xl border border-zinc-800 border-l-8 border-l-[#C9A961] shadow-2xl">
              <svg class="w-12 h-12 text-[#C9A961]/30 mb-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C14.9124 8 14.017 7.10457 14.017 6V3L14.017 3C14.017 1.89543 14.9124 1 16.017 1L19.017 1C21.2261 1 23.017 2.79086 23.017 5V15C23.017 17.2091 21.2261 19 19.017 19H16.017C14.9124 19 14.017 19.8954 14.017 21L14.017 21ZM1 21L1 18C1 16.8954 1.89543 16 3 16H6C6.55228 16 7 15.5523 7 15V9C7 8.44772 6.55228 8 6 8H3C1.89543 8 1 7.10457 1 6V3L1 3C1 1.89543 1.89543 1 3 1H6C8.20914 1 10 2.79086 10 5V15C10 17.2091 8.20914 19 6 19H3C1.89543 19 1 19.8954 1 21L1 21Z" />
              </svg>
              <blockquote class="text-2xl font-medium text-white italic leading-relaxed">
                "Investasi properti bukan tentang apa yang Anda beli hari ini, melainkan tentang nilai yang tercipta untuk generasi mendatang."
              </blockquote>
              <div class="mt-8 flex items-center space-x-4">
                <div class="h-px w-12 bg-[#C9A961]"></div>
                <cite class="text-[#C9A961] font-bold not-italic tracking-widest uppercase text-xs">Management Board</cite>
              </div>
            </div>
          </div>

          <div class="mt-12 grid grid-cols-2 gap-4">
             <div class="p-6 bg-zinc-900/30 border border-zinc-800 rounded-xl">
                <div class="text-3xl font-black text-white mb-1">500+</div>
                <div class="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Aset Terkelola</div>
             </div>
             <div class="p-6 bg-zinc-900/30 border border-zinc-800 rounded-xl">
                <div class="text-3xl font-black text-[#C9A961] mb-1">Rp 12T+</div>
                <div class="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Nilai Portfolio</div>
             </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer (Konsisten dengan AC-2.2) -->
    <footer class="bg-zinc-950 text-zinc-500 py-12 px-6 md:px-12 border-t border-zinc-900 text-center md:text-left relative z-10">
      <div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div class="space-y-1.5">
          <div class="flex items-center space-x-3 justify-center md:justify-start mb-2">
            <img src="../assets/logo-prime-property.png" alt="Prime Property Logo" class="h-6 w-auto object-contain grayscale opacity-60" />
            <p class="text-base font-black tracking-wider text-white">PRIME <span class="text-[#C9A961]">PROPERTY</span></p>
          </div>
          <p class="text-xs text-zinc-400">Kontak: +62 21 5550 789 | admin@primeproperty.com</p>
        </div>
        <nav class="flex space-x-6 text-xs font-bold uppercase tracking-widest">
          <router-link to="/about" class="text-white">About Us</router-link>
          <router-link to="/contact" class="hover:text-white transition">Contact Us</router-link>
        </nav>
      </div>
      <div class="max-w-6xl mx-auto mt-8 pt-6 border-t border-zinc-900 text-center text-[11px] text-zinc-600">
        &copy; 2026 Prime Property Hub. Sistem Manajemen Aset Berlisensi.
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const isMenuOpen = ref(false)
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(10px); }
</style>

<style scoped>
/* Mengikuti Grid Spacing AC-1.2 */
</style>