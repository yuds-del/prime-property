<template>
  <div class="space-y-6 text-zinc-100">
    
    

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      <div class="bg-[#1A1A1A] border border-zinc-800/80 p-5 rounded-xl shadow-md flex items-center justify-between">
        <div class="space-y-1">
          <p class="text-xs font-medium text-zinc-400 uppercase tracking-wider">Total Listing</p>
          <p class="text-3xl font-bold text-white">{{ stats.total }}</p>
        </div>
        <div class="p-3 bg-zinc-800/50 rounded-lg text-[#C9A961] border border-zinc-700/50">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
        </div>
      </div>

      <div class="bg-[#1A1A1A] border border-zinc-800/80 p-5 rounded-xl shadow-md flex items-center justify-between">
        <div class="space-y-1">
          <p class="text-xs font-medium text-zinc-400 uppercase tracking-wider">In Stock (Ready)</p>
          <p class="text-3xl font-bold text-emerald-400">{{ stats.inStock }}</p>
        </div>
        <div class="p-3 bg-emerald-950/40 rounded-lg text-emerald-400 border border-emerald-800/40">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
      </div>

      <div class="bg-[#1A1A1A] border border-zinc-800/80 p-5 rounded-xl shadow-md flex items-center justify-between">
        <div class="space-y-1">
          <p class="text-xs font-medium text-zinc-400 uppercase tracking-wider">Aset Terjual</p>
          <p class="text-3xl font-bold text-[#B33A3A]">{{ stats.soldOut }}</p>
        </div>
        <div class="p-3 bg-[#B33A3A]/15 rounded-lg text-[#B33A3A] border border-[#B33A3A]/30">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
        </div>
      </div>

      <div class="bg-[#1A1A1A] border border-zinc-800/80 p-5 rounded-xl shadow-md flex items-center justify-between">
        <div class="space-y-1">
          <p class="text-xs font-medium text-zinc-400 uppercase tracking-wider">Total Nilai Portofolio</p>
          <p class="text-xl font-black text-[#C9A961] pt-1">Rp {{ stats.totalValue.toLocaleString('id-ID') }}</p>
        </div>
        <div class="p-3 bg-amber-950/40 rounded-lg text-[#C9A961] border border-amber-900/40">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
      </div>

    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <div class="lg:col-span-2 bg-[#1A1A1A] border border-zinc-800/80 p-5 rounded-xl space-y-4 shadow-md">
        <h3 class="text-sm font-bold text-white uppercase tracking-wider">Komposisi Inventaris</h3>
        <div class="space-y-3 pt-2">
          <div>
            <div class="flex justify-between text-xs mb-1">
              <span class="text-zinc-400">Kompleks Ruko Bisnis</span>
              <span class="text-zinc-200 font-semibold">{{ stats.ruko }} Unit</span>
            </div>
            <div class="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-800">
              <div class="bg-[#C9A961] h-full rounded-full" :style="{ width: (stats.ruko / stats.total * 100) + '%' }"></div>
            </div>
          </div>

          <div>
            <div class="flex justify-between text-xs mb-1">
              <span class="text-zinc-400">Villa & Mansion Premium</span>
              <span class="text-zinc-200 font-semibold">{{ stats.villa }} Unit</span>
            </div>
            <div class="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-800">
              <div class="bg-purple-500 h-full rounded-full" :style="{ width: (stats.villa / stats.total * 100) + '%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-[#1A1A1A] border border-zinc-800/80 p-5 rounded-xl space-y-4 shadow-md">
        <h3 class="text-sm font-bold text-white uppercase tracking-wider">Kawasan Terpopuler</h3>
        <ul class="text-xs divide-y divide-zinc-800/60">
          <li v-for="k in stats.topKawasan" :key="k.kawasan" class="py-2.5 flex justify-between items-center">
            <span class="text-zinc-400">{{ k.kawasan }}</span>
            <span class="bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800 font-bold text-zinc-300">{{ k.count }} Unit Aktif</span>
          </li>
          <li v-if="stats.topKawasan.length === 0" class="py-4 text-center text-zinc-500 italic">
            Belum ada data kawasan aktif.
          </li>
        </ul>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Kita buat state awal dengan nilai 0
const stats = ref({ 
  total: 0, 
  inStock: 0, 
  soldOut: 0, 
  totalValue: 0,
  ruko: 0, 
  villa: 0,
  topKawasan: []
})

const fetchStats = async () => {
  try {
    // Kita panggil API statistik yang baru kita buat di server.js
    const res = await fetch('http://localhost:3000/api/properties/stats')
    const data = await res.json()
    
    // Update data dashboard dengan respon dari database
    stats.value = {
      total: data.total || 0,
      inStock: data.in_stock || 0,
      soldOut: data.sold_out || 0,
      totalValue: data.total_value || 0, // Pastikan di SQL SELECT ditambahkan SUM(price)
      ruko: data.ruko || 0,
      villa: data.villa || 0,
      topKawasan: data.top_kawasan || []
    }
  } catch (err) {
    console.error("Gagal load stats:", err)
  }
}

onMounted(fetchStats)
</script>