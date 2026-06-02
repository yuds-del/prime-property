<template>
  <div class="space-y-6 text-zinc-100">
    <!-- AC-1.1: Custom Toast Notification -->
    <NotificationToast 
      :show="toast.show" 
      :message="toast.message" 
      :type="toast.type" 
      @close="toast.show = false" />

    <!-- AC-1.1: Custom Confirmation Modal -->
    <CustomModal 
      v-model="modal.show" 
      :title="modal.title" 
      :message="modal.message" 
      :is-confirm="true"
      @confirm="executeAction" 
      @cancel="modal.show = false" />

    <div class="flex justify-between items-center bg-[#1A1A1A] p-4 rounded-xl border border-zinc-800 shadow-sm">
      <div>
        <h1 class="text-2xl font-bold text-white tracking-tight">
          {{ showArchived ? 'Arsip Properti (Terhapus)' : 'Manajemen Listing Properti' }}
        </h1>
        <p class="text-xs text-zinc-400 mt-1">
          Menampilkan <span class="text-[#C9A961] font-bold">{{ filteredProperties.length }}</span> dari {{
            properties.length }} aset
        </p>
      </div>
      <div class="flex space-x-3">
        <button @click="toggleArchived" 
          class="px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition border"
          :class="showArchived ? 'bg-zinc-800 text-white border-zinc-700' : 'bg-transparent text-zinc-400 border-zinc-800 hover:text-white'">
          {{ showArchived ? 'Lihat Listing Aktif' : 'Lihat Arsip' }}
        </button>

      <button v-if="currentUser?.role_id === 1" @click="bukaFormTambah"
        class="bg-[#C9A961] hover:bg-amber-500 text-[#1A1A1A] font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-lg flex items-center space-x-2 transition shadow-md">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        <span>Tambah Properti</span>
      </button>
      </div>
    </div>

    <div class="bg-[#1A1A1A] p-5 rounded-xl border border-zinc-800 shadow-sm space-y-4">
      <div class="relative">
        <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-500">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </span>
        <input v-model="searchQuery" type="text" placeholder="Cari berdasarkan nama properti, group, atau kawasan..."
          class="w-full bg-zinc-950 border border-zinc-800 text-white pl-10 pr-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#C9A961] placeholder-zinc-500 transition" />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-1">
        <div>
          <label class="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Tipe Properti</label>
          <select v-model="filterType" @change="fetchProperties"
            class="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 p-2 rounded-lg text-xs focus:outline-none focus:border-[#C9A961] h-10">
            <option value="Semua">Semua Tipe</option>
            <option value="Ruko">Ruko</option>
            <option value="Villa">Villa</option>
          </select>
        </div>
        <div>
          <label class="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Status Stock</label>
          <select v-model="filterStatus" @change="fetchProperties"
            class="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 p-2 rounded-lg text-xs focus:outline-none focus:border-[#C9A961] h-10">
            <option value="Semua">Semua Status</option>
            <option value="in_stock">In Stock</option>
            <option value="sold_out">Sold Out</option>
          </select>
        </div>
        <div>
          <label class="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Baris Per Halaman</label>
          <select v-model="limit" @change="fetchProperties"
            class="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 p-2 rounded-lg text-xs focus:outline-none focus:border-[#C9A961] h-10">
            <option :value="25">25 Baris</option>
            <option :value="50">50 Baris (Default)</option>
            <option :value="100">100 Baris</option>
          </select>
        </div>
        <div class="flex items-end">
          <button @click="resetFilters"
            class="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 text-xs font-semibold py-2.5 rounded-lg transition h-10">
            Reset Filter
          </button>
        </div>
      </div>
    </div>

    <!-- AC-7.2: Active Filter Chips -->
    <div v-if="searchQuery || filterType !== 'Semua' || filterStatus !== 'Semua'" class="flex flex-wrap gap-2 items-center">
      <span class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mr-1">Filter Aktif:</span>
      <div v-if="searchQuery" class="bg-zinc-800 text-zinc-300 px-2 py-1 rounded-md text-[10px] flex items-center border border-zinc-700">
        Cari: {{ searchQuery }}
        <button @click="searchQuery = ''" class="ml-2 hover:text-white">&times;</button>
      </div>
      <div v-if="filterType !== 'Semua'" class="bg-[#C9A961]/10 text-[#C9A961] px-2 py-1 rounded-md text-[10px] flex items-center border border-[#C9A961]/20">
        Tipe: {{ filterType }}
        <button @click="filterType = 'Semua'; fetchProperties()" class="ml-2 hover:text-white">&times;</button>
      </div>
      <div v-if="filterStatus !== 'Semua'" class="bg-zinc-800 text-zinc-300 px-2 py-1 rounded-md text-[10px] flex items-center border border-zinc-700">
        Status: {{ filterStatus === 'in_stock' ? 'In Stock' : 'Sold Out' }}
        <button @click="filterStatus = 'Semua'; fetchProperties()" class="ml-2 hover:text-white">&times;</button>
      </div>
      <button @click="resetFilters" class="text-[10px] text-[#B33A3A] font-bold uppercase hover:underline">Hapus Semua</button>
    </div>

    <div class="bg-[#1A1A1A] rounded-xl border border-zinc-800 overflow-x-auto shadow-sm">
      <table class="w-full text-left border-collapse min-w-[1000px]">
        <thead>
          <tr class="bg-zinc-900 border-b border-zinc-800 text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
            <th class="py-3 px-4">Nama Properti</th>
            <th class="py-3 px-4">Group</th>
            <th class="py-3 px-4">Kawasan</th>
            <th class="py-3 px-4">Dimensi (L x P)</th>
            <th class="py-3 px-4">Hadap</th>
            <th class="py-3 px-4">Tipe / Lantai</th>
            <th class="py-3 px-4 text-right">Harga (IDR)</th>
            <th class="py-3 px-4 text-center">Carport</th>
            <th class="py-3 px-4 text-center">Status / Fisik</th>
            <th class="py-3 px-4">Maps Link</th>
            <th class="py-3 px-4 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody class="text-xs divide-y divide-zinc-800/60">
          <tr v-for="item in filteredProperties" :key="item.id" @click="bukaDetail(item)" 
            class="hover:bg-zinc-800/30 transition cursor-pointer"
            :class="{ 'bg-[#C9A961]/10 animate-pulse-once': newlyAddedId === item.id }"
          >
            <td class="py-3.5 px-4 font-bold text-white">{{ item.nama_property }}</td>
            <td class="py-3.5 px-4 text-zinc-400">{{ item.group || '-' }}</td>
            <td class="py-3.5 px-4">
              <span class="bg-zinc-950 text-zinc-300 px-2 py-0.5 rounded border border-zinc-800">{{ item.kawasan
              }}</span>
            </td>
            <td class="py-3.5 px-4 text-zinc-300">{{ item.lebar }} x {{ item.panjang }} m</td>
            <td class="py-3.5 px-4 text-zinc-400">{{ item.hadap }}</td>
            <td class="py-3.5 px-4 text-zinc-300">{{ item.tipe }} ({{ item.tingkat }} Lt)</td>
            <td class="py-3.5 px-4 text-right font-bold text-[#C9A961]">
              Rp {{ item.price.toLocaleString('id-ID') }}
            </td>
            <td class="py-3.5 px-4 text-center">
              <span v-if="item.carport" class="text-emerald-400 font-semibold">✔ Ya</span>
              <span v-else class="text-zinc-600">—</span>
            </td>
            <td class="py-3.5 px-4 text-center space-y-1">
              <span
                :class="item.status === 'in_stock' ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/50' : 'bg-[#B33A3A]/20 text-[#B33A3A] border-[#B33A3A]/30'"
                class="inline-block text-[10px] font-bold px-2 py-0.5 rounded border uppercase">
                {{ item.status === 'in_stock' ? 'In Stock' : 'Sold Out' }}
              </span>
            </td>
            <td class="py-3.5 px-4 text-zinc-400">
              <a v-if="item.maps_link" :href="item.maps_link" target="_blank"
                class="text-blue-400 hover:underline">Lihat Maps</a>
              <span v-else class="text-zinc-600">-</span>
            </td>
            <td class="py-3.5 px-4 text-center">
              <div class="flex items-center justify-center space-x-1.5">
                <button v-if="currentUser?.role_id === 1" @click.stop="bukaFormEdit(item)"
                  class="text-[11px] bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 px-2.5 py-1 rounded transition">
                  Edit
                </button>
                <button v-if="currentUser?.role_id === 1 && showArchived" @click.stop="restoreProperti(item.id)"
                  class="text-[11px] bg-emerald-900/20 hover:bg-emerald-600 border border-emerald-800 text-emerald-400 hover:text-white px-2.5 py-1 rounded transition">
                  Restore
                </button>
                <button v-if="currentUser?.role_id === 1" @click.stop="hapusProperti(item.id)"
                  class="text-[11px] bg-[#B33A3A]/10 hover:bg-[#B33A3A] border border-[#B33A3A]/20 text-[#B33A3A] hover:text-white px-2.5 py-1 rounded transition">
                  Hapus
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="filteredProperties.length === 0">
            <td colspan="10" class="text-center py-12 text-zinc-500 font-medium">
              Data listing properti tidak ditemukan.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="isFormTerbuka"
      class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-zinc-900 rounded-xl shadow-2xl max-w-2xl w-full p-6 space-y-4 border border-zinc-800">
        <div class="flex justify-between items-center border-b border-zinc-800 pb-3">
          <h2 class="text-base font-bold text-white flex items-center space-x-2">
            <span class="text-[#C9A961]">●</span>
            <span>{{ isEditMode ? 'Edit Data Properti' : 'Tambah Properti Baru' }}</span>
          </h2>
          <button @click="isFormTerbuka = false" class="text-zinc-400 hover:text-white text-xl">&times;</button>
        </div>

        <form @submit.prevent="simpanProperti" class="space-y-4 text-xs">
          <div class="relative">
            <label class="block font-semibold text-zinc-400 mb-1">Nama Properti</label>
            <input v-model="form.nama_property" type="text" 
              :class="errors.nama_property ? 'border-[#B33A3A]' : 'border-zinc-800'"
              class="w-full bg-zinc-950 border p-2.5 rounded-lg text-white focus:outline-none focus:border-[#C9A961]"
              placeholder="Contoh: Aston Villas Blok C">
            <p v-if="errors.nama_property" class="text-[10px] text-[#B33A3A] mt-1">{{ errors.nama_property }}</p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block font-semibold text-zinc-400 mb-1">Nama Group</label>
              <input v-model="form.group" type="text"
                class="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg text-white focus:outline-none focus:border-[#C9A961]"
                placeholder="Mentari / Project Ville">
            </div>
            <div>
              <label class="block font-semibold text-zinc-400 mb-1">Kawasan (Lokasi)</label>
              <input v-model="form.kawasan" type="text"
                :class="errors.kawasan ? 'border-[#B33A3A]' : 'border-zinc-800'"
                class="w-full bg-zinc-950 border p-2.5 rounded-lg text-white focus:outline-none focus:border-[#C9A961]"
                placeholder="Cemara Asri / Pancing">
              <p v-if="errors.kawasan" class="text-[10px] text-[#B33A3A] mt-1">{{ errors.kawasan }}</p>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block font-semibold text-zinc-400 mb-1">Lebar (m)</label>
              <input v-model.number="form.lebar" type="number" step="0.1"
                :class="errors.lebar ? 'border-[#B33A3A]' : 'border-zinc-800'"
                class="w-full bg-zinc-950 border p-2.5 rounded-lg text-white focus:outline-none focus:border-[#C9A961]">
              <p v-if="errors.lebar" class="text-[10px] text-[#B33A3A] mt-1">{{ errors.lebar }}</p>
            </div>
            <div>
              <label class="block font-semibold text-zinc-400 mb-1">Panjang (m)</label>
              <input v-model.number="form.panjang" type="number" step="0.1"
                :class="errors.panjang ? 'border-[#B33A3A]' : 'border-zinc-800'"
                class="w-full bg-zinc-950 border p-2.5 rounded-lg text-white focus:outline-none focus:border-[#C9A961]">
              <p v-if="errors.panjang" class="text-[10px] text-[#B33A3A] mt-1">{{ errors.panjang }}</p>
            </div>
            <div>
              <label class="block font-semibold text-zinc-400 mb-1">Arah Hadap</label>
              <select v-model="form.hadap"
                class="w-full bg-zinc-950 border border-zinc-800 text-white p-2.5 rounded-lg focus:outline-none focus:border-[#C9A961]">
                <option value="Utara">Utara</option>
                <option value="Selatan">Selatan</option>
                <option value="Timur">Timur</option>
                <option value="Barat">Barat</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block font-semibold text-zinc-400 mb-1">Tipe</label>
              <select v-model="form.tipe"
                class="w-full bg-zinc-950 border border-zinc-800 text-white p-2.5 rounded-lg focus:outline-none focus:border-[#C9A961]">
                <option value="Villa">Villa</option>
                <option value="Ruko">Ruko</option>
              </select>
            </div>
            <div>
              <label class="block font-semibold text-zinc-400 mb-1">Jumlah Tingkat (Lantai)</label>
              <input v-model.number="form.tingkat" type="number" step="0.5"
                :class="errors.tingkat ? 'border-[#B33A3A]' : 'border-zinc-800'"
                class="w-full bg-zinc-950 border p-2.5 rounded-lg text-white focus:outline-none focus:border-[#C9A961]">
              <p v-if="errors.tingkat" class="text-[10px] text-[#B33A3A] mt-1">{{ errors.tingkat }}</p>
            </div>
            <div>
              <label class="block font-semibold text-zinc-400 mb-1">Ketersediaan Carport</label>
              <select v-model="form.carport"
                class="w-full bg-zinc-950 border border-zinc-800 text-white p-2.5 rounded-lg focus:outline-none focus:border-[#C9A961]">
                <option :value="true">Ada Carport (Ya)</option>
                <option :value="false">Tidak Ada</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block font-semibold text-zinc-400 mb-1">Harga Terkini (IDR)</label>
              <input v-model.number="form.price" type="number"
                :class="errors.price ? 'border-[#B33A3A]' : 'border-zinc-800'"
                class="w-full bg-zinc-950 border p-2.5 rounded-lg text-white focus:outline-none focus:border-[#C9A961]">
              <p v-if="errors.price" class="text-[10px] text-[#B33A3A] mt-1">{{ errors.price }}</p>
            </div>
            <div>
              <label class="block font-semibold text-zinc-400 mb-1">Status Inventaris</label>
              <select v-model="form.status"
                class="w-full bg-zinc-950 border border-zinc-800 text-white p-2.5 rounded-lg focus:outline-none focus:border-[#C9A961]">
                <option value="in_stock">In Stock</option>
                <option value="sold_out">Sold Out</option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block font-semibold text-zinc-400 mb-1">Status Fisik (Siap)</label>
              <select v-model="form.siap" class="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg text-white">
                <option value="siap_huni">Siap Huni</option>
                <option value="siap_kosong">Siap Kosong</option>
                <option value="siap_huni_renovasi">Siap Huni Renovasi</option>
              </select>
            </div>
            <div>
              <label class="block font-semibold text-zinc-400 mb-1">Unit (Keterangan)</label>
              <input v-model="form.unit" type="text"
                class="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg text-white"
                placeholder="Contoh: Ready Siap huni / Gate siap">
            </div>
            <div>
              <label class="block font-semibold text-zinc-400 mb-1">Maps Link (URL)</label>
              <input v-model="form.maps_link" type="text"
                class="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg text-white"
                placeholder="https://google.com/maps/...">
            </div>
          </div>
          <div class="flex justify-end space-x-2 pt-4 border-t border-zinc-800">
            <button type="button" @click="isFormTerbuka = false"
              class="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-zinc-300 transition">Batal</button>
            <button type="submit"
              class="px-4 py-2.5 bg-[#C9A961] text-[#1A1A1A] font-bold rounded-lg hover:bg-amber-500 transition">Simpan
              Data</button>
          </div>
        </form>
      </div>
    </div>

    <!-- AC-7.3: Halaman/Panel Detail Properti -->
    <div v-if="selectedProperty" class="fixed inset-y-0 right-0 w-full md:w-96 bg-zinc-900 border-l border-zinc-800 shadow-2xl z-[60] p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-xl font-bold text-white">Detail Properti</h2>
        <button @click="selectedProperty = null" class="text-zinc-500 hover:text-white">&times;</button>
      </div>
      <div class="space-y-6">
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1">
            <p class="text-[10px] uppercase text-zinc-500 font-bold">Nama Aset</p>
            <p class="text-sm text-white">{{ selectedProperty.nama_property }}</p>
          </div>
          <div class="space-y-1">
            <p class="text-[10px] uppercase text-zinc-500 font-bold">Harga</p>
            <p class="text-sm text-[#C9A961] font-bold">Rp {{ selectedProperty.price.toLocaleString('id-ID') }}</p>
          </div>
        </div>
        <div class="p-4 bg-zinc-950 rounded-lg border border-zinc-800 space-y-4">
          <p class="text-[10px] uppercase text-zinc-400 font-bold border-b border-zinc-800 pb-2">Spesifikasi Teknis</p>
          <div class="grid grid-cols-2 gap-y-4 text-xs">
            <div><span class="text-zinc-500">Dimensi:</span> <span class="text-zinc-200">{{ selectedProperty.lebar }}x{{ selectedProperty.panjang }}m</span></div>
            <div><span class="text-zinc-500">Lantai:</span> <span class="text-zinc-200">{{ selectedProperty.tingkat }} Lt</span></div>
            <div><span class="text-zinc-500">Hadap:</span> <span class="text-zinc-200">{{ selectedProperty.hadap }}</span></div>
            <div><span class="text-zinc-500">Carport:</span> <span class="text-zinc-200">{{ selectedProperty.carport ? 'Ada' : 'Tidak' }}</span></div>
          </div>
        </div>
        <div class="space-y-2">
          <p class="text-[10px] uppercase text-zinc-500 font-bold">Keterangan Unit</p>
          <p class="text-xs text-zinc-300 leading-relaxed bg-zinc-800/50 p-3 rounded border border-zinc-800">{{ selectedProperty.unit || 'Tidak ada keterangan tambahan.' }}</p>
        </div>
        <a v-if="selectedProperty.maps_link" :href="selectedProperty.maps_link" target="_blank"
          class="block w-full text-center bg-zinc-800 hover:bg-[#C9A961] hover:text-[#1A1A1A] text-white font-bold py-3 rounded-lg text-xs transition uppercase tracking-widest">
          Buka di Google Maps
        </a>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NotificationToast from '../components/NotificationToast.vue'
import CustomModal from '../components/CustomModal.vue'

const route = useRoute()
const router = useRouter()
const currentUser = ref(null)
const properties = ref([])
const totalData = ref(0)
const currentPage = ref(1)
const showArchived = ref(false)
const limit = ref(parseInt(route.query.limit) || 50)
const searchQuery = ref('')
const filterType = ref('Semua')
const filterStatus = ref('Semua')
const isFormTerbuka = ref(false)
const isEditMode = ref(false)
const editId = ref(null)
const selectedProperty = ref(null)
const newlyAddedId = ref(null)
const errors = reactive({ nama_property: '', kawasan: '', price: '', maps_link: '' })
const toast = reactive({ show: false, message: '', type: 'success' })
const modal = reactive({ show: false, title: '', message: '', actionType: null, targetId: null })

const getCsrfToken = async () => {
 const res = await fetch('/api/auth/csrf-token', { credentials: 'include' });
const data = await res.json();
return data.token;
};

// Inisialisasi form
const form = ref({
  nama_property: '',
  group: '',
  kawasan: '',
  lebar: 0,
  panjang: 0,
  hadap: 'Utara',
  tipe: 'Villa',
  tingkat: 1,
  price: 0,
  carport: true,
  status: 'in_stock',
  siap: 'siap_huni',
  maps_link: '',
  unit: ''
})

// AC-7.2: Debounce pencarian 300ms
let debounceTimer;
watch(searchQuery, () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    currentPage.value = 1;
    fetchProperties();
  }, 300);
});

const triggerToast = (msg, type = 'success') => {
  toast.message = msg;
  toast.type = type;
  toast.show = true;
  setTimeout(() => { toast.show = false }, 3000);
}

const executeAction = () => {
  if (modal.actionType === 'delete') {
    hapusPropertiAction(modal.targetId);
  } else if (modal.actionType === 'restore') {
    restorePropertiAction(modal.targetId);
  }
  modal.show = false;
}

const fetchProperties = async () => {
  try {
    const params = new URLSearchParams({
      page: currentPage.value,
      limit: limit.value,
      archived: showArchived.value,
      search: searchQuery.value,
      tipe: filterType.value === 'Semua' ? '' : filterType.value,
      status: filterStatus.value === 'Semua' ? '' : filterStatus.value
    });
    
    // Sinkronisasi ke URL (AC-7.2)
    router.replace({ query: Object.fromEntries(params) });
    const res = await fetch(`/api/properties?${params.toString()}`, {
      credentials: 'include'
    });
    
    const result = await res.json()
    properties.value = result.data
    totalData.value = result.total
  } catch (err) {
    console.error("Gagal ambil data:", err)
  }
}

const changePage = (p) => { currentPage.value = p; fetchProperties(); }

const simpanProperti = async () => {
  // Reset errors
  Object.keys(errors).forEach(key => errors[key] = '')
  
  let hasError = false
  if (form.value.nama_property.length < 3 || form.value.nama_property.length > 100) {
    errors.nama_property = "Nama minimal 3 dan maksimal 100 karakter.";
    hasError = true
  }

  if (!form.value.kawasan) {
    errors.kawasan = "Kawasan wajib diisi.";
    hasError = true
  }

  if (form.value.price <= 0) {
    errors.price = "Harga harus lebih besar dari 0.";
    hasError = true
  }

  if (form.value.tingkat < 1 || form.value.tingkat > 10) {
    errors.tingkat = "Tingkat harus antara 1 sampai 10.";
    hasError = true
  }

  if (form.value.maps_link && !form.value.maps_link.includes('google.com/maps')) {
    errors.maps_link = "Link Maps harus valid (google.com/maps).";
    hasError = true
  }

  if (hasError) return;

  const url = isEditMode.value ? `/api/properties/${editId.value}` : '/api/properties'
const method = isEditMode.value ? 'PUT' : 'POST'

  const token = await getCsrfToken();

  const res = await fetch(url, {
    method: method,
    headers: { 'Content-Type': 'application/json', 'x-csrf-token': token },
    credentials: 'include', // PENTING: Browser akan mengirimkan cookie role_id
    body: JSON.stringify(form.value)
  })

  if (res.ok && !isEditMode.value) {
    const result = await res.json();
    // AC-8.1: Highlight entry baru
    newlyAddedId.value = result.id;
    triggerToast('Data properti berhasil disimpan!');
    setTimeout(() => { newlyAddedId.value = null }, 5000); // Hilangkan highlight setelah 5 detik
  } else {
    triggerToast('Terjadi kesalahan saat menyimpan.');
  }

  isFormTerbuka.value = false
  fetchProperties()
}

const hapusProperti = async (id) => {
  modal.title = 'Hapus Properti';
  modal.message = 'Yakin ingin memindahkan aset ini ke arsip?';
  modal.actionType = 'delete';
  modal.targetId = id;
  modal.show = true;
}

const hapusPropertiAction = async (id) => {
  const token = await getCsrfToken();
await fetch(`/api/properties/${id}`, { 
  method: 'DELETE',
  headers: { 'x-csrf-token': token },
  credentials: 'include'
})
  triggerToast('Aset telah dipindahkan ke arsip.');
  fetchProperties()
}

const restoreProperti = async (id) => {
  modal.title = 'Pulihkan Properti';
  modal.message = 'Yakin ingin memulihkan properti ini ke listing aktif?';
  modal.actionType = 'restore';
  modal.targetId = id;
  modal.show = true;
}

const restorePropertiAction = async (id) => {
  const token = await getCsrfToken();
await fetch(`/api/properties/restore/${id}`, { 
  method: 'PUT',
  headers: { 'x-csrf-token': token },
  credentials: 'include'
})
  triggerToast('Aset berhasil dipulihkan.');
  fetchProperties()
}

const toggleArchived = () => { showArchived.value = !showArchived.value; currentPage.value = 1; fetchProperties(); }

const filteredProperties = computed(() => {
  return properties.value; // Sekarang filtering sudah ditangani backend via fetchProperties
})

// HANYA SATU FUNGSI INI SAJA
const resetForm = () => {
  form.value = {
    nama_property: '', group: '', kawasan: '', lebar: 0, panjang: 0, hadap: 'Utara',
    tipe: 'Villa', tingkat: 1, price: 0, carport: true, status: 'in_stock', siap: 'siap_huni', maps_link: '', unit: ''
  }
}

const bukaFormTambah = () => { isEditMode.value = false; resetForm(); isFormTerbuka.value = true }
const bukaFormEdit = (item) => { isEditMode.value = true; editId.value = item.id; form.value = { ...item }; isFormTerbuka.value = true }
const resetFilters = () => { searchQuery.value = ''; filterType.value = 'Semua'; filterStatus.value = 'Semua' }

onMounted(() => {
  const user = localStorage.getItem('user')
  if (user) currentUser.value = JSON.parse(user)
  fetchProperties()
})
</script>